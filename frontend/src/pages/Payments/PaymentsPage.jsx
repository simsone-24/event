import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { paymentsAPI } from '../../api';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Search, Filter } from 'lucide-react';
import dayjs from 'dayjs';

const statusBadge = (s) => {
  const map = { PAID:'badge-paid', PARTIAL:'badge-partial', NOT_PAID:'badge-not_paid' };
  return <span className={map[s] || 'badge'}>{s.replace('_',' ')}</span>;
};

export default function PaymentsPage() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const load = () =>
    paymentsAPI.getAll({ search, status })
      .then(r => { setPayments(r.data.data); setTotal(r.data.total); })
      .catch(() => toast.error('Failed to load payments'));

  useEffect(() => {
    load();
  }, [search, status]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this payment record?')) return;
    try { await paymentsAPI.remove(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Payment Tracker</h1>
          <p className="text-sm text-muted">{total} records</p>
        </div>
        <Link to="/payments/new" className="btn-primary"><Plus size={16}/> Add Payment</Link>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-52">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"/>
          <input className="input pl-9" placeholder="Search customer…" value={search}
            onChange={e => setSearch(e.target.value)}/>
        </div>
        <div className="relative">
          <Filter size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"/>
          <select className="input pl-9 appearance-none" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="NOT_PAID">Not Paid</option>
            <option value="PARTIAL">Partial</option>
            <option value="PAID">Paid</option>
          </select>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Customer</th><th>Total</th><th>Paid</th><th>Pending</th>
              <th>Method</th><th>Date</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0
              ? <tr><td colSpan={9} className="text-center py-12 text-muted">No payments found</td></tr>
              : payments.map(p => (
                <tr key={p.id}>
                  <td className="text-muted font-mono text-xs">#{p.id}</td>
                  <td className="font-medium text-slate-200">{p.customer?.customerName || '—'}</td>
                  <td>{fmt(p.totalAmount)}</td>
                  <td className="text-green-400">{fmt(p.paidAmount)}</td>
                  <td className="text-amber-400">{fmt(p.pendingAmount)}</td>
                  <td>{p.paymentMethod.replace('_',' ')}</td>
                  <td>{dayjs(p.paymentDate).format('DD MMM YYYY')}</td>
                  <td>{statusBadge(p.paymentStatus)}</td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => navigate(`/payments/${p.id}/edit`)} className="btn-ghost p-1.5"><Pencil size={14}/></button>
                      <button onClick={() => handleDelete(p.id)} className="btn-ghost p-1.5 text-red-400 hover:text-red-300"><Trash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
