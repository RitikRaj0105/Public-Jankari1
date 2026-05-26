import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  User, Mail, Calendar, Settings, Image as ImageIcon, 
  MessageSquare, Edit2, ShieldAlert, Loader2, CheckCircle, AlertTriangle 
} from 'lucide-react';
import { motion } from 'framer-motion';

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

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto animate-bounce" />
        <h3 className="text-xl font-bold">Please Log In</h3>
        <p className="text-slate-500">You must be logged in to view your dashboard.</p>
        <button 
          onClick={() => setCurrentPage('login')}
          className="bg-slate-950 text-white font-bold px-6 py-2.5 rounded-xl text-sm"
        >
          Sign In
        </button>
      </div>
    );
  }

  // Gather uploaded photos from activity
  const uploadedPhotos = user.activity
    ?.filter(act => act.imageUrl)
    ?.map(act => {
      const isSystemSeeded = act.imageUrl.startsWith('/uploads/proof-');
      const fullUrl = isSystemSeeded || act.imageUrl.startsWith('/')
        ? `http://localhost:5000${act.imageUrl}`
        : act.imageUrl;
      return {
        _id: act._id,
        url: fullUrl,
        projectName: act.projectId?.name || 'Project Audit'
      };
    }) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 🚀 Header */}
      <div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Citizen Dashboard</h1>
        <p className="text-slate-500 font-medium mt-1">Track your verification activity, submissions, and account settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: User Card & Profile Settings Form */}
        <div className="space-y-6">
          
          {/* User profile card */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
            
            <div className="flex flex-col items-center text-center space-y-4 pt-4">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center border-2 border-slate-200 text-blue-600 shadow-inner">
                <User className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-950 leading-tight">{user.name}</h3>
                <span className="text-[10px] text-blue-700 font-bold bg-blue-50 border border-blue-150 px-2.5 py-0.5 rounded-full inline-block mt-1.5 uppercase">
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

          {/* Collapsible Edit settings form */}
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Change Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank to keep same"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium text-slate-800"
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
            <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 text-xs font-semibold p-4 rounded-3xl flex items-center space-x-2">
              <CheckCircle className="w-4.5 h-4.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Activity History & Photo proof gallery */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Verification activity list */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <span>Your Auditing History</span>
              </h3>
              <p className="text-slate-500 text-xs mt-0.5">List of verifications submitted by your account.</p>
            </div>

            {!user.activity || user.activity.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-100 rounded-2xl space-y-3">
                <AlertTriangle className="w-10 h-10 text-slate-350 mx-auto" />
                <p className="text-sm font-semibold text-slate-500">You haven't submitted any audits yet.</p>
                <button
                  onClick={() => setCurrentPage('home')}
                  className="text-xs bg-blue-50 text-blue-600 font-bold px-4 py-2 rounded-xl"
                >
                  Find a Project to Audit
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {user.activity.map((act) => {
                  const isCompleted = act.status === 'Completed';
                  const projObj = act.projectId || {};
                  return (
                    <div 
                      key={act._id}
                      className="border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-slate-50/50 transition-all cursor-pointer"
                      onClick={() => onSelectProject(projObj._id)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${
                            isCompleted ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            {act.status}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">{formatDate(act.createdAt)}</span>
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-sm">{projObj.name || 'Unnamed Project'}</h4>
                        <p className="text-slate-500 text-xs line-clamp-1 italic">"{act.comment}"</p>
                      </div>

                      <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700 self-start sm:self-center bg-blue-50 hover:bg-blue-100 border border-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                        View Project
                      </button>
                    </div>
                  );
                })}
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
                    key={photo._id}
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
