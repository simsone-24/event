import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { inventoryAPI } from '../../api';
import toast from 'react-hot-toast';
import { Plus, Pencil, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

export default function InventoryPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  const load = () => inventoryAPI.getAll().then(r => setItems(r.data.data)).catch(() => toast.error('Failed'));
  useEffect(() => {
    load();
  }, []);

  const handleStockIn = async (id) => {
    const qty = prompt('Quantity to add:');
    if (!qty || isNaN(qty)) return;
    try { await inventoryAPI.stockIn(id, { quantity: parseInt(qty), notes: 'Manual stock-in' }); toast.success('Stock updated'); load(); }
    catch { toast.error('Failed'); }
  };

  const handleStockOut = async (id) => {
    const qty = prompt('Quantity to use:');
    if (!qty || isNaN(qty)) return;
    try { await inventoryAPI.stockOut(id, { quantity: parseInt(qty), notes: 'Manual stock-out' }); toast.success('Stock updated'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Inventory</h1>
        <Link to="/inventory/new" className="btn-primary"><Plus size={16}/> Add Item</Link>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Item</th><th>Category</th><th>Available</th><th>Used</th><th>Remaining</th><th>Actions</th></tr></thead>
          <tbody>
            {items.length === 0
              ? <tr><td colSpan={7} className="text-center py-12 text-muted">No items found</td></tr>
              : items.map(item => {
                  const remaining = item.quantityAvailable - item.quantityUsed;
                  const lowStock = remaining <= 5;
                  return (
                    <tr key={item.id}>
                      <td className="text-muted font-mono text-xs">#{item.id}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-200">{item.itemName}</span>
                          {lowStock && <AlertTriangle size={14} className="text-amber-400" title="Low stock"/>}
                        </div>
                      </td>
                      <td><span className="badge bg-slate-700 text-slate-300">{item.category}</span></td>
                      <td className="text-blue-400 font-medium">{item.quantityAvailable}</td>
                      <td className="text-red-400">{item.quantityUsed}</td>
                      <td>
                        <span className={`font-bold ${remaining <= 0 ? 'text-red-400' : lowStock ? 'text-amber-400' : 'text-green-400'}`}>
                          {remaining}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-1">
                          <button onClick={() => handleStockIn(item.id)} className="btn-ghost p-1.5 text-green-400" title="Stock In"><TrendingUp size={14}/></button>
                          <button onClick={() => handleStockOut(item.id)} className="btn-ghost p-1.5 text-red-400" title="Stock Out"><TrendingDown size={14}/></button>
                          <button onClick={() => navigate(`/inventory/${item.id}/edit`)} className="btn-ghost p-1.5"><Pencil size={14}/></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
