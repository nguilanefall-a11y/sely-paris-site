import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layout/AdminLayout';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import ClientsManager from './views/ClientsManager';
import QuotesManager from './views/QuotesManager';
import InvoicesManager from './views/InvoicesManager';
import BookingsManager from './views/BookingsManager';
import ServicesManager from './views/ServicesManager';
import FleetManager from './views/FleetManager';
import Settings from './views/Settings';

const AdminRouter = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="reservations" element={<BookingsManager />} />
          <Route path="clients" element={<ClientsManager />} />
          <Route path="quotes" element={<QuotesManager />} />
          <Route path="invoices" element={<InvoicesManager />} />
          <Route path="services" element={<ServicesManager />} />
          <Route path="fleet" element={<FleetManager />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRouter;
