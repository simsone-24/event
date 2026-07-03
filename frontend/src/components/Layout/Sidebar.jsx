import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard, Users, Calendar, CreditCard, Receipt,
  Package, Truck, CheckSquare, ShoppingBag, BarChart2,
  LogOut, ChevronRight, Zap
} from 'lucide-react';

const navItems = [
  { to: '/',          label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/customers', label: 'Customers',   icon: Users },
  { to: '/calendar',  label: 'Calendar',    icon: Calendar },
  { to: '/payments',  label: 'Payments',    icon: CreditCard },
  { to: '/expenses',  label: 'Expenses',    icon: Receipt },
  { to: '/reports',   label: 'Reports',     icon: BarChart2 },
  { label: 'divider' },
  { to: '/vendors',   label: 'Vendors',     icon: ShoppingBag },
  { to: '/inventory', label: 'Inventory',   icon: Package },
  { to: '/vehicles',  label: 'Vehicles',    icon: Truck },
  { to: '/tasks',     label: 'Tasks',       icon: CheckSquare },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="w-64 h-screen bg-card border-r border-border flex flex-col flex-shrink-0 sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-900/40">
          <Zap size={18} className="text-white" />
        </div>
        <div>
          <p className="font-bold text-slate-100 leading-tight text-sm">EventPortal</p>
          <p className="text-xs text-muted">Management Suite</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {navItems.map((item, i) =>
          item.label === 'divider' ? (
            <div key={i} className="my-3 border-t border-border" />
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? 'bg-primary-600/20 text-primary-400 border border-primary-600/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={16} className={isActive ? 'text-primary-400' : 'text-slate-500 group-hover:text-slate-300'} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight size={14} className="text-primary-500" />}
                </>
              )}
            </NavLink>
          )
        )}
      </nav>

      {/* User */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary-700 flex items-center justify-center text-xs font-bold text-white">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
            <p className="text-xs text-muted capitalize">{user?.role?.toLowerCase()}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="btn-ghost w-full justify-start text-xs">
          <LogOut size={14} /> Sign out
        </button>
      </div>
    </aside>
  );
}
