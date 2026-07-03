import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { expensesAPI } from '../../api';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Search, Filter } from 'lucide-react';
import dayjs from 'dayjs';

const CATEGORIES = ['CATERING','DECORATION','PHOTOGRAPHY','TRANSPORTATION','VENUE','ACCOMMODATION','PRINTING','MISCELLANEOUS'];

export default function ExpensesPage() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const load = () =>
    expensesAPI.getAll({ search, category })
      .then(r => { setExpenses(r.data.data); setTotal(r.data.total); })
      .catch(() => toast.error('Failed to load expenses'));

  useEffect(() => {
    load();
  }, [search, category]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this expense?')) return;
    try { await expensesAPI.remove(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;
  const grandTotal = expenses.reduce((s, e) => s + Number(e.amount), 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Expenses</h1>
          <p className="text-sm text-muted">{total} records · Total: <span className="text-red-400 font-semibold">{fmt(grandTotal)}</span></p>
        </div>
        <Link to="/expenses/new" className="btn-primary"><Plus size={16}/> Add Expense</Link>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-52">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"/>
          <input className="input pl-9" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
        <div className="relative">
          <Filter size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"/>
          <select className="input pl-9 appearance-none" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>ID</th><th>Customer</th><th>Category</th><th>Amount</th><th>Date</th><th>Description</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {expenses.length === 0
              ? <tr><td colSpan={7} className="text-center py-12 text-muted">No expenses found</td></tr>
              : expenses.map(e => (
                <tr key={e.id}>
                  <td className="text-muted font-mono text-xs">#{e.id}</td>
                  <td className="font-medium text-slate-200">{e.customer?.customerName || '—'}</td>
                  <td>
                    <span className="badge bg-slate-700 text-slate-300">{e.expenseCategory}</span>
                  </td>
                  <td className="text-red-400 font-medium">{fmt(e.amount)}</td>
                  <td>{dayjs(e.expenseDate).format('DD MMM YYYY')}</td>
                  <td className="max-w-xs truncate text-muted">{e.description || '—'}</td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => navigate(`/expenses/${e.id}/edit`)} className="btn-ghost p-1.5"><Pencil size={14}/></button>
                      <button onClick={() => handleDelete(e.id)} className="btn-ghost p-1.5 text-red-400 hover:text-red-300"><Trash2 size={14}/></button>
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
