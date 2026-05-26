import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProjectDetails from './pages/ProjectDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import { motion, AnimatePresence } from 'framer-motion';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const handleSelectProject = (id) => {
    setSelectedProjectId(id);
    setCurrentPage('project-details');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onSelectProject={handleSelectProject} />;
      case 'project-details':
        return <ProjectDetails projectId={selectedProjectId} onBack={() => setCurrentPage('home')} />;
      case 'login':
        return <Login setCurrentPage={setCurrentPage} />;
      case 'register':
        return <Register setCurrentPage={setCurrentPage} />;
      case 'dashboard':
        return (
          <Dashboard 
            setCurrentPage={setCurrentPage} 
            onSelectProject={handleSelectProject} 
          />
        );
      case 'admin':
        return <AdminPanel />;
      default:
        return <Home onSelectProject={handleSelectProject} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar setCurrentPage={setCurrentPage} currentPage={currentPage} />
      
      {/* 🚀 Animating Main Page Transitions */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 text-center text-slate-400 text-xs font-semibold">
        <p>&copy; {new Date().getFullYear()} Public Jankari Accountability Portal. Built for ground transparency.</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
