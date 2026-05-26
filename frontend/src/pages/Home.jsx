import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import MapView from '../components/MapView';
import { ProjectGridSkeleton } from '../components/Skeletons';
import { Search, MapPin, IndianRupee, BarChart3, CheckCircle2, AlertTriangle, PlayCircle, Grid, Map, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const getStatusBadge = (status) => {
  switch (status) {
    case 'Completed':
      return { class: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    case 'In Progress':
      return { class: 'bg-amber-50 text-amber-700 border-amber-200' };
    case 'Suspended':
      return { class: 'bg-rose-50 text-rose-700 border-rose-200' };
    default:
      return { class: 'bg-blue-50 text-blue-700 border-blue-200' };
  }
};

const getProgressPercent = (status) => {
  switch (status) {
    case 'Completed': return 100;
    case 'In Progress': return 60;
    case 'Suspended': return 35;
    default: return 0;
  }
};

export default function Home({ onSelectProject }) {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  
  // Location scoping toggle
  const [localOnly, setLocalOnly] = useState(true);

  // Dashboard Stats
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalBudget: 0,
    completedCount: 0,
    inProgressCount: 0,
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = {
        search,
        status: statusFilter,
      };

      // Scope to user's registered state
      if (user && localOnly) {
        params.state = user.state;
      }

      const res = await api.get('/projects', { params });
      setProjects(res.data);

      // Compute statistics for the currently loaded list
      const total = res.data.length;
      const budget = res.data.reduce((acc, curr) => acc + curr.budget || acc + curr.totalBudget, 0);
      const completed = res.data.filter((p) => p.status === 'Completed').length;
      const progress = res.data.filter((p) => p.status === 'In Progress').length;
      setStats({
        totalProjects: total,
        totalBudget: budget,
        completedCount: completed,
        inProgressCount: progress,
      });

    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProjects();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, statusFilter, localOnly, user]);

  const formatBudget = (value) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(value / 100000).toFixed(2)} Lakh`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 🚀 Header & Intro */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Public Project Audit Dashboard</h1>
          <p className="text-slate-500 font-medium mt-1">
            Real-time visual monitoring and crowd-sourced ground verification for government public funds.
          </p>
        </div>
      </div>

      {/* 📊 KPI Dashboard Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Loaded Projects</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">{stats.totalProjects}</h3>
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Audited Budget</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">{formatBudget(stats.totalBudget)}</h3>
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Completion Rate</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {stats.totalProjects > 0 ? `${Math.round((stats.completedCount / stats.totalProjects) * 100)}%` : '0%'}
            </h3>
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <PlayCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">In Progress</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">{stats.inProgressCount}</h3>
          </div>
        </div>
      </div>

      {/* 🔍 Search & Filters Bar */}
      <div className="glass p-4 rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-4 border border-slate-200/80 shadow-sm">
        
        {/* Search */}
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects or locations..."
            className="w-full bg-white border border-slate-200/80 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
          />
        </div>

        {/* Filters and View toggles */}
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-end">
          
          {/* 📍 Regional Scope Checkbox (Citizen only) */}
          {user && (
            <div className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200/60 px-3.5 py-2.5 rounded-xl border border-slate-200 transition-all">
              <input
                id="regional-scope"
                type="checkbox"
                checked={localOnly}
                onChange={(e) => setLocalOnly(e.target.checked)}
                className="w-4.5 h-4.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="regional-scope" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                Scoped to my State ({user.state})
              </label>
            </div>
          )}

          {/* Status buttons */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {['All', 'Proposed', 'In Progress', 'Completed', 'Suspended'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  statusFilter === status
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
              }`}
              title="Card Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'map' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
              }`}
              title="Interactive Map View"
            >
              <Map className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* 🚀 Main Contents Display */}
      {loading ? (
        <ProjectGridSkeleton />
      ) : projects.length === 0 ? (
        <div className="bg-white border border-slate-200/60 rounded-3xl p-16 text-center space-y-3">
          <AlertTriangle className="w-12 h-12 text-slate-450 mx-auto" />
          <h3 className="text-xl font-bold text-slate-800">No Projects Found</h3>
          <p className="text-slate-550 max-w-md mx-auto text-sm leading-relaxed">
            There are no projects mapped in this location. {user && localOnly ? "Try disabling the 'Scoped to my State' toggle to search nationwide projects." : "Try adjusting your search query."}
          </p>
        </div>
      ) : viewMode === 'map' ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <MapView projects={projects} onSelectProject={onSelectProject} />
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => {
            const statusConfig = getStatusBadge(project.status);
            const progress = getProgressPercent(project.status);
            const projectBudget = project.budget || project.totalBudget;
            const projectAddress = project.location?.address || project.address || '';
            
            return (
              <motion.div
                key={project._id || project.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
                whileHover={{ y: -4, shadow: '0 20px 25px -5px rgba(0,0,0,0.05)' }}
                className="bg-white border border-slate-200/60 hover:border-slate-300 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all cursor-pointer group"
                onClick={() => onSelectProject(project._id || project.id)}
              >
                <div className="space-y-3">
                  {/* Status & Location Tag */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-1 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                      <span className="text-[10px] font-bold tracking-wide uppercase truncate max-w-[125px]">
                        {projectAddress.split(',')[0]}
                      </span>
                    </div>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${statusConfig.class}`}>
                      {project.status}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-extrabold text-slate-905 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {project.name}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed font-medium">
                    {project.description}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="mt-5 space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <span>Audit Status</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        project.status === 'Completed' ? 'bg-emerald-500' :
                        project.status === 'Suspended' ? 'bg-rose-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Bottom Card Footer */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Budget</span>
                    <p className="text-base font-extrabold text-slate-900 mt-0.5">{formatBudget(projectBudget)}</p>
                  </div>
                  <button className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-xl transition-all group-hover:bg-blue-600 group-hover:text-white cursor-pointer select-none border-none">
                    Audit Project
                  </button>
                </div>

              </motion.div>
            );
          })}
        </div>
      )}
      
    </div>
  );
}
