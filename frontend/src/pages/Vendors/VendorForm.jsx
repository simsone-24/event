import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { vendorsAPI } from '../../api';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';

const SERVICE_TYPES = ['CATERING','DECORATION','PHOTOGRAPHY','DJ','SOUND_SYSTEM','TRANSPORTATION'];

export default function VendorForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    vendorName:'', mobileNumber:'', email:'', address:'',
    serviceType:'CATERING', contractAmount:'', status:'ACTIVE',
  });

  useEffect(() => {
    if (isEdit) vendorsAPI.getOne(id).then(r => {
      const v = r.data.data;
      setForm({ vendorName:v.vendorName, mobileNumber:v.mobileNumber, email:v.email||'',
                address:v.address||'', serviceType:v.serviceType, contractAmount:v.contractAmount||'', status:v.status });
    });
  }, [id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...form, contractAmount: form.contractAmount ? parseFloat(form.contractAmount) : null };
    try {
      if (isEdit) { await vendorsAPI.update(id, payload); toast.success('Vendor updated'); }
      else        { await vendorsAPI.create(payload);     toast.success('Vendor added'); }
      navigate('/vendors');
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setLoading(false); }
  };

  const Field = ({ label, children }) => <div><label className="label">{label}</label>{children}</div>;

  return (
    <div>
      <div className="page-header">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/vendors')} className="btn-ghost p-2"><ArrowLeft size={18}/></button>
          <h1 className="page-title">{isEdit ? 'Edit Vendor' : 'Add Vendor'}</h1>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="card mb-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Vendor Name *"><input className="input" required value={form.vendorName} onChange={e=>set('vendorName',e.target.value)}/></Field>
            <Field label="Mobile *"><input className="input" required value={form.mobileNumber} onChange={e=>set('mobileNumber',e.target.value)}/></Field>
            <Field label="Email"><input type="email" className="input" value={form.email} onChange={e=>set('email',e.target.value)}/></Field>
            <Field label="Service Type">
              <select className="input" value={form.serviceType} onChange={e=>set('serviceType',e.target.value)}>
                {SERVICE_TYPES.map(s=><option key={s} value={s}>{s.replace('_',' ')}</option>)}
              </select>
            </Field>
            <Field label="Contract Amount (₹)"><input type="number" step="0.01" className="input" value={form.contractAmount} onChange={e=>set('contractAmount',e.target.value)} placeholder="Optional"/></Field>
            <Field label="Status">
              <select className="input" value={form.status} onChange={e=>set('status',e.target.value)}>
                <option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option>
              </select>
            </Field>
          </div>
          <Field label="Address"><input className="input" value={form.address} onChange={e=>set('address',e.target.value)}/></Field>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary"><Save size={16}/>{loading?'Saving…':isEdit?'Update':'Add Vendor'}</button>
          <button type="button" onClick={()=>navigate('/vendors')} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}
