import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import SinglePrediction from './pages/SinglePrediction';
import BulkPrediction from './pages/BulkPrediction';
import Analytics from './pages/Analytics';
import StudentManagement from './pages/StudentManagement';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/single-prediction" element={<SinglePrediction />} />
          <Route path="/bulk-prediction" element={<BulkPrediction />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/students" element={<StudentManagement />} />
        </Routes>
      </main>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;