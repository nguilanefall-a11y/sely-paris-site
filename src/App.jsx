import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PortalPage from './pages/PortalPage';
import PublicSite from './PublicSite';
import ReservationSuccessPage from './pages/ReservationSuccessPage';
import PageLoader from './components/PageLoader';
import JournalLayout from './JournalLayout';
import JournalHubPage from './pages/JournalHubPage';
import JournalArticlePage from './pages/JournalArticlePage';

const AdminRouter = lazy(() => import('./admin/AdminRouter'));

function App() {
  return (
    <BrowserRouter>
      <PageLoader />
      <Routes>
        <Route path="/" element={<Navigate to="/paris" replace />} />
        <Route path="/portal" element={<PortalPage />} />
        <Route path="/reservation-succes" element={<ReservationSuccessPage />} />
        <Route path="/confirmation-devis" element={<ReservationSuccessPage />} />
        <Route path="/devis-confirme" element={<ReservationSuccessPage />} />
        <Route path="/voyages" element={<Navigate to="/paris/voyages" replace />} />
        <Route path="/compte" element={<Navigate to="/paris/compte" replace />} />

        {/* Le Journal SEO Hub & Article Routes */}
        <Route path="/journal" element={<JournalLayout><JournalHubPage /></JournalLayout>} />
        <Route path="/journal/:slug" element={<JournalLayout><JournalArticlePage /></JournalLayout>} />
        <Route path="/fr/journal" element={<JournalLayout><JournalHubPage /></JournalLayout>} />
        <Route path="/fr/journal/:slug" element={<JournalLayout><JournalArticlePage /></JournalLayout>} />
        <Route path="/en/journal" element={<JournalLayout><JournalHubPage /></JournalLayout>} />
        <Route path="/en/journal/:slug" element={<JournalLayout><JournalArticlePage /></JournalLayout>} />
        <Route path="/es/journal" element={<JournalLayout><JournalHubPage /></JournalLayout>} />
        <Route path="/es/journal/:slug" element={<JournalLayout><JournalArticlePage /></JournalLayout>} />
        <Route path="/ar/journal" element={<JournalLayout><JournalHubPage /></JournalLayout>} />
        <Route path="/ar/journal/:slug" element={<JournalLayout><JournalArticlePage /></JournalLayout>} />

        <Route path="/:city/*" element={<PublicSite />} />

        <Route
          path="/sely-office/*"
          element={
            <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0a0a0a' }} />}>
              <AdminRouter />
            </Suspense>
          }
        />
        {/* Fallback to /paris if invalid path */}
        <Route path="*" element={<Navigate to="/paris" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
