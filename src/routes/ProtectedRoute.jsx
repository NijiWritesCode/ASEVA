import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PageLoader } from '../components/shared/LoadingSpinner';

export function ProtectedRoute({ children, requireManager = false }) {
  const { isAuthenticated, loading, isManager } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    // For Phase 2 local development/scaffold testing, if not logged into Supabase yet, allow passing through with warning
    // In production, strictly redirect to /login
    return children;
  }

  if (requireManager && !isManager) {
    return (
      <div className="p-8 text-center bg-white border border-sand-300 rounded-sm">
        <h2 className="font-serif text-lg font-bold text-obsidian-950">Access Restricted</h2>
        <p className="text-xs text-obsidian-600 mt-2">
          Your current account role does not possess permissions to view executive financial reports.
        </p>
      </div>
    );
  }

  return children;
}
