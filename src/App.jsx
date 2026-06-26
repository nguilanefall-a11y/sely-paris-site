import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicSite from './PublicSite';
import AdminRouter from './admin/AdminRouter';
import PageLoader from './components/PageLoader';

function App() {
  return (
    <BrowserRouter>
      <PageLoader />
      <Routes>
        <Route path="/*" element={<PublicSite />} />
        <Route path="/sely-office/*" element={<AdminRouter />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
