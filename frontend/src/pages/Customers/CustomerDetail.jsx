import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { customersAPI } from '../../api';
import toast from 'react-hot-toast';
import { ArrowLeft, Pencil, CreditCard, Receipt, CheckSquare } from 'lucide-react';
import dayjs from 'dayjs';

const statusBadge = (s) => {
  const map = { PENDING:'badge-pending', CONFIRMED:'badge-confirmed', COMPLETED:'badge-completed', LOST:'badge-lost' };
  return <span className={map[s] || 'badge'}>{s}</span>;
};

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [c, setC] = useState(null);

  useEffect(() => {
    customersAPI.getOne(id)
      .then(r => setC(r.data.data))
      .catch(() => toast.error('Failed to load customer'));
  }, [id]);

  if (!c) return <div className="text-muted p-8 text-center">Loading…</div>;

  const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

  return (
    <div>
      <div className="page-header">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/customers')} className="btn-ghost p-2"><ArrowLeft size={18}/></button>
          <div>
            <h1 className="page-title">{c.customerName}</h1>
            <p className="text-sm text-muted">Customer #{c.id} · Added {dayjs(c.createdAt).format('DD MMM YYYY')}</p>
          </div>
        </div>
        <Link to={`/customers/${id}/edit`} className="btn-secondary"><Pencil size={15}/> Edit</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Main info */}
        <div className="lg:col-span-2 card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h2 className="font-semibold text-slate-200">Customer Info</h2>
            {statusBadge(c.orderStatus)}
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              ['Mobile', c.mobileNumber],
              ['Email', c.email || '—'],
              ['Address', c.address || '—'],
              ['Location', c.location],
              ['Function Type', c.functionType],
              ['Function Plan', c.functionPlan],
              ['Function Date', dayjs(c.functionDate).format('DD MMM YYYY')],
              ['Est. Range', `${fmt(c.estimationAmountMin)} – ${fmt(c.estimationAmountMax)}`],
            ].map(([k,v]) => (
              <div key={k}>
                <p className="text-xs text-muted mb-0.5">{k}</p>
                <p className="text-slate-200 font-medium">{v}</p>
              </div>
            ))}
          </div>
          {c.notes && (
            <div className="pt-3 border-t border-border">
              <p className="text-xs text-muted mb-1">Notes</p>
              <p className="text-sm text-slate-300">{c.notes}</p>
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="space-y-3">
          <Link to={`/payments/new?customerId=${id}`} className="card flex items-center gap-3 hover:border-primary-600/50 transition-colors cursor-pointer">
            <div className="stat-icon bg-blue-900/30 text-blue-400"><CreditCard size={18}/></div>
            <div>
              <p className="font-medium text-slate-200">Payments</p>
              <p className="text-xs text-muted">{c.payments?.length || 0} transactions</p>
            </div>
          </Link>
          <Link to={`/expenses/new?customerId=${id}`} className="card flex items-center gap-3 hover:border-primary-600/50 transition-colors cursor-pointer">
            <div className="stat-icon bg-red-900/30 text-red-400"><Receipt size={18}/></div>
            <div>
              <p className="font-medium text-slate-200">Expenses</p>
              <p className="text-xs text-muted">{c.expenses?.length || 0} entries</p>
            </div>
          </Link>
          <Link to={`/tasks?customerId=${id}`} className="card flex items-center gap-3 hover:border-primary-600/50 transition-colors cursor-pointer">
            <div className="stat-icon bg-green-900/30 text-green-400"><CheckSquare size={18}/></div>
            <div>
              <p className="font-medium text-slate-200">Tasks</p>
              <p className="text-xs text-muted">{c.tasks?.length || 0} tasks</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Payments table */}
      {c.payments?.length > 0 && (
        <div className="card mb-5">
          <h2 className="font-semibold text-slate-200 mb-4">Payment History</h2>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Date</th><th>Total</th><th>Paid</th><th>Pending</th><th>Method</th><th>Status</th></tr></thead>
              <tbody>
                {c.payments.map(p => (
                  <tr key={p.id}>
                    <td>{dayjs(p.paymentDate).format('DD MMM YYYY')}</td>
                    <td>{fmt(p.totalAmount)}</td>
                    <td className="text-green-400">{fmt(p.paidAmount)}</td>
                    <td className="text-amber-400">{fmt(p.pendingAmount)}</td>
                    <td>{p.paymentMethod.replace('_',' ')}</td>
                    <td><span className={`badge-${p.paymentStatus.toLowerCase()}`}>{p.paymentStatus.replace('_',' ')}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Expenses table */}
      {c.expenses?.length > 0 && (
        <div className="card">
          <h2 className="font-semibold text-slate-200 mb-4">Expense History</h2>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Date</th><th>Category</th><th>Amount</th><th>Description</th></tr></thead>
              <tbody>
                {c.expenses.map(e => (
                  <tr key={e.id}>
                    <td>{dayjs(e.expenseDate).format('DD MMM YYYY')}</td>
                    <td>{e.expenseCategory}</td>
                    <td className="text-red-400">{fmt(e.amount)}</td>
                    <td>{e.description || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
