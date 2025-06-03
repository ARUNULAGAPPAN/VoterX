import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePageRedirect from './pages/HomePageRedirect';
import VotingPage from './pages/VotingPage';
import ThankYouPage from './pages/ThankYouPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ResultsPage from './pages/ResultsPage';
import ErrorPage from './pages/ErrorPage';
import ProtectedRoute from './components/ProtectedRoute';
// import './App.css'; // if you have App.css

function App() {
  return (
    <>
      {/* Optional: Add a global header or navbar here */}
      <Routes>
        <Route path="/" element={<HomePageRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Voter Routes */}
        <Route element={<ProtectedRoute allowedRoles={['voter']} />}>
          <Route path="/vote" element={<VotingPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          {/* CandidateManager is part of AdminDashboard, so no separate route needed unless you want a dedicated page */}
        </Route>

        {/* Public/Shared Routes */}
        <Route path="/results" element={<ResultsPage />} />
        
        <Route path="/error" element={<ErrorPage />} />
        <Route path="*" element={<ErrorPage />} /> {/* Catch-all for 404 */}
      </Routes>
    </>
  );
}

export default App;