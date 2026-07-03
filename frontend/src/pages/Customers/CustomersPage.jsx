import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { customersAPI } from '../../api';
import toast from 'react-hot-toast';
import { Plus, Search, Filter, Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import dayjs from 'dayjs';

const statusBadge = (s) => {
  const map = { PENDING:'badge-pending', CONFIRMED:'badge-confirmed', COMPLETED:'badge-completed', LOST:'badge-lost' };
  return <span className={map[s] || 'badge'}>{s}</span>;
};

export default function CustomersPage() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [total, setTotal]         = useState(0);
  const [search, setSearch]       = useState('');
  const [status, setStatus]       = useState('');
  const [page, setPage]           = useState(1);
  const limit = 20;

  const load = () => {
    customersAPI.getAll({ search, status, page, limit })
      .then(r => { setCustomers(r.data.data); setTotal(r.data.total); })
      .catch(() => toast.error('Failed to load customers'));
  };

  useEffect(() => {
    load();
  }, [search, status, page]);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await customersAPI.remove(id);
      toast.success('Customer deleted');
      load();
    } catch { toast.error('Delete failed'); }
  };

  const pages = Math.ceil(total / limit);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="text-sm text-muted">{total} total records</p>
        </div>
        <Link to="/customers/new" className="btn-primary">
          <Plus size={16} /> New Customer
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-52">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input id="customer-search" className="input pl-9" placeholder="Search name, mobile, email…"
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <div className="relative">
          <Filter size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <select id="customer-status-filter" className="input pl-9 pr-8 appearance-none cursor-pointer"
            value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="LOST">Lost</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Customer</th><th>Mobile</th><th>Function</th>
              <th>Date</th><th>Location</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-12 text-muted">No customers found</td></tr>
            ) : customers.map(c => (
              <tr key={c.id}>
                <td className="text-muted font-mono text-xs">#{c.id}</td>
                <td>
                  <div className="font-medium text-slate-200">{c.customerName}</div>
                  <div className="text-xs text-muted">{c.email || '—'}</div>
                </td>
                <td>{c.mobileNumber}</td>
                <td>
                  <div>{c.functionType}</div>
                  <div className="text-xs text-muted">{c.functionPlan}</div>
                </td>
                <td className="whitespace-nowrap">{dayjs(c.functionDate).format('DD MMM YYYY')}</td>
                <td>{c.location}</td>
                <td>{statusBadge(c.orderStatus)}</td>
                <td>
                  <div className="flex gap-1">
                    <button onClick={() => navigate(`/customers/${c.id}`)} className="btn-ghost p-1.5" title="View">
                      <Eye size={14} />
                    </button>
                    <button onClick={() => navigate(`/customers/${c.id}/edit`)} className="btn-ghost p-1.5" title="Edit">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(c.id, c.customerName)} className="btn-ghost p-1.5 text-red-400 hover:text-red-300" title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-muted">Page {page} of {pages}</p>
          <div className="flex gap-2">
            <button className="btn-secondary px-3 py-1.5 text-xs" disabled={page===1} onClick={() => setPage(p=>p-1)}>
              <ChevronLeft size={14} /> Prev
            </button>
            <button className="btn-secondary px-3 py-1.5 text-xs" disabled={page===pages} onClick={() => setPage(p=>p+1)}>
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
