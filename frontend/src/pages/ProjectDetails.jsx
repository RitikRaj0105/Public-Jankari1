import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { DetailSkeleton } from '../components/Skeletons';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Calendar, IndianRupee, MapPin, CheckCircle2, XCircle, 
  Upload, Camera, MessageSquare, ArrowLeft, ZoomIn, Loader2, AlertCircle,
  ChevronRight, ChevronDown, Package, Shield, Factory, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Leaflet default pin paths resolution
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Recursive Tree Node Component for Fund Hierarchy
function TreeNode({ node, formatBudget }) {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const hasMaterials = node.materials && node.materials.length > 0;
  const isExpandable = hasChildren || hasMaterials;

  return (
    <div className="pl-4 border-l-2 border-slate-100/80 ml-2 mt-3 first:mt-0">
      
      {/* 📁 Allocation Node Header */}
      <div 
        onClick={() => isExpandable && setIsOpen(!isOpen)}
        className={`flex items-start justify-between p-3.5 rounded-xl border transition-all select-none ${
          isExpandable ? 'cursor-pointer hover:bg-slate-50' : 'bg-slate-50/20'
        } ${
          isOpen && isExpandable ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-100'
        }`}
      >
        <div className="flex items-start space-x-2.5">
          {isExpandable && (
            <span className="text-slate-400 mt-0.5">
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </span>
          )}
          <div className="space-y-1">
            <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
              <span>{node.name}</span>
            </h4>
            {node.description && (
              <p className="text-xs text-slate-500 max-w-md font-medium leading-relaxed">
                {node.description}
              </p>
            )}
          </div>
        </div>

        <div className="text-right pl-3 flex flex-col items-end">
          <span className="text-sm font-black text-slate-900">{formatBudget(node.amount)}</span>
          {(hasChildren || hasMaterials) && (
            <span className="text-[9px] text-blue-600 bg-blue-50 border border-blue-100 font-extrabold px-1.5 py-0.5 rounded-md mt-1">
              {[
                hasChildren ? `${node.children.length} Sub-funds` : '',
                hasMaterials ? `${node.materials.length} Materials` : ''
              ].filter(Boolean).join(' | ')}
            </span>
          )}
        </div>
      </div>

      {/* 📂 Children (Sub-allocations and Materials) Container */}
      <AnimatePresence initial={false}>
        {isOpen && isExpandable && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 pt-2">
              
              {/* Render Child Sub-allocations */}
              {hasChildren && node.children.map(child => (
                <TreeNode key={child.id} node={child} formatBudget={formatBudget} />
              ))}

              {/* Render Child Materials */}
              {hasMaterials && (
                <div className="pl-4 space-y-2 mt-2">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Material Invoices & Supply Details
                  </span>
                  {node.materials.map(mat => (
                    <div 
                      key={mat.id}
                      className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-inner hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-slate-200/80 text-slate-600 rounded-lg">
                          <Package className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-800">{mat.name}</p>
                          <div className="flex flex-wrap items-center gap-2.5 text-[10px] text-slate-500 font-semibold">
                            <span className="flex items-center gap-1">
                              <Factory className="w-3 h-3 text-slate-400" />
                              <span>Supplier: {mat.supplier}</span>
                            </span>
                            <span>•</span>
                            <span>Qty: {mat.quantity} {mat.unit}</span>
                            <span>•</span>
                            <span>Rate: ₹{mat.unitCost.toLocaleString('en-IN')}/{mat.unit}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Cost</span>
                        <span className="text-xs font-black text-slate-850 block">{formatBudget(mat.totalCost)}</span>
                      </div>
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

export default function ProjectDetails({ projectId, onBack }) {
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [status, setStatus] = useState('Completed');
  const [comment, setComment] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Lightbox Modal
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchProjectDetails = async () => {
    try {
      const projRes = await api.get(`/projects/${projectId}`);
      setProject(projRes.data);

      const verRes = await api.get(`/verifications/${projectId}`);
      setVerifications(verRes.data);
    } catch (error) {
      console.error('Error fetching project detail data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!comment) {
      setErrorMsg('Please write a comment explaining the ground status.');
      return;
    }

    if (!imageFile) {
      setErrorMsg('Please upload a ground photo as visual evidence.');
      return;
    }

    const formData = new FormData();
    formData.append('projectId', projectId);
    formData.append('status', status);
    formData.append('comment', comment);
    formData.append('image', imageFile);

    setUploading(true);
    try {
      const res = await api.post('/verifications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccessMsg('Thank you! Your ground reality verification has been submitted.');
      
      setComment('');
      setImageFile(null);
      setImagePreview('');
      
      setVerifications(prev => [res.data, ...prev]);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit verification.');
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatBudget = (value) => {
    if (!value) return '';
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(value / 100000).toFixed(2)} Lakh`;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <DetailSkeleton />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-xl font-bold">Project Not Found</h3>
        <button onClick={onBack} className="text-blue-600 font-bold hover:underline border-none bg-none">
          Go back to Project List
        </button>
      </div>
    );
  }

  const projectLatLng = [project.latitude, project.longitude];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* ⬅️ Back button */}
      <button 
        onClick={onBack}
        className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 font-bold text-sm bg-white border border-slate-200/80 px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Projects</span>
      </button>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Project info, location map, fund hierarchy visualizer, and audit form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Project Details */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            
            {/* Header info */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-extrabold border uppercase tracking-wider ${
                  project.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  project.status === 'Suspended' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                  project.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {project.status}
                </span>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">{project.name}</h1>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Allocated Budget</span>
                <span className="text-2xl font-extrabold text-slate-900 block mt-1">{formatBudget(project.totalBudget)}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Project Scope & Details</h3>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">{project.description}</p>
            </div>

            {/* Scope tags */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                <span>Scope: {project.village} Village, {project.panchayat} Panchayat</span>
              </div>
              <span>•</span>
              <div>
                <span>Block: {project.block}</span>
              </div>
              <span>•</span>
              <div>
                <span>District: {project.district}</span>
              </div>
            </div>

            {/* Grid for timeline & location info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div className="flex items-center space-x-3.5">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Audit Timeline</span>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">
                    {formatDate(project.startDate)} — {formatDate(project.endDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3.5">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Site Location</span>
                  <p className="text-xs font-bold text-slate-800 mt-0.5 truncate max-w-[200px]" title={project.address}>
                    {project.address}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* 📊 Card 2: Visual Fund & Material Hierarchy Tree */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <IndianRupee className="w-5 h-5 text-blue-600" />
                <span>Fund & Materials Utilization Hierarchy</span>
              </h2>
              <p className="text-slate-500 text-xs mt-1">Click folders below to inspect sub-allocations, quantity specifications, and suppliers.</p>
            </div>

            {!project.allocationsTree || project.allocationsTree.length === 0 ? (
              <div className="bg-slate-50 rounded-2xl p-6 text-center text-xs font-semibold text-slate-450 border border-dashed border-slate-200">
                <Info className="w-6 h-6 text-slate-400 mx-auto mb-2 animate-pulse" />
                <span>No itemized fund hierarchies registered for this project.</span>
              </div>
            ) : (
              <div className="space-y-4">
                {project.allocationsTree.map(rootNode => (
                  <TreeNode key={rootNode.id} node={rootNode} formatBudget={formatBudget} />
                ))}
              </div>
            )}
          </div>

          {/* Card 3: Interactive Location Mini-Map */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-4 shadow-sm space-y-3">
            <div className="px-2 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span>Geographic Site Audit Coordinates</span>
              </h3>
              <span className="text-[10px] font-bold text-slate-400">
                {project.latitude.toFixed(4)}, {project.longitude.toFixed(4)}
              </span>
            </div>
            <div className="w-full h-72 rounded-2xl overflow-hidden shadow-inner relative z-10 border border-slate-200">
              <MapContainer center={projectLatLng} zoom={11} scrollWheelZoom={false} className="h-full w-full">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={projectLatLng}>
                  <Popup>
                    <div className="p-1 font-sans text-xs">
                      <p className="font-bold">{project.name}</p>
                      <p className="text-slate-500 mt-0.5">{project.address}</p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

          {/* Card 4: Submit Verification Form */}
          {user ? (
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                  <Camera className="w-5 h-5 text-blue-600" />
                  <span>Submit Ground Auditing Proof</span>
                </h2>
                <p className="text-slate-500 text-xs mt-1">Upload a verification photo and confirm the project status.</p>
              </div>

              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-3 rounded-xl flex items-center">
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-4 py-3 rounded-xl flex items-center">
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-6">
                
                {/* Status Toggle Grid */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Ground Reality Status</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setStatus('Completed')}
                      className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border text-sm font-bold transition-all duration-200 cursor-pointer ${
                        status === 'Completed'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 ring-2 ring-emerald-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                      <span>Work Completed</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus('Not Completed')}
                      className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border text-sm font-bold transition-all duration-200 cursor-pointer ${
                        status === 'Not Completed'
                          ? 'bg-red-50 border-red-300 text-red-800 ring-2 ring-red-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <XCircle className="w-4.5 h-4.5 text-red-600" />
                      <span>Not Completed</span>
                    </button>
                  </div>
                </div>

                {/* Comment area */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Observation Description</label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe what you observed. What is the current progress? Are the materials of high quality? Is work active?"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium text-slate-800"
                  />
                </div>

                {/* File Upload zone */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Ground Proof Photo</label>
                  
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/10 rounded-2xl w-full sm:w-48 h-32 cursor-pointer transition-all duration-200">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                        <Upload className="w-6 h-6 text-slate-400 mb-2 group-hover:text-blue-500" />
                        <span className="text-xs font-semibold text-slate-600">Select Image Proof</span>
                        <span className="text-[10px] text-slate-400 mt-1">PNG, JPG, JPEG up to 5MB</span>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange}
                        className="hidden" 
                      />
                    </label>

                    {/* Preview box */}
                    {imagePreview && (
                      <div className="relative rounded-2xl overflow-hidden border border-slate-200 w-full sm:w-48 h-32">
                        <img 
                          src={imagePreview} 
                          alt="Verification ground preview" 
                          className="w-full h-full object-cover" 
                        />
                        <button
                          type="button"
                          onClick={() => { setImageFile(null); setImagePreview(''); }}
                          className="absolute top-2 right-2 bg-slate-900/80 text-white rounded-full p-1 text-xs hover:bg-slate-950 transition-colors border-none"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-slate-950 hover:bg-slate-900 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 shadow hover:shadow-md transition-all disabled:opacity-50 cursor-pointer border-none"
                >
                  {uploading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                  ) : (
                    <>
                      <Camera className="w-5 h-5 text-blue-400" />
                      <span>Submit Verification Audit</span>
                    </>
                  )}
                </button>

              </form>
            </div>
          ) : (
            <div className="glass border border-blue-100 rounded-3xl p-8 text-center space-y-4 shadow-sm">
              <Camera className="w-10 h-10 text-blue-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">Submit Verification Audit</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                Are you located near this project site? Register or log in to submit ground proof images and observations to help monitor public fund usage.
              </p>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Citizens Audits Timeline */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <span>Audits & Verification Feed ({verifications.length})</span>
              </h2>
              <p className="text-slate-500 text-xs mt-0.5">Citizens verification history timeline.</p>
            </div>

            {verifications.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-slate-100 rounded-2xl space-y-2">
                <AlertCircle className="w-8 h-8 text-slate-350 mx-auto" />
                <p className="text-xs text-slate-450 font-semibold">No verifications yet. Be the first to audit!</p>
              </div>
            ) : (
              <div className="flow-root">
                <ul className="-mb-8">
                  {verifications.map((ver, idx) => {
                    const isCompleted = ver.status === 'Completed';
                    const userObj = ver.userId || {};
                    const isSystemSeeded = ver.imageUrl.startsWith('/uploads/proof-');
                    const fullImageUrl = isSystemSeeded || ver.imageUrl.startsWith('/')
                      ? `http://localhost:5000${ver.imageUrl}`
                      : ver.imageUrl;
                    
                    return (
                      <li key={ver.id || ver._id}>
                        <div className="relative pb-8">
                          {idx !== verifications.length - 1 && (
                            <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-slate-100" aria-hidden="true" />
                          )}
                          <div className="relative flex items-start space-x-3">
                            
                            {/* Marker Icon Dot */}
                            <div className={`relative flex h-10 w-10 items-center justify-center rounded-xl ring-8 ring-white shadow-sm border ${
                              isCompleted ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                            }`}>
                              {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                            </div>

                            {/* Verification Body */}
                            <div className="min-w-0 flex-1 space-y-2 pt-1.5">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-xs font-bold text-slate-800">{userObj.name || 'Anonymous Citizen'}</p>
                                  <span className="text-[10px] text-slate-450 font-medium">{formatDate(ver.createdAt)}</span>
                                </div>
                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${
                                  isCompleted ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                                }`}>
                                  {ver.status}
                                </span>
                              </div>
                              
                              <p className="text-slate-650 text-xs md:text-sm leading-relaxed pr-2 font-medium">
                                {ver.comment}
                              </p>

                              {/* Clickable Image proof */}
                              {ver.imageUrl && (
                                <div 
                                  className="relative group rounded-xl overflow-hidden border border-slate-200 w-full aspect-video cursor-zoom-in mt-2"
                                  onClick={() => setSelectedImage(fullImageUrl)}
                                >
                                  <img 
                                    src={fullImageUrl} 
                                    alt="Ground proof photo" 
                                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-102"
                                  />
                                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <ZoomIn className="w-5 h-5 text-white" />
                                  </div>
                                </div>
                              )}

                            </div>

                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 🖼️ Fullscreen Image Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/90 flex items-center justify-center p-4 backdrop-blur-md cursor-zoom-out"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-slate-900 border border-slate-800"
            >
              <img 
                src={selectedImage} 
                alt="Ground Reality Proof Fullscreen" 
                className="max-w-full max-h-[80vh] object-contain"
              />
              <div className="p-4 bg-slate-950 text-center">
                <p className="text-xs font-semibold text-slate-400 tracking-wider">Ground Reality Evidence Visualizer</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
