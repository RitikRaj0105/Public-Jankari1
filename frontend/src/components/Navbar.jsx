import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Eye, LogOut, User, LayoutGrid, ShieldAlert, LogIn, UserPlus } from 'lucide-react';

export default function Navbar({ setCurrentPage, currentPage }) {
  const { user, logout } = useContext(AuthContext);

  const navItems = [
    { id: 'home', label: 'Projects', icon: LayoutGrid },
    ...(user ? [{ id: 'dashboard', label: 'My Dashboard', icon: User }] : []),
    ...(user && user.role === 'admin' ? [{ id: 'admin', label: 'Admin Panel', icon: ShieldAlert }] : []),
  ];

  return (
    <nav className="sticky top-0 z-50 w-full glass px-6 py-4 flex items-center justify-between border-b border-slate-200/80 shadow-sm">
      <div 
        className="flex items-center space-x-3 cursor-pointer select-none group" 
        onClick={() => setCurrentPage('home')}
      >
        <div className="bg-slate-950 text-white p-2.5 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-200">
          <Eye className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900">
            Public <span className="text-blue-600">Jankari</span>
          </span>
          <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Citizen Auditing Portal</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          );
        })}

        {user ? (
          <div className="flex items-center pl-2 border-l border-slate-200 space-x-3">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-800">{user.name}</span>
              <span className="text-[9px] text-blue-700 font-bold bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-md uppercase self-end mt-0.5">
                {user.role}
              </span>
            </div>
            <button
              onClick={() => {
                logout();
                setCurrentPage('home');
              }}
              className="p-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
            <button
              onClick={() => setCurrentPage('login')}
              className="flex items-center space-x-1.5 px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>
            <button
              onClick={() => setCurrentPage('register')}
              className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:shadow transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
