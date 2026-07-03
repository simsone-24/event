import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/Layout/AppLayout';

import LoginPage        from './pages/Auth/LoginPage';
import DashboardPage    from './pages/Dashboard/DashboardPage';
import CustomersPage    from './pages/Customers/CustomersPage';
import CustomerForm     from './pages/Customers/CustomerForm';
import CustomerDetail   from './pages/Customers/CustomerDetail';
import CalendarPage     from './pages/Calendar/CalendarPage';
import PaymentsPage     from './pages/Payments/PaymentsPage';
import PaymentForm      from './pages/Payments/PaymentForm';
import ExpensesPage     from './pages/Expenses/ExpensesPage';
import ExpenseForm      from './pages/Expenses/ExpenseForm';
import ReportsPage      from './pages/Reports/ReportsPage';
import VendorsPage      from './pages/Vendors/VendorsPage';
import VendorForm       from './pages/Vendors/VendorForm';
import InventoryPage    from './pages/Inventory/InventoryPage';
import InventoryForm    from './pages/Inventory/InventoryForm';
import VehiclesPage     from './pages/Vehicles/VehiclesPage';
import VehicleForm      from './pages/Vehicles/VehicleForm';
import TasksPage        from './pages/Tasks/TasksPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' },
          }}
        />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<DashboardPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="customers/new" element={<CustomerForm />} />
            <Route path="customers/:id/edit" element={<CustomerForm />} />
            <Route path="customers/:id" element={<CustomerDetail />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="payments/new" element={<PaymentForm />} />
            <Route path="payments/:id/edit" element={<PaymentForm />} />
            <Route path="expenses" element={<ExpensesPage />} />
            <Route path="expenses/new" element={<ExpenseForm />} />
            <Route path="expenses/:id/edit" element={<ExpenseForm />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="vendors" element={<VendorsPage />} />
            <Route path="vendors/new" element={<VendorForm />} />
            <Route path="vendors/:id/edit" element={<VendorForm />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="inventory/new" element={<InventoryForm />} />
            <Route path="inventory/:id/edit" element={<InventoryForm />} />
            <Route path="vehicles" element={<VehiclesPage />} />
            <Route path="vehicles/new" element={<VehicleForm />} />
            <Route path="vehicles/:id/edit" element={<VehicleForm />} />
            <Route path="tasks" element={<TasksPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
