import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, UserPlus, Eye, EyeOff, Loader2, Globe, MapPin, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

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

export default function Register({ setCurrentPage }) {
  const { register } = useContext(AuthContext);
  const [role, setRole] = useState('citizen');
  const [adminLevel, setAdminLevel] = useState('Village');
  
  // Basic info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Casing states for drop-downs
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [block, setBlock] = useState('');
  const [panchayat, setPanchayat] = useState('');
  const [village, setVillage] = useState('');

  // Dropdown lists
  const [statesList, setStatesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);
  const [blocksList, setBlocksList] = useState([]);
  const [panchayatsList, setPanchayatsList] = useState([]);
  const [villagesList, setVillagesList] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Load States on mount
  useEffect(() => {
    if (locationData[country]) {
      const states = Object.keys(locationData[country]);
      setStatesList(states);
      setState(states[0] || '');
    }
  }, [country]);

  // Load Districts when State changes
  useEffect(() => {
    if (state && locationData[country]?.[state]) {
      const districts = Object.keys(locationData[country][state]);
      setDistrictsList(districts);
      setDistrict(districts[0] || '');
    } else {
      setDistrictsList([]);
      setDistrict('');
    }
  }, [state]);

  // Load Blocks when District changes
  useEffect(() => {
    if (district && locationData[country]?.[state]?.[district]) {
      const blocks = Object.keys(locationData[country][state][district]);
      setBlocksList(blocks);
      setBlock(blocks[0] || '');
    } else {
      setBlocksList([]);
      setBlock('');
    }
  }, [district]);

  // Load Panchayats when Block changes
  useEffect(() => {
    if (block && locationData[country]?.[state]?.[district]?.[block]) {
      const panchayats = Object.keys(locationData[country][state][district][block]);
      setPanchayatsList(panchayats);
      setPanchayat(panchayats[0] || '');
    } else {
      setPanchayatsList([]);
      setPanchayat('');
    }
  }, [block]);

  // Load Villages when Panchayat changes
  useEffect(() => {
    if (panchayat && locationData[country]?.[state]?.[district]?.[block]?.[panchayat]) {
      const villages = locationData[country][state][district][block][panchayat];
      setVillagesList(villages);
      setVillage(villages[0] || '');
    } else {
      setVillagesList([]);
      setVillage('');
    }
  }, [panchayat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name || !email || !password || !confirmPassword || !state || !district || !block || !panchayat || !village) {
      setFormError('Please fill in all fields including full location details.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    // Capture administrative region scope
    let adminRegion = '';
    if (role === 'admin') {
      if (adminLevel === 'Country') adminRegion = country;
      else if (adminLevel === 'State') adminRegion = state;
      else if (adminLevel === 'District') adminRegion = district;
      else if (adminLevel === 'Block') adminRegion = block;
      else if (adminLevel === 'Panchayat') adminRegion = panchayat;
      else if (adminLevel === 'Village') adminRegion = village;
    }

    const payload = {
      name,
      email,
      password,
      role,
      adminLevel: role === 'admin' ? adminLevel : null,
      adminRegion: role === 'admin' ? adminRegion : null,
      country,
      state,
      district,
      block,
      panchayat,
      village
    };

    setSubmitting(true);
    try {
      await register(payload);
      setCurrentPage('home');
    } catch (err) {
      setFormError(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl bg-white border border-slate-200/60 rounded-3xl p-8 shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600"></div>
        
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Citizen & Auditor Registration</h2>
          <p className="text-slate-500 text-sm font-medium">Select your village jurisdiction to map local projects in your dashboard.</p>
        </div>

        {formError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-3 rounded-xl mb-6">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Role Toggle Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Account Portal Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('citizen')}
                className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                  role === 'citizen'
                    ? 'bg-blue-50 border-blue-300 text-blue-800 ring-2 ring-blue-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <User className="w-4.5 h-4.5 text-blue-600 inline mr-2" />
                <span>Local Citizen</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                  role === 'admin'
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-800 ring-2 ring-indigo-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Shield className="w-4.5 h-4.5 text-indigo-600 inline mr-2" />
                <span>Auditing Officer</span>
              </button>
            </div>
          </div>

          {/* Admin Level Scoping (if Admin Role) */}
          {role === 'admin' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-indigo-50/40 border border-indigo-100 rounded-2xl p-5 space-y-4"
            >
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Auditing Jurisdiction Tier</label>
                <select
                  value={adminLevel}
                  onChange={(e) => setAdminLevel(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/25 font-bold"
                >
                  <option value="Country">Country Level (National)</option>
                  <option value="State">State Level</option>
                  <option value="District">District Level</option>
                  <option value="Block">Block Level</option>
                  <option value="Panchayat">Panchayat Level</option>
                  <option value="Village">Village Level</option>
                </select>
                <p className="text-[10px] text-slate-500 font-medium pt-1">
                  Note: You will be granted authority to create and manage projects matching your selected region.
                </p>
              </div>
            </motion.div>
          )}

          {/* Basic Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ramesh Kumar"
                  className="w-full bg-slate-55/60 border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh@citizens.org"
                  className="w-full bg-slate-55/60 border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
                />
              </div>
            </div>
          </div>

          {/* Password inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-55/60 border border-slate-200 rounded-xl py-2.5 pl-11 pr-10 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-55/60 border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
                />
              </div>
            </div>
          </div>

          {/* Location Hierarchy Selectors */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-1.5">
              <Globe className="w-4.5 h-4.5 text-blue-500" />
              <span>Panchayat Jurisdiction Mapping</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Country */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none"
                >
                  <option value="India">India</option>
                </select>
              </div>

              {/* State */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">State</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none"
                >
                  {statesList.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* District */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">District</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none"
                >
                  {districtsList.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Block */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Block / City</label>
                <select
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none"
                >
                  {blocksList.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Panchayat */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Panchayat</label>
                <select
                  value={panchayat}
                  onChange={(e) => setPanchayat(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none"
                >
                  {panchayatsList.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              {/* Village */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Village</label>
                <select
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none"
                >
                  {villagesList.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-medium pt-1 px-1">
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              <span>Selected Scope: {country} / {state} / {district} / {block} / {panchayat} / {village}</span>
            </div>

          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-slate-950 hover:bg-slate-900 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50 mt-2 cursor-pointer border-none"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
            ) : (
              <>
                <UserPlus className="w-5 h-5 text-blue-400" />
                <span>Create Verified Account</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-500 text-sm font-medium">
            Already have an account?{' '}
            <button
              onClick={() => setCurrentPage('login')}
              className="text-blue-600 hover:text-blue-700 font-bold focus:outline-none"
            >
              Sign In
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
