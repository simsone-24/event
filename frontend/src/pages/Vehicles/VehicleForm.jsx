import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { vehiclesAPI } from '../../api';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';
import Field from '../../components/FormField';

export default function VehicleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ vehicleNumber:'', vehicleType:'', driverName:'', capacity:1, status:'AVAILABLE' });

  useEffect(() => {
    if (isEdit) vehiclesAPI.getOne(id).then(r => {
      const v = r.data.data;
      setForm({ vehicleNumber:v.vehicleNumber, vehicleType:v.vehicleType, driverName:v.driverName, capacity:v.capacity, status:v.status });
    });
  }, [id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...form, capacity: parseInt(form.capacity) };
    try {
      if (isEdit) { await vehiclesAPI.update(id, payload); toast.success('Vehicle updated'); }
      else        { await vehiclesAPI.create(payload);     toast.success('Vehicle added'); }
      navigate('/vehicles');
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/vehicles')} className="btn-ghost p-2"><ArrowLeft size={18}/></button>
          <h1 className="page-title">{isEdit ? 'Edit Vehicle' : 'Add Vehicle'}</h1>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="max-w-lg">
        <div className="card mb-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Vehicle Number *"><input className="input font-mono" required value={form.vehicleNumber} onChange={e=>set('vehicleNumber',e.target.value)} placeholder="TN01AB1234"/></Field>
            <Field label="Vehicle Type *"><input className="input" required value={form.vehicleType} onChange={e=>set('vehicleType',e.target.value)} placeholder="Van, Bus, SUV…"/></Field>
            <Field label="Driver Name *"><input className="input" required value={form.driverName} onChange={e=>set('driverName',e.target.value)}/></Field>
            <Field label="Capacity"><input type="number" className="input" min={1} value={form.capacity} onChange={e=>set('capacity',e.target.value)}/></Field>
          </div>
          <Field label="Status">
            <select className="input" value={form.status} onChange={e=>set('status',e.target.value)}>
              <option value="AVAILABLE">Available</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </Field>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary"><Save size={16}/>{loading?'Saving…':isEdit?'Update':'Add Vehicle'}</button>
          <button type="button" onClick={()=>navigate('/vehicles')} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}
