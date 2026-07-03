import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { vehiclesAPI } from '../../api';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const statusColor = { AVAILABLE:'badge-confirmed', ASSIGNED:'badge-pending', MAINTENANCE:'badge-lost' };

export default function VehiclesPage() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);

  const load = () => vehiclesAPI.getAll().then(r => setVehicles(r.data.data)).catch(() => toast.error('Failed'));
  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this vehicle?')) return;
    try { await vehiclesAPI.remove(id); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Vehicles</h1>
        <Link to="/vehicles/new" className="btn-primary"><Plus size={16}/> Add Vehicle</Link>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Vehicle No.</th><th>Type</th><th>Driver</th><th>Capacity</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {vehicles.length === 0
              ? <tr><td colSpan={7} className="text-center py-12 text-muted">No vehicles found</td></tr>
              : vehicles.map(v => (
                <tr key={v.id}>
                  <td className="text-muted font-mono text-xs">#{v.id}</td>
                  <td className="font-medium text-slate-200 font-mono">{v.vehicleNumber}</td>
                  <td>{v.vehicleType}</td>
                  <td>{v.driverName}</td>
                  <td>{v.capacity}</td>
                  <td><span className={statusColor[v.status]||'badge'}>{v.status}</span></td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => navigate(`/vehicles/${v.id}/edit`)} className="btn-ghost p-1.5"><Pencil size={14}/></button>
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
