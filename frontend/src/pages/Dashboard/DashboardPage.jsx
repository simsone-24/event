import { useEffect, useState } from 'react';
import { dashboardAPI } from '../../api';
import {
  Users, CalendarDays, CheckCircle2, XCircle, Clock,
  DollarSign, TrendingUp, TrendingDown,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import toast from 'react-hot-toast';

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'];

function StatCard({ icon: Icon, label, value, sub, color = 'blue' }) {
  const colors = {
    blue:   'bg-blue-900/30 text-blue-400',
    green:  'bg-green-900/30 text-green-400',
    amber:  'bg-amber-900/30 text-amber-400',
    red:    'bg-red-900/30 text-red-400',
    purple: 'bg-purple-900/30 text-purple-400',
  };
  return (
    <div className="stat-card">
      <div className={`stat-icon ${colors[color]}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-xs text-muted font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-100">{value ?? '—'}</p>
        {sub && <p className="text-xs text-muted mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    dashboardAPI.getStats()
      .then(r => setStats(r.data.data))
      .catch(() => toast.error('Failed to load dashboard stats'));
  }, []);

  const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

  const c = stats?.customers || {};
  const e = stats?.events    || {};
  const f = stats?.finance   || {};

  const orderData = [
    { name: 'Pending',   value: c.pending   || 0 },
    { name: 'Confirmed', value: c.confirmed || 0 },
    { name: 'Completed', value: c.completed || 0 },
    { name: 'Lost',      value: c.lost      || 0 },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-sm text-muted mt-0.5">Welcome back — here's what's happening.</p>
        </div>
      </div>

      {/* Customer stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users}        label="Total Customers"  value={c.total}     color="blue" />
        <StatCard icon={Clock}        label="Pending Orders"   value={c.pending}   color="amber" />
        <StatCard icon={CheckCircle2} label="Confirmed Orders" value={c.confirmed} color="green" />
        <StatCard icon={XCircle}      label="Lost Orders"      value={c.lost}      color="red" />
      </div>

      {/* Event + financial stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={CalendarDays} label="Upcoming Events"  value={e.upcoming?.length ?? 0} color="purple" />
        <StatCard icon={DollarSign}   label="Total Revenue"    value={fmt(f.totalRevenue)}    color="green" />
        <StatCard icon={TrendingDown} label="Total Expenses"   value={fmt(f.totalExpenses)}   color="red" />
        <StatCard icon={TrendingUp}   label="Pending Payments" value={fmt(f.pendingPayments)} color="amber" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order status pie */}
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Order Status Distribution</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={orderData} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                   dataKey="value" paddingAngle={3}>
                {orderData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Legend formatter={(v) => <span className="text-xs text-slate-400">{v}</span>} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                labelStyle={{ color: '#94a3b8' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue vs Expense bar */}
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Financial Overview</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={[
              { name: 'Revenue',  amount: Number(f.totalRevenue    || 0) },
              { name: 'Expenses', amount: Number(f.totalExpenses   || 0) },
              { name: 'Pending',  amount: Number(f.pendingPayments || 0) },
            ]}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false}
                     tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                formatter={v => [`₹${Number(v).toLocaleString('en-IN')}`, '']}
              />
              <Bar dataKey="amount" radius={[6,6,0,0]}>
                {[0,1,2].map(i => <Cell key={i} fill={COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
