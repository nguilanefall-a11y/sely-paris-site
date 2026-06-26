import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // Add noindex meta tag dynamically for admin routes
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.name = 'robots';
      document.head.appendChild(metaRobots);
    }
    metaRobots.content = 'noindex, nofollow';

    return () => {
      // Remove it when unmounting (leaving admin area) if needed, 
      // but usually we can just leave it or reset it for the public app.
      // Since it's an SPA, leaving it might affect public routes if the user navigates back.
      metaRobots.content = 'index, follow';
    };
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/sely-office/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
