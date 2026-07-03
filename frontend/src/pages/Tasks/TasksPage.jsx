import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { tasksAPI, customersAPI } from '../../api';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, CheckCircle2, Circle, Clock } from 'lucide-react';
import dayjs from 'dayjs';

const statusIcon = { PENDING: Circle, IN_PROGRESS: Clock, COMPLETED: CheckCircle2 };
const statusColor = { PENDING:'text-amber-400', IN_PROGRESS:'text-blue-400', COMPLETED:'text-green-400' };

export default function TasksPage() {
  const [searchParams] = useSearchParams();
  const [tasks, setTasks] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [form, setForm] = useState({
    customerId: searchParams.get('customerId') || '',
    taskName:'', dueDate:'', status:'PENDING',
  });

  const load = () => tasksAPI.getAll({ customerId: searchParams.get('customerId')||undefined })
    .then(r => setTasks(r.data.data)).catch(() => toast.error('Failed'));

  useEffect(() => {
    load();
    customersAPI.getAll({ limit:200 }).then(r => setCustomers(r.data.data));
  }, []);

  const openNew = () => { setEditTask(null); setForm({ customerId: searchParams.get('customerId')||'', taskName:'', dueDate:'', status:'PENDING' }); setShowForm(true); };
  const openEdit = (t) => { setEditTask(t); setForm({ customerId:t.customerId, taskName:t.taskName, dueDate:t.dueDate?.slice(0,10)||'', status:t.status }); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, customerId: parseInt(form.customerId) };
    try {
      if (editTask) { await tasksAPI.update(editTask.id, payload); toast.success('Task updated'); }
      else          { await tasksAPI.create(payload);              toast.success('Task created'); }
      setShowForm(false); load();
    } catch { toast.error('Save failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try { await tasksAPI.remove(id); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
  };

  const cycleStatus = async (task) => {
    const next = { PENDING:'IN_PROGRESS', IN_PROGRESS:'COMPLETED', COMPLETED:'PENDING' };
    try { await tasksAPI.update(task.id, { status: next[task.status] }); load(); }
    catch { toast.error('Update failed'); }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Tasks</h1>
        <button onClick={openNew} className="btn-primary"><Plus size={16}/> New Task</button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="card w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="font-bold text-slate-100 mb-4">{editTask ? 'Edit Task' : 'New Task'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Customer / Event *</label>
                <select className="input" required value={form.customerId} onChange={e=>set('customerId',e.target.value)}>
                  <option value="">Select…</option>
                  {customers.map(c=><option key={c.id} value={c.id}>{c.customerName}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Task Name *</label>
                <input className="input" required value={form.taskName} onChange={e=>set('taskName',e.target.value)} placeholder="e.g. Book venue, Confirm caterer"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Due Date *</label>
                  <input type="date" className="input" required value={form.dueDate} onChange={e=>set('dueDate',e.target.value)}/>
                </div>
                <div>
                  <label className="label">Status</label>
                  <select className="input" value={form.status} onChange={e=>set('status',e.target.value)}>
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1 justify-center">{editTask ? 'Update' : 'Create Task'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead><tr><th>Status</th><th>Task</th><th>Customer</th><th>Due Date</th><th>Actions</th></tr></thead>
          <tbody>
            {tasks.length === 0
              ? <tr><td colSpan={5} className="text-center py-12 text-muted">No tasks found</td></tr>
              : tasks.map(t => {
                  const Icon = statusIcon[t.status] || Circle;
                  return (
                    <tr key={t.id} className={t.status === 'COMPLETED' ? 'opacity-60' : ''}>
                      <td>
                        <button onClick={() => cycleStatus(t)} className={`${statusColor[t.status]} hover:opacity-70 transition-opacity`} title="Click to advance status">
                          <Icon size={18}/>
                        </button>
                      </td>
                      <td className={`font-medium ${t.status==='COMPLETED'?'line-through text-muted':'text-slate-200'}`}>{t.taskName}</td>
                      <td className="text-muted">{t.customer?.customerName || '—'}</td>
                      <td className={dayjs(t.dueDate).isBefore(dayjs()) && t.status!=='COMPLETED' ? 'text-red-400 font-medium' : ''}>
                        {dayjs(t.dueDate).format('DD MMM YYYY')}
                      </td>
                      <td>
                        <div className="flex gap-1">
                          <button onClick={() => openEdit(t)} className="btn-ghost p-1.5"><Pencil size={14}/></button>
                          <button onClick={() => handleDelete(t.id)} className="btn-ghost p-1.5 text-red-400 hover:text-red-300"><Trash2 size={14}/></button>
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
