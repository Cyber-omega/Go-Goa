import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { CustomerDashboard } from './CustomerDashboard';
import { DriverDashboard } from './DriverDashboard';

export const Dashboard = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/login" />;
  }

  return profile.role === 'customer' ? <CustomerDashboard /> : <DriverDashboard />;
};
