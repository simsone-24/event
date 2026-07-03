import { useEffect, useState } from 'react';
import { reportsAPI } from '../../api';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Download } from 'lucide-react';

const fmt = (n) => `₹${Number(n||0).toLocaleString('en-IN')}`;

export default function ReportsPage() {
  const [dateFrom, setDateFrom] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
  const [dateTo,   setDateTo]   = useState(dayjs().format('YYYY-MM-DD'));
  const [customers, setCustomers] = useState([]);
  const [payments,  setPayments]  = useState([]);
  const [expenses,  setExpenses]  = useState([]);
  const [pl,        setPl]        = useState(null);

  const load = () => {
    const params = { dateFrom, dateTo };
    Promise.all([
      reportsAPI.getCustomerReport(params),
      reportsAPI.getPaymentReport(params),
      reportsAPI.getExpenseReport(params),
      reportsAPI.getProfitLoss(params),
    ]).then(([cr, pr, er, plr]) => {
      setCustomers(cr.data.data || []);
      setPayments(pr.data.data  || []);
      setExpenses(er.data.data  || []);
      setPl(plr.data.data);
    }).catch(() => toast.error('Failed to load reports'));
  };

  useEffect(() => {
    load();
  }, [dateFrom, dateTo]);

  const expenseByCategory = expenses.reduce((acc, e) => {
    const key = e.expenseCategory;
    acc[key] = (acc[key] || 0) + Number(e.amount);
    return acc;
  }, {});
  const expenseChartData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Reports</h1>
        <div className="flex gap-3 items-center flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted">From</label>
            <input type="date" className="input py-1.5 text-xs w-36" value={dateFrom} onChange={e => setDateFrom(e.target.value)}/>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted">To</label>
            <input type="date" className="input py-1.5 text-xs w-36" value={dateTo} onChange={e => setDateTo(e.target.value)}/>
          </div>
          <button onClick={load} className="btn-primary py-1.5 text-xs">Apply</button>
        </div>
      </div>

      {/* P&L Summary */}
      {pl && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label:'Total Revenue',   value: fmt(pl.revenue),                        color:'text-blue-400' },
            { label:'Total Expenses',  value: fmt(pl.expenses),                       color:'text-red-400' },
            { label:'Pending Payments',value: fmt(pl.pendingPayments),                color:'text-amber-400' },
            { label:'Net Profit',      value: fmt(pl.profit), color: Number(pl.profit||0)>=0?'text-green-400':'text-red-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="card text-center">
              <p className="text-xs text-muted mb-1">{label}</p>
              <p className={`text-xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Expense by category chart */}
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Expenses by Category</h2>
          {expenseChartData.length === 0
            ? <p className="text-muted text-sm text-center py-8">No expense data</p>
            : <ResponsiveContainer width="100%" height={220}>
                <BarChart data={expenseChartData} layout="vertical">
                  <XAxis type="number" tick={{fill:'#64748b',fontSize:11}} axisLine={false} tickLine={false}
                         tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`}/>
                  <YAxis type="category" dataKey="name" tick={{fill:'#94a3b8',fontSize:11}} axisLine={false} tickLine={false} width={90}/>
                  <Tooltip contentStyle={{background:'#1e293b',border:'1px solid #334155',borderRadius:8}}
                           formatter={v=>[fmt(v),'']}/>
                  <Bar dataKey="value" radius={[0,4,4,0]} fill="#3b82f6"/>
                </BarChart>
              </ResponsiveContainer>
          }
        </div>

        {/* Customer status summary */}
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Customer Inquiry Report</h2>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Status</th><th>Count</th></tr></thead>
              <tbody>
                {['PENDING','CONFIRMED','COMPLETED','LOST'].map(s => ({
                  status: s,
                  count: customers.filter(c => c.orderStatus === s).length,
                })).map(row => (
                  <tr key={row.status}>
                    <td>
                      <span className={`badge-${row.status.toLowerCase()}`}>{row.status}</span>
                    </td>
                    <td className="font-semibold text-slate-200">{row.count}</td>
                  </tr>
                ))}
                <tr className="bg-surface/50">
                  <td className="font-semibold text-slate-300">Total</td>
                  <td className="font-bold text-slate-100">{customers.length}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment report table */}
      <div className="card mb-6">
        <h2 className="text-sm font-semibold text-slate-300 mb-4">Payment Report</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Customer</th><th>Total</th><th>Paid</th><th>Pending</th><th>Method</th><th>Status</th></tr></thead>
            <tbody>
              {payments.length === 0
                ? <tr><td colSpan={6} className="text-center py-8 text-muted">No payment data</td></tr>
                : payments.map(p => (
                  <tr key={p.id}>
                    <td className="font-medium text-slate-200">{p.customer?.customerName || '—'}</td>
                    <td>{fmt(p.totalAmount)}</td>
                    <td className="text-green-400">{fmt(p.paidAmount)}</td>
                    <td className="text-amber-400">{fmt(p.pendingAmount)}</td>
                    <td>{p.paymentMethod.replace('_',' ')}</td>
                    <td><span className={`badge-${p.paymentStatus.toLowerCase().replace('_','-')}`}>{p.paymentStatus.replace('_',' ')}</span></td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
