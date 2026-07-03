import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { vendorsAPI } from '../../api';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function VendorsPage() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);

  const load = () => vendorsAPI.getAll().then(r => setVendors(r.data.data)).catch(() => toast.error('Failed'));
  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this vendor?')) return;
    try { await vendorsAPI.remove(id); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Vendors</h1>
        <Link to="/vendors/new" className="btn-primary"><Plus size={16}/> Add Vendor</Link>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Vendor</th><th>Mobile</th><th>Service</th><th>Contract</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {vendors.length === 0
              ? <tr><td colSpan={7} className="text-center py-12 text-muted">No vendors found</td></tr>
              : vendors.map(v => (
                <tr key={v.id}>
                  <td className="text-muted font-mono text-xs">#{v.id}</td>
                  <td>
                    <div className="font-medium text-slate-200">{v.vendorName}</div>
                    <div className="text-xs text-muted">{v.email||'—'}</div>
                  </td>
                  <td>{v.mobileNumber}</td>
                  <td><span className="badge bg-slate-700 text-slate-300">{v.serviceType.replace('_',' ')}</span></td>
                  <td>{v.contractAmount ? `₹${Number(v.contractAmount).toLocaleString('en-IN')}` : '—'}</td>
                  <td>
                    <span className={v.status==='ACTIVE'?'badge-confirmed':'badge-lost'}>{v.status}</span>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => navigate(`/vendors/${v.id}/edit`)} className="btn-ghost p-1.5"><Pencil size={14}/></button>
                      <button onClick={() => handleDelete(v.id)} className="btn-ghost p-1.5 text-red-400 hover:text-red-300"><Trash2 size={14}/></button>
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
