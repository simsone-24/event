import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { customersAPI } from '../../api';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';

const FUNCTION_TYPES = ['Birthday','Wedding','Engagement','Anniversary','Corporate','Baby Shower','Reception','Other'];
const FUNCTION_PLANS = ['Basic','Standard','Premium','Luxury'];
const ORDER_STATUSES = ['PENDING','CONFIRMED','LOST','COMPLETED'];

export default function CustomerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName:'', mobileNumber:'', email:'', address:'',
    functionType:'Birthday', functionDate:'', functionPlan:'Standard',
    location:'', estimationAmountMin:'', estimationAmountMax:'',
    orderStatus:'PENDING', notes:'',
  });

  useEffect(() => {
    if (isEdit) {
      customersAPI.getOne(id)
        .then(r => {
          const c = r.data.data;
          setForm({
            customerName: c.customerName, mobileNumber: c.mobileNumber,
            email: c.email||'', address: c.address||'',
            functionType: c.functionType, functionDate: c.functionDate?.slice(0,10)||'',
            functionPlan: c.functionPlan, location: c.location,
            estimationAmountMin: c.estimationAmountMin,
            estimationAmountMax: c.estimationAmountMax,
            orderStatus: c.orderStatus, notes: c.notes||'',
          });
        })
        .catch(() => toast.error('Failed to load customer'));
    }
  }, [id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) { await customersAPI.update(id, form); toast.success('Customer updated'); }
      else        { await customersAPI.create(form);    toast.success('Customer created'); }
      navigate('/customers');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setLoading(false); }
  };

  const Field = ({ label, children }) => (
    <div><label className="label">{label}</label>{children}</div>
  );

  return (
    <div>
      <div className="page-header">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/customers')} className="btn-ghost p-2">
            <ArrowLeft size={18} />
          </button>
          <h1 className="page-title">{isEdit ? 'Edit Customer' : 'New Customer'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="card mb-5">
          <h2 className="text-sm font-semibold text-slate-300 mb-4 pb-3 border-b border-border">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Customer Name *">
              <input id="cf-name" className="input" required value={form.customerName}
                onChange={e => set('customerName', e.target.value)} placeholder="Full name" />
            </Field>
            <Field label="Mobile Number *">
              <input id="cf-mobile" className="input" required value={form.mobileNumber}
                onChange={e => set('mobileNumber', e.target.value)} placeholder="10-digit number" />
            </Field>
            <Field label="Email">
              <input id="cf-email" type="email" className="input" value={form.email}
                onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
            </Field>
            <Field label="Address">
              <input id="cf-address" className="input" value={form.address}
                onChange={e => set('address', e.target.value)} placeholder="Address" />
            </Field>
          </div>
        </div>

        <div className="card mb-5">
          <h2 className="text-sm font-semibold text-slate-300 mb-4 pb-3 border-b border-border">Event Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Function Type *">
              <select id="cf-function-type" className="input" value={form.functionType} onChange={e => set('functionType', e.target.value)}>
                {FUNCTION_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Function Date *">
              <input id="cf-function-date" type="date" className="input" required value={form.functionDate}
                onChange={e => set('functionDate', e.target.value)} />
            </Field>
            <Field label="Function Plan *">
              <select id="cf-function-plan" className="input" value={form.functionPlan} onChange={e => set('functionPlan', e.target.value)}>
                {FUNCTION_PLANS.map(p => <option key={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Location *">
              <input id="cf-location" className="input" required value={form.location}
                onChange={e => set('location', e.target.value)} placeholder="City / Venue" />
            </Field>
            <Field label="Estimation Min (₹) *">
              <input id="cf-est-min" type="number" className="input" required value={form.estimationAmountMin}
                onChange={e => set('estimationAmountMin', e.target.value)} placeholder="0.00" />
            </Field>
            <Field label="Estimation Max (₹) *">
              <input id="cf-est-max" type="number" className="input" required value={form.estimationAmountMax}
                onChange={e => set('estimationAmountMax', e.target.value)} placeholder="0.00" />
            </Field>
            <Field label="Order Status">
              <select id="cf-status" className="input" value={form.orderStatus} onChange={e => set('orderStatus', e.target.value)}>
                {ORDER_STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Notes">
              <textarea id="cf-notes" className="input resize-none" rows={3} value={form.notes}
                onChange={e => set('notes', e.target.value)} placeholder="Additional notes…" />
            </Field>
          </div>
        </div>

        <div className="flex gap-3">
          <button id="cf-submit" type="submit" disabled={loading} className="btn-primary">
            <Save size={16} /> {loading ? 'Saving…' : isEdit ? 'Update Customer' : 'Create Customer'}
          </button>
          <button type="button" onClick={() => navigate('/customers')} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}
