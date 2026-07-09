import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { paymentsAPI, customersAPI } from '../../api';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';
import Field from '../../components/FormField';

const METHODS = ['CASH','UPI','BANK_TRANSFER','CHEQUE'];

export default function PaymentForm() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerId: searchParams.get('customerId') || '',
    totalAmount: '', paidAmount: '', paymentMethod: 'CASH',
    transactionReference: '', paymentDate: new Date().toISOString().slice(0,10),
    paymentStatus: 'NOT_PAID', remarks: '',
  });

  useEffect(() => {
    customersAPI.getAll({ limit: 200 }).then(r => setCustomers(r.data.data));
    if (isEdit) {
      paymentsAPI.getOne(id).then(r => {
        const p = r.data.data;
        setForm({
          customerId: p.customerId, totalAmount: p.totalAmount,
          paidAmount: p.paidAmount, paymentMethod: p.paymentMethod,
          transactionReference: p.transactionReference||'',
          paymentDate: p.paymentDate?.slice(0,10)||'',
          paymentStatus: p.paymentStatus, remarks: p.remarks||'',
        });
      });
    }
  }, [id]);

  const set = (k, v) => setForm(f => {
    const next = { ...f, [k]: v };
    // Auto-calculate pending & status
    if (k === 'totalAmount' || k === 'paidAmount') {
      const total = parseFloat(k === 'totalAmount' ? v : next.totalAmount) || 0;
      const paid  = parseFloat(k === 'paidAmount'  ? v : next.paidAmount)  || 0;
      const pending = total - paid;
      next.pendingAmount = pending < 0 ? 0 : pending;
      next.paymentStatus = paid === 0 ? 'NOT_PAID' : paid >= total ? 'PAID' : 'PARTIAL';
    }
    return next;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...form,
      customerId: parseInt(form.customerId),
      totalAmount: parseFloat(form.totalAmount),
      paidAmount: parseFloat(form.paidAmount),
      pendingAmount: parseFloat(form.pendingAmount || (form.totalAmount - form.paidAmount)),
    };
    try {
      if (isEdit) { await paymentsAPI.update(id, payload); toast.success('Payment updated'); }
      else        { await paymentsAPI.create(payload);     toast.success('Payment recorded'); }
      navigate('/payments');
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setLoading(false); }
  };

  const pending = (parseFloat(form.totalAmount)||0) - (parseFloat(form.paidAmount)||0);

  return (
    <div>
      <div className="page-header">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/payments')} className="btn-ghost p-2"><ArrowLeft size={18}/></button>
          <h1 className="page-title">{isEdit ? 'Edit Payment' : 'Add Payment'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="card mb-5 space-y-4">
          <Field label="Customer *">
            <select className="input" required value={form.customerId} onChange={e => set('customerId', e.target.value)}>
              <option value="">Select customer…</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.customerName} — {c.mobileNumber}</option>)}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Total Amount (₹) *">
              <input type="number" step="0.01" className="input" required value={form.totalAmount}
                onChange={e => set('totalAmount', e.target.value)} placeholder="0.00"/>
            </Field>
            <Field label="Paid Amount (₹) *">
              <input type="number" step="0.01" className="input" required value={form.paidAmount}
                onChange={e => set('paidAmount', e.target.value)} placeholder="0.00"/>
            </Field>
          </div>

          {/* Auto-calculated pending */}
          {form.totalAmount && (
            <div className="bg-surface rounded-lg px-4 py-3 flex justify-between text-sm">
              <span className="text-muted">Pending Amount</span>
              <span className={`font-bold ${pending > 0 ? 'text-amber-400' : 'text-green-400'}`}>
                ₹{Math.max(0, pending).toLocaleString('en-IN')}
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Field label="Payment Method *">
              <select className="input" value={form.paymentMethod} onChange={e => set('paymentMethod', e.target.value)}>
                {METHODS.map(m => <option key={m} value={m}>{m.replace('_',' ')}</option>)}
              </select>
            </Field>
            <Field label="Payment Date *">
              <input type="date" className="input" required value={form.paymentDate}
                onChange={e => set('paymentDate', e.target.value)}/>
            </Field>
          </div>

          <Field label="Transaction Reference">
            <input className="input" value={form.transactionReference}
              onChange={e => set('transactionReference', e.target.value)} placeholder="UTR / Cheque No."/>
          </Field>
          <Field label="Payment Status">
            <select className="input" value={form.paymentStatus} onChange={e => set('paymentStatus', e.target.value)}>
              <option value="NOT_PAID">Not Paid</option>
              <option value="PARTIAL">Partial</option>
              <option value="PAID">Paid</option>
            </select>
          </Field>
          <Field label="Remarks">
            <textarea className="input resize-none" rows={2} value={form.remarks}
              onChange={e => set('remarks', e.target.value)} placeholder="Notes…"/>
          </Field>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary">
            <Save size={16}/> {loading ? 'Saving…' : isEdit ? 'Update' : 'Record Payment'}
          </button>
          <button type="button" onClick={() => navigate('/payments')} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}
