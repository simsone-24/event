import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { expensesAPI, customersAPI } from '../../api';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';
import Field from '../../components/FormField';

const CATEGORIES = ['CATERING','DECORATION','PHOTOGRAPHY','TRANSPORTATION','VENUE','ACCOMMODATION','PRINTING','MISCELLANEOUS'];

export default function ExpenseForm() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerId: searchParams.get('customerId') || '',
    expenseCategory: 'CATERING',
    amount: '',
    expenseDate: new Date().toISOString().slice(0,10),
    description: '',
  });

  useEffect(() => {
    customersAPI.getAll({ limit: 200 }).then(r => setCustomers(r.data.data));
    if (isEdit) {
      expensesAPI.getOne(id).then(r => {
        const e = r.data.data;
        setForm({
          customerId: e.customerId, expenseCategory: e.expenseCategory,
          amount: e.amount, expenseDate: e.expenseDate?.slice(0,10)||'',
          description: e.description||'',
        });
      });
    }
  }, [id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...form, customerId: parseInt(form.customerId), amount: parseFloat(form.amount) };
    try {
      if (isEdit) { await expensesAPI.update(id, payload); toast.success('Expense updated'); }
      else        { await expensesAPI.create(payload);     toast.success('Expense added'); }
      navigate('/expenses');
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/expenses')} className="btn-ghost p-2"><ArrowLeft size={18}/></button>
          <h1 className="page-title">{isEdit ? 'Edit Expense' : 'Add Expense'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="card mb-5 space-y-4">
          <Field label="Customer / Event *">
            <select className="input" required value={form.customerId} onChange={e => set('customerId', e.target.value)}>
              <option value="">Select customer…</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.customerName} — {c.mobileNumber}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category *">
              <select className="input" value={form.expenseCategory} onChange={e => set('expenseCategory', e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Amount (₹) *">
              <input type="number" step="0.01" className="input" required value={form.amount}
                onChange={e => set('amount', e.target.value)} placeholder="0.00"/>
            </Field>
          </div>
          <Field label="Expense Date *">
            <input type="date" className="input" required value={form.expenseDate}
              onChange={e => set('expenseDate', e.target.value)}/>
          </Field>
          <Field label="Description">
            <textarea className="input resize-none" rows={3} value={form.description}
              onChange={e => set('description', e.target.value)} placeholder="Details about the expense…"/>
          </Field>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary">
            <Save size={16}/> {loading ? 'Saving…' : isEdit ? 'Update' : 'Add Expense'}
          </button>
          <button type="button" onClick={() => navigate('/expenses')} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}
