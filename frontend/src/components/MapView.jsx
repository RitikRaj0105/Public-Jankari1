import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon paths in Leaflet + React builds
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper for status badge style
const getStatusStyles = (status) => {
  switch (status) {
    case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'In Progress': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Suspended': return 'bg-rose-50 text-rose-700 border-rose-200';
    default: return 'bg-blue-50 text-blue-700 border-blue-200';
  }
};

export default function MapView({ projects, onSelectProject }) {
  const defaultCenter = [20.5937, 78.9629]; // Center of India
  
  const validProjects = projects.filter(p => p.location?.latitude && p.location?.longitude);
  const center = validProjects.length > 0 
    ? [validProjects[0].location.latitude, validProjects[0].location.longitude] 
    : defaultCenter;

  return (
    <div className="w-full h-[500px] rounded-2xl overflow-hidden border border-slate-200/80 shadow-md">
      <MapContainer center={center} zoom={validProjects.length > 1 ? 5 : 6} scrollWheelZoom={true} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validProjects.map((project) => (
          <Marker 
            key={project._id} 
            position={[project.location.latitude, project.location.longitude]}
          >
            <Popup>
              <div className="p-1 font-sans space-y-2 min-w-[200px]">
                <h4 className="font-bold text-slate-900 text-sm leading-tight">{project.name}</h4>
                <div className="flex items-center justify-between pt-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getStatusStyles(project.status)}`}>
                    {project.status}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    ₹{(project.budget / 1000000).toFixed(2)}M
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">{project.location.address}</p>
                <button
                  onClick={() => onSelectProject(project._id)}
                  className="w-full mt-2 text-center bg-slate-950 hover:bg-slate-800 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition-all cursor-pointer border-none"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
