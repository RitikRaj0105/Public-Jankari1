import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { 
  ShieldAlert, Plus, Edit3, Trash2, X, Globe, MapPin, 
  Calendar, IndianRupee, HelpCircle, Loader2, RefreshCw, BarChart2, CheckCircle2, AlertTriangle, Eye 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamic Location Hierarchy Database
const locationData = {
  "India": {
    "Delhi": {
      "Central Delhi": {
        "Delhi": {
          "Central Delhi": ["Delhi"]
        }
      }
    },
    "Maharashtra": {
      "Nagpur": {
        "Nagpur": {
          "Nagpur": ["Nagpur"]
        }
      },
      "Mumbai": {
        "Mumbai": {
          "Mumbai": ["Mumbai"]
        }
      }
    },
    "Bihar": {
      "Patna": {
        "Patna Block": {
          "Kadamkuan Panchayat": ["Kadamkuan Village"]
        }
      }
    },
    "Rajasthan": {
      "Jaipur": {
        "Amer": {
          "Amer": ["Amer"]
        }
      }
    }
  }
};

export default function AdminPanel() {
  const { user } = useContext(AuthContext);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [formMode, setFormMode] = useState('closed'); // 'closed', 'create', 'edit'
  const [editId, setEditId] = useState(null);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [status, setStatus] = useState('Proposed');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Location fields
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [block, setBlock] = useState('');
  const [panchayat, setPanchayat] = useState('');
  const [village, setVillage] = useState('');

  // Lists for dropdown scoping
  const [statesList, setStatesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);
  const [blocksList, setBlocksList] = useState([]);
  const [panchayatsList, setPanchayatsList] = useState([]);
  const [villagesList, setVillagesList] = useState([]);

  // Delete confirm modal
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchScopedMetrics = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/dashboard');
      setMetrics(res.data);
    } catch (err) {
      setErrorMsg('Failed to load scoped administrative metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchScopedMetrics();
    }
  }, [user]);

  // Dropdown list management based on hierarchy and user's admin scope locking
  useEffect(() => {
    if (!user) return;
    
    const adminLvl = user.adminLevel;
    
    // Country level loading
    const countriesList = Object.keys(locationData);
    const selectedCountry = 'India';
    setCountry(selectedCountry);

    // States list
    const states = Object.keys(locationData[selectedCountry] || {});
    setStatesList(states);
    
    if (adminLvl === 'Country') {
      // Free selectors
      if (!state) setState(states[0] || '');
    } else {
      // Locked to user state
      setState(user.state);
    }
  }, [user, formMode]);

  useEffect(() => {
    if (!state || !user) return;
    const adminLvl = user.adminLevel;
    
    const districts = Object.keys(locationData[country]?.[state] || {});
    setDistrictsList(districts);
    
    if (adminLvl === 'Country' || adminLvl === 'State') {
      if (formMode === 'create' || !district) setDistrict(districts[0] || '');
    } else {
      setDistrict(user.district);
    }
  }, [state, user, formMode]);

  useEffect(() => {
    if (!district || !user) return;
    const adminLvl = user.adminLevel;
    
    const blocks = Object.keys(locationData[country]?.[state]?.[district] || {});
    setBlocksList(blocks);
    
    if (adminLvl === 'Country' || adminLvl === 'State' || adminLvl === 'District') {
      if (formMode === 'create' || !block) setBlock(blocks[0] || '');
    } else {
      setBlock(user.block);
    }
  }, [district, user, formMode]);

  useEffect(() => {
    if (!block || !user) return;
    const adminLvl = user.adminLevel;
    
    const panchayats = Object.keys(locationData[country]?.[state]?.[district]?.[block] || {});
    setPanchayatsList(panchayats);
    
    if (adminLvl === 'Country' || adminLvl === 'State' || adminLvl === 'District' || adminLvl === 'Block') {
      if (formMode === 'create' || !panchayat) setPanchayat(panchayats[0] || '');
    } else {
      setPanchayat(user.panchayat);
    }
  }, [block, user, formMode]);

  useEffect(() => {
    if (!panchayat || !user) return;
    const adminLvl = user.adminLevel;
    
    const villages = locationData[country]?.[state]?.[district]?.[block]?.[panchayat] || [];
    setVillagesList(villages);
    
    if (adminLvl !== 'Village') {
      if (formMode === 'create' || !village) setVillage(villages[0] || '');
    } else {
      setVillage(user.village);
    }
  }, [panchayat, user, formMode]);

  const openCreateForm = () => {
    setErrorMsg('');
    setSuccessMsg('');
    setName('');
    setDescription('');
    setBudget('');
    setStatus('Proposed');
    setAddress('');
    setLatitude('');
    setLongitude('');
    setStartDate('');
    setEndDate('');
    
    // Auto fill locks on open
    if (user) {
      setState(user.state);
      setDistrict(user.district);
      setBlock(user.block);
      setPanchayat(user.panchayat);
      setVillage(user.village);
    }
    
    setFormMode('create');
  };

  const openEditForm = (project) => {
    setErrorMsg('');
    setSuccessMsg('');
    setEditId(project._id);
    setName(project.name);
    setDescription(project.description);
    setBudget(project.budget);
    setStatus(project.status);
    setAddress(project.location?.address || '');
    setLatitude(project.location?.latitude || '');
    setLongitude(project.location?.longitude || '');
    
    // Fill locations from project
    setState(project.location?.state || project.state || '');
    setDistrict(project.location?.district || project.district || '');
    setBlock(project.location?.block || project.block || '');
    setPanchayat(project.location?.panchayat || project.panchayat || '');
    setVillage(project.location?.village || project.village || '');

    const sDate = project.timeline?.startDate ? new Date(project.timeline.startDate).toISOString().split('T')[0] : '';
    const eDate = project.timeline?.endDate ? new Date(project.timeline.endDate).toISOString().split('T')[0] : '';
    setStartDate(sDate);
    setEndDate(eDate);
    
    setFormMode('edit');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name || !description || !budget || !address || !latitude || !longitude || !startDate || !endDate || !state || !district || !block || !panchayat || !village) {
      setErrorMsg('Please fill in all fields including project coordinates and village scopes.');
      return;
    }

    const payload = {
      name,
      description,
      budget: parseFloat(budget),
      status,
      address,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      startDate,
      endDate,
      country,
      state,
      district,
      block,
      panchayat,
      village
    };

    setSubmitting(true);
    try {
      if (formMode === 'create') {
        await api.post('/projects', payload);
        setSuccessMsg('Project created successfully!');
      } else {
        await api.put(`/projects/${editId}`, payload);
        setSuccessMsg('Project updated successfully!');
      }
      setFormMode('closed');
      fetchScopedMetrics();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Action failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      setDeleteConfirmId(null);
      setSuccessMsg('Project deleted successfully.');
      fetchScopedMetrics();
    } catch (err) {
      setErrorMsg('Failed to delete project.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatBudget = (value) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(value / 100000).toFixed(2)} Lakh`;
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto animate-bounce" />
        <h3 className="text-xl font-bold">Unauthorized Access</h3>
        <p className="text-slate-500">Only government-authorized auditors are permitted to view the Control Center.</p>
      </div>
    );
  }

  const isFieldLocked = (fieldLvl) => {
    const adminLvl = user.adminLevel;
    const levels = ['Country', 'State', 'District', 'Block', 'Panchayat', 'Village'];
    
    const adminLvlIdx = levels.indexOf(adminLvl);
    const fieldLvlIdx = levels.indexOf(fieldLvl);
    
    // Lock the field if it is at or above the admin's scoping level
    return adminLvlIdx >= fieldLvlIdx;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 🚀 Scoped Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] bg-blue-50 border border-blue-200 text-blue-800 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            {user.adminLevel} Admin Scoped Authority
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2 mt-2">
            <ShieldAlert className="w-8 h-8 text-indigo-600" />
            <span>Auditing Portal: {user.adminRegion}</span>
          </h1>
          <p className="text-slate-500 font-semibold mt-1">Manage public funds allocations and materials inspections in your jurisdiction.</p>
        </div>
        <button
          onClick={openCreateForm}
          className="bg-slate-950 hover:bg-slate-900 text-white font-bold py-3.5 px-5 rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center space-x-2 self-start cursor-pointer border-none"
        >
          <Plus className="w-4 h-4 text-blue-400" />
          <span>Register Local Project</span>
        </button>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-3 rounded-xl">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 text-xs font-semibold px-4 py-3 rounded-xl">
          {successMsg}
        </div>
      )}

      {/* Scoped metrics cards */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Local Projects</p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">{metrics.totalProjects}</h3>
            </div>
          </div>

          <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Jurisdiction Budget</p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">{formatBudget(metrics.totalBudget)}</h3>
            </div>
          </div>

          <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Completion Rate</p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                {metrics.totalProjects > 0 ? `${Math.round((metrics.completedCount / metrics.totalProjects) * 100)}%` : '0%'}
              </h3>
            </div>
          </div>

          <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Citizen Audits</p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">{metrics.verificationsCount}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Projects List Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : !metrics || metrics.projectsList.length === 0 ? (
        <div className="bg-white border border-slate-200/60 rounded-3xl p-16 text-center space-y-3">
          <HelpCircle className="w-12 h-12 text-slate-350 mx-auto" />
          <h3 className="text-xl font-bold">No Projects Registered in this Scope</h3>
          <p className="text-slate-550 max-w-sm mx-auto text-xs leading-relaxed">
            You currently do not have any public projects registered in your jurisdiction area. Click the button above to add one.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/60 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-left">
              <thead className="bg-slate-50/60 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4">Project Name</th>
                  <th scope="col" className="px-6 py-4">Budget</th>
                  <th scope="col" className="px-6 py-4">Scope Location</th>
                  <th scope="col" className="px-6 py-4">Timeline</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-xs font-medium text-slate-700">
                {metrics.projectsList.map((proj) => (
                  <tr key={proj._id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-extrabold text-slate-900 text-sm">{proj.name}</div>
                      <div className="text-[10px] text-slate-450 truncate max-w-xs">{proj.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">
                      {formatBudget(proj.budget)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-500" />
                        <span>{proj.location?.address.split(',')[0]}</span>
                      </div>
                      <div className="text-[9px] text-slate-450 font-bold ml-4 mt-0.5">
                        {proj.location?.village || proj.village} Village
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-bold">
                      {formatDate(proj.timeline?.startDate)} - {formatDate(proj.timeline?.endDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                        proj.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        proj.status === 'Suspended' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        proj.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {proj.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button
                        onClick={() => openEditForm(proj)}
                        className="text-blue-600 hover:text-blue-800 font-bold bg-blue-50 hover:bg-blue-100 border border-blue-100 p-2 rounded-xl transition-all cursor-pointer"
                        title="Edit Details"
                      >
                        <Edit3 className="w-4.5 h-4.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(proj._id)}
                        className="text-rose-600 hover:text-rose-800 font-bold bg-rose-50 hover:bg-rose-100 border border-rose-100 p-2 rounded-xl transition-all cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 🖼️ CREATE / EDIT FORM SLIDE-OVER OVERLAY MODAL */}
      <AnimatePresence>
        {formMode !== 'closed' && (
          <div className="fixed inset-0 z-50 bg-slate-950/50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl shadow-2xl relative overflow-hidden my-8"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600"></div>
              
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-900">
                  {formMode === 'create' ? 'Register New Local Project' : 'Edit Project Specifications'}
                </h3>
                <button 
                  onClick={() => setFormMode('closed')} 
                  className="p-1.5 hover:bg-slate-250/80 rounded-xl text-slate-500 hover:text-slate-950 transition-all border-none bg-none cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto max-h-[75vh] space-y-6">
                
                {/* Name & Budget */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Project Title</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Panchayat Secondary School Upgrade"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Allocated Budget (₹ in INR)</label>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="1200000"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Scope & Specifications Description</label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Details about building construction materials, cement/steel grades, scope of work, etc..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
                  />
                </div>

                {/* Address location */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Physical Site Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Kadamkuan Village Road, Patna, Bihar"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
                  />
                </div>

                {/* Location Hierarchy scoping selection */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-4">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                    <span>Project Location Jurisdiction Scope</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* State */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">State</label>
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        disabled={isFieldLocked('State')}
                        className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs font-semibold focus:outline-none disabled:bg-slate-200 disabled:text-slate-500"
                      >
                        {statesList.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    {/* District */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">District</label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        disabled={isFieldLocked('District')}
                        className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs font-semibold focus:outline-none disabled:bg-slate-200 disabled:text-slate-500"
                      >
                        {districtsList.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>

                    {/* Block */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Block</label>
                      <select
                        value={block}
                        onChange={(e) => setBlock(e.target.value)}
                        disabled={isFieldLocked('Block')}
                        className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs font-semibold focus:outline-none disabled:bg-slate-200 disabled:text-slate-500"
                      >
                        {blocksList.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Panchayat */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Panchayat</label>
                      <select
                        value={panchayat}
                        onChange={(e) => setPanchayat(e.target.value)}
                        disabled={isFieldLocked('Panchayat')}
                        className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs font-semibold focus:outline-none disabled:bg-slate-200 disabled:text-slate-500"
                      >
                        {panchayatsList.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>

                    {/* Village */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Village</label>
                      <select
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        disabled={isFieldLocked('Village')}
                        className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs font-semibold focus:outline-none disabled:bg-slate-200 disabled:text-slate-500"
                      >
                        {villagesList.map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Coords: Lat, Long & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                      <Globe className="w-3.5 h-3.5 text-blue-500" />
                      <span>Latitude Coordinates</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      placeholder="25.5941"
                      className="w-full bg-slate-55/60 border border-slate-200 rounded-xl p-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                      <Globe className="w-3.5 h-3.5 text-blue-500" />
                      <span>Longitude Coordinates</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      placeholder="85.1376"
                      className="w-full bg-slate-55/60 border border-slate-200 rounded-xl p-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Completion Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full bg-slate-55/60 border border-slate-200 rounded-xl p-3.5 text-xs font-bold focus:bg-white focus:outline-none focus:ring-2"
                    >
                      <option value="Proposed">Proposed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                {/* Timelines */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Audit Start Date</span>
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-slate-55/60 border border-slate-200 rounded-xl p-3 text-sm font-semibold focus:outline-none focus:ring-2"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Target End Date</span>
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-slate-55/60 border border-slate-200 rounded-xl p-3 text-sm font-semibold focus:outline-none focus:ring-2"
                    />
                  </div>
                </div>

                {/* Submit actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setFormMode('closed')}
                    className="border border-slate-200 hover:bg-slate-50 font-bold py-2.5 px-5 rounded-xl text-sm transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm shadow hover:shadow-md transition-all flex items-center space-x-2 border-none cursor-pointer"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>{formMode === 'create' ? 'Register Project' : 'Save Adjustments'}</span>
                    )}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONFIRM DELETION MODAL */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-[60] bg-slate-950/50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm shadow-2xl p-6 relative overflow-hidden"
            >
              <div className="space-y-4 text-center">
                <Trash2 className="w-10 h-10 text-rose-500 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">Delete Project?</h3>
                <p className="text-slate-500 text-xs">
                  This action is permanent and will permanently delete all associated ground reality proofs and reviews.
                </p>
                <div className="flex items-center justify-center space-x-3 pt-3">
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="border border-slate-200 hover:bg-slate-50 font-bold py-2 px-4 rounded-xl text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteProject(deleteConfirmId)}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded-xl text-xs border-none cursor-pointer"
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
