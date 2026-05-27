import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { 
  User, Mail, Calendar, Settings, Image as ImageIcon, 
  MessageSquare, Edit2, ShieldAlert, Loader2, CheckCircle, AlertTriangle,
  ChevronRight, ChevronDown, DollarSign, MapPin, Eye, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Collapsible tree node helper for dashboard activity lists
function DashboardTreeNode({ node, formatBudget }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const hasMaterials = node.materials && node.materials.length > 0;
  const isExpandable = hasChildren || hasMaterials;

  return (
    <div className="pl-3 border-l border-slate-200/80 ml-1.5 mt-2">
      <div 
        onClick={() => isExpandable && setIsOpen(!isOpen)}
        className={`flex items-center justify-between p-2 rounded-lg text-xs font-semibold select-none ${
          isExpandable ? 'cursor-pointer hover:bg-slate-100/60 bg-slate-50' : 'bg-transparent text-slate-600'
        }`}
      >
        <span className="flex items-center space-x-1.5">
          {isExpandable && (
            <span className="text-slate-400">
              {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </span>
          )}
          <span>{node.name}</span>
        </span>
        <span className="font-extrabold text-slate-900">{formatBudget(node.amount)}</span>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && isExpandable && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 pt-1.5">
              {hasChildren && node.children.map(child => (
                <DashboardTreeNode key={child.id} node={child} formatBudget={formatBudget} />
              ))}
              {hasMaterials && (
                <div className="pl-3 space-y-1 mt-1 text-[11px] font-medium text-slate-500">
                  {node.materials.map(mat => (
                    <div key={mat.id} className="bg-slate-50 border border-slate-100 rounded-lg p-2 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-800">{mat.name}</p>
                        <p className="text-[9px] text-slate-400">Supplier: {mat.supplier} • Qty: {mat.quantity} {mat.unit}</p>
                      </div>
                      <span className="font-bold text-slate-700">{formatBudget(mat.totalCost)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Dashboard({ setCurrentPage, onSelectProject }) {
  const { user, updateProfile } = useContext(AuthContext);

  // Edit profile states
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Expandable activity states
  const [expandedVerId, setExpandedVerId] = useState(null);

  // Local projects and tabs states
  const [activeTab, setActiveTab] = useState('audits');
  const [localProjects, setLocalProjects] = useState([]);
  const [loadingLocal, setLoadingLocal] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchLocalProjects = async () => {
        setLoadingLocal(true);
        try {
          const res = await api.get('/projects', { params: { state: user.state } });
          setLocalProjects(res.data);
        } catch (err) {
          console.error('Error fetching local projects on dashboard:', err);
        } finally {
          setLoadingLocal(false);
        }
      };
      fetchLocalProjects();
    }
  }, [user]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name || !email) {
      setErrorMsg('Name and Email are required.');
      return;
    }

    setSubmitting(true);
    try {
      await updateProfile(name, email, password || undefined);
      setSuccessMsg('Profile updated successfully!');
      setPassword('');
      setIsEditing(false);
    } catch (err) {
      setErrorMsg(err.message || 'Profile update failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatBudget = (value) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(value / 100000).toFixed(2)} Lakh`;
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto animate-bounce" />
        <h3 className="text-xl font-bold">Please Log In</h3>
        <p className="text-slate-500">You must be logged in to view your dashboard.</p>
        <button 
          onClick={() => setCurrentPage('login')}
          className="bg-slate-950 text-white font-bold px-6 py-2.5 rounded-xl text-sm border-none cursor-pointer"
        >
          Sign In
        </button>
      </div>
    );
  }

  const uploadedPhotos = user.activity
    ?.filter(act => act.imageUrl)
    ?.map(act => {
      const isSystemSeeded = act.imageUrl.startsWith('/uploads/proof-');
      const fullUrl = isSystemSeeded || act.imageUrl.startsWith('/')
        ? `http://localhost:5000${act.imageUrl}`
        : act.imageUrl;
      const projObj = act.projectId || {};
      return {
        id: act.id || act._id,
        url: fullUrl,
        projectName: projObj.name || 'Project Audit'
      };
    }) || [];

  const handleToggleExpand = (id, e) => {
    e.stopPropagation();
    setExpandedVerId(expandedVerId === id ? null : id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 🚀 Header */}
      <div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Citizen Dashboard</h1>
        <p className="text-slate-500 font-medium mt-1">Track your verification activity, submissions, and account settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: User Card & Settings */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
            
            <div className="flex flex-col items-center text-center space-y-4 pt-4">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center border-2 border-slate-200 text-blue-600 shadow-inner">
                <User className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-950 leading-tight">{user.name}</h3>
                <span className="text-[10px] text-blue-700 font-bold bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full inline-block mt-1.5 uppercase">
                  {user.role}
                </span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
              <div className="flex items-center space-x-3 text-slate-600">
                <Mail className="w-5 h-5 text-slate-400" />
                <span className="text-sm font-semibold">{user.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-600">
                <Calendar className="w-5 h-5 text-slate-400" />
                <span className="text-xs font-semibold">Joined: {formatDate(user.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-600">
                <MessageSquare className="w-5 h-5 text-slate-400" />
                <span className="text-xs font-semibold">Audits Submitted: {user.verificationCount || 0}</span>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => {
                  setIsEditing(!isEditing);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="w-full bg-slate-950 hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 text-sm transition-all cursor-pointer border-none"
              >
                <Settings className="w-4 h-4 text-blue-400" />
                <span>{isEditing ? 'Cancel Edit Settings' : 'Edit Profile Settings'}</span>
              </button>
            </div>
          </div>

          {isEditing && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-4"
            >
              <h4 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Edit2 className="w-4 h-4 text-blue-600" />
                <span>Edit Account Details</span>
              </h4>

              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-2.5 rounded-xl">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Change Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank to keep same"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-semibold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 text-sm transition-all disabled:opacity-50 cursor-pointer border-none"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Save Account Settings</span>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold p-4 rounded-3xl flex items-center space-x-2">
              <CheckCircle className="w-4.5 h-4.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Scoped History Timeline & Gallery */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Timeline listing & Projects Explorer */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            
            {/* Tabs Selector Header */}
            <div className="flex border-b border-slate-100 pb-0 gap-4">
              <button
                onClick={() => setActiveTab('audits')}
                className={`pb-3 px-1 text-sm font-extrabold transition-all border-b-2 bg-transparent cursor-pointer border-none flex items-center space-x-2 ${
                  activeTab === 'audits'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-400 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>My Auditing History</span>
              </button>
              <button
                onClick={() => setActiveTab('local-budgets')}
                className={`pb-3 px-1 text-sm font-extrabold transition-all border-b-2 bg-transparent cursor-pointer border-none flex items-center space-x-2 ${
                  activeTab === 'local-budgets'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-400 hover:text-slate-900'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Local Projects & Budgets</span>
              </button>
            </div>

            {activeTab === 'audits' ? (
              !user.activity || user.activity.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-100 rounded-2xl space-y-3 bg-white">
                  <AlertTriangle className="w-10 h-10 text-slate-350 mx-auto" />
                  <p className="text-sm font-semibold text-slate-500">You haven't submitted any audits yet.</p>
                  <button
                    onClick={() => setCurrentPage('home')}
                    className="text-xs bg-blue-50 text-blue-600 font-bold px-4 py-2 rounded-xl border-none cursor-pointer"
                  >
                    Find a Project to Audit
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {user.activity.map((act) => {
                    const isCompleted = act.status === 'Completed';
                    const projObj = act.projectId || {};
                    const actId = act.id || act._id;
                    const isExpanded = expandedVerId === actId;
                    
                    return (
                      <div 
                        key={actId}
                        className={`border border-slate-100 rounded-2xl p-4 transition-all duration-200 hover:bg-slate-50/50 ${
                          isExpanded ? 'bg-slate-50/20 ring-1 ring-blue-500/10 border-slate-200' : 'bg-white'
                        }`}
                      >
                        {/* Accordion Row Header */}
                        <div 
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 cursor-pointer select-none"
                          onClick={(e) => handleToggleExpand(actId, e)}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${
                                isCompleted ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                              }`}>
                                {act.status}
                              </span>
                              <span className="text-[10px] text-slate-400 font-semibold">{formatDate(act.createdAt)}</span>
                            </div>
                            <h4 className="font-extrabold text-slate-900 text-sm">{projObj.name || 'Unnamed Project'}</h4>
                            <p className="text-slate-500 text-xs line-clamp-1 italic">"{act.comment}"</p>
                          </div>

                          <div className="flex items-center space-x-2 self-start sm:self-center">
                            <span className="text-[10px] text-slate-450 font-bold">
                              {isExpanded ? 'Collapse Details' : 'Expand Details'}
                            </span>
                            <span className="text-slate-400">
                              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </span>
                          </div>
                        </div>

                        {/* Expandable Details Container */}
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-4 pt-4 border-t border-slate-100 space-y-4"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Observations */}
                              <div className="space-y-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ground Observations</span>
                                <p className="text-slate-655 text-xs md:text-sm leading-relaxed bg-white border border-slate-100 p-3 rounded-xl italic">
                                  "{act.comment}"
                                </p>
                                {act.imageUrl && (
                                  <div className="rounded-xl overflow-hidden border border-slate-200 max-h-36 max-w-xs mt-2 shadow-inner">
                                    <img 
                                      src={act.imageUrl.startsWith('/uploads/proof-') || act.imageUrl.startsWith('/') ? `http://localhost:5000${act.imageUrl}` : act.imageUrl} 
                                      alt="Audit proof" 
                                      className="w-full h-full object-cover" 
                                    />
                                  </div>
                                )}
                              </div>

                              {/* Project details and nested budget tree */}
                              <div className="space-y-3">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Project Budget Allocation Hierarchy</span>
                                
                                <div className="bg-white border border-slate-100 rounded-xl p-3.5 space-y-2">
                                  <h5 className="text-xs font-bold text-slate-900">{projObj.name}</h5>
                                  <div className="flex items-center space-x-4 text-[10px] font-bold text-slate-500">
                                    <span className="flex items-center text-slate-700">
                                      <DollarSign className="w-3.5 h-3.5 text-blue-500" />
                                      <span>Budget: {formatBudget(projObj.totalBudget || projObj.budget || 0)}</span>
                                    </span>
                                    <span className="flex items-center text-slate-700">
                                      <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                                      <span className="truncate max-w-[120px]">{projObj.location?.address.split(',')[0]}</span>
                                    </span>
                                  </div>
                                </div>

                                {/* Nested hierarchy rendering directly in dashboard */}
                                <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                                  {projObj.allocationsTree && projObj.allocationsTree.length > 0 ? (
                                    projObj.allocationsTree.map(node => (
                                      <DashboardTreeNode key={node.id} node={node} formatBudget={formatBudget} />
                                    ))
                                  ) : (
                                    <span className="text-[10px] text-slate-400 italic block text-center py-2">No budget trees registered.</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Full Audit page redirection button */}
                            <div className="flex justify-end pt-2">
                              <button
                                onClick={() => onSelectProject(projObj._id)}
                                className="text-xs bg-slate-950 hover:bg-slate-900 text-white font-bold px-4 py-2.5 rounded-xl flex items-center space-x-1.5 shadow transition-all cursor-pointer border-none"
                              >
                                <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                                <span>Go to Project Audit Page</span>
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              // Tab: Local Projects Budgets Explorer
              <div className="space-y-6">
                <div className="bg-slate-50 border border-slate-200/50 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Scope Region</span>
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                      <span>{user.state} State ({localProjects.length} Projects Mapped)</span>
                    </span>
                  </div>
                  <span className="text-[10px] text-blue-600 font-extrabold bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md uppercase">
                    Citizen View
                  </span>
                </div>

                {loadingLocal ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                  </div>
                ) : localProjects.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-slate-100 rounded-2xl space-y-3 bg-white">
                    <AlertTriangle className="w-10 h-10 text-slate-350 mx-auto" />
                    <p className="text-sm font-semibold text-slate-500">No projects found in {user.state}.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {localProjects.map((project) => (
                      <div 
                        key={project.id || project._id} 
                        className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-4 hover:border-slate-300 transition-all animate-fadeIn"
                      >
                        {/* Project Header details */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3.5 border-b border-slate-100">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border uppercase ${
                                project.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                project.status === 'Suspended' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                project.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                'bg-blue-50 text-blue-700 border-blue-200'
                              }`}>
                                {project.status}
                              </span>
                              <span className="text-[10px] text-slate-400 font-bold">{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
                            </div>
                            <h4 className="font-extrabold text-slate-900 mt-1">{project.name}</h4>
                            <p className="text-slate-500 text-xs mt-0.5 leading-relaxed line-clamp-2">{project.description}</p>
                          </div>
                          
                          <div className="text-left sm:text-right flex flex-col sm:items-end">
                            <span className="text-[10px] font-bold text-slate-450 uppercase block">Total Budget</span>
                            <span className="text-base font-black text-slate-900 mt-0.5">{formatBudget(project.totalBudget || project.budget || 0)}</span>
                          </div>
                        </div>

                        {/* Collapsible Fund Hierarchy Tree Visualizer */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                            Interactive Fund & Materials Tree
                          </span>
                          <div className="bg-slate-50/50 border border-slate-100 p-3 rounded-xl space-y-1">
                            {project.allocationsTree && project.allocationsTree.length > 0 ? (
                              project.allocationsTree.map(node => (
                                <DashboardTreeNode key={node.id} node={node} formatBudget={formatBudget} />
                              ))
                            ) : (
                              <span className="text-[10px] text-slate-400 italic block text-center py-2">
                                No budget trees registered for this project.
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Audit redirection */}
                        <div className="flex justify-end pt-2">
                          <button
                            onClick={() => onSelectProject(project.id || project._id)}
                            className="text-xs bg-slate-950 hover:bg-slate-900 text-white font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer border-none"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-400" />
                            <span>Audit & Submit Proof</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Photo evidence gallery */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
                <ImageIcon className="w-5 h-5 text-blue-600" />
                <span>Uploaded Ground Evidence ({uploadedPhotos.length})</span>
              </h3>
              <p className="text-slate-500 text-xs mt-0.5">Your submitted photo proof gallery.</p>
            </div>

            {uploadedPhotos.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-100 rounded-2xl">
                <p className="text-sm font-semibold text-slate-400">No photos uploaded yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {uploadedPhotos.map((photo) => (
                  <div 
                    key={photo.id}
                    className="relative group rounded-xl overflow-hidden aspect-square border border-slate-200 shadow-sm cursor-zoom-in"
                  >
                    <img 
                      src={photo.url} 
                      alt={photo.projectName} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                      <span className="text-[9px] font-bold text-white leading-tight line-clamp-2">
                        {photo.projectName}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
