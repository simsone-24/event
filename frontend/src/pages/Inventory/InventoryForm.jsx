import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { inventoryAPI } from '../../api';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';

export default function InventoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ itemName:'', category:'', quantityAvailable:0 });

  useEffect(() => {
    if (isEdit) inventoryAPI.getOne(id).then(r => {
      const item = r.data.data;
      setForm({ itemName: item.itemName, category: item.category, quantityAvailable: item.quantityAvailable });
    });
  }, [id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...form, quantityAvailable: parseInt(form.quantityAvailable) };
    try {
      if (isEdit) { await inventoryAPI.update(id, payload); toast.success('Item updated'); }
      else        { await inventoryAPI.create(payload);     toast.success('Item added'); }
      navigate('/inventory');
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setLoading(false); }
  };

  const Field = ({ label, children }) => <div><label className="label">{label}</label>{children}</div>;

  return (
    <div>
      <div className="page-header">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/inventory')} className="btn-ghost p-2"><ArrowLeft size={18}/></button>
          <h1 className="page-title">{isEdit ? 'Edit Item' : 'Add Item'}</h1>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="max-w-lg">
        <div className="card mb-5 space-y-4">
          <Field label="Item Name *"><input className="input" required value={form.itemName} onChange={e=>set('itemName',e.target.value)}/></Field>
          <Field label="Category *"><input className="input" required value={form.category} onChange={e=>set('category',e.target.value)} placeholder="e.g. Decor, AV Equipment"/></Field>
          <Field label="Initial Quantity">
            <input type="number" className="input" value={form.quantityAvailable} min={0} onChange={e=>set('quantityAvailable',e.target.value)}/>
          </Field>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary"><Save size={16}/>{loading?'Saving…':isEdit?'Update':'Add Item'}</button>
          <button type="button" onClick={()=>navigate('/inventory')} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}
