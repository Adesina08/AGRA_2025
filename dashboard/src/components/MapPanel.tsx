import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Submission } from '../types';

interface MapPanelProps {
  submissions: Submission[];
  title: string;
  colorBy?: (submission: Submission) => string;
}

const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export const MapPanel: React.FC<MapPanelProps> = ({ submissions, title, colorBy }) => {
  const coords = submissions.filter((s) => s.d8Latitude && s.d8Longitude);
  const center = coords.length
    ? [coords[0].d8Latitude as number, coords[0].d8Longitude as number]
    : [0, 0];

  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-2">
        <p className="section-title">{title}</p>
        <span className="text-xs text-gray-400">GPS from D8 fields</span>
      </div>
      <div className="h-80 rounded overflow-hidden">
        <MapContainer center={center as [number, number]} zoom={5} scrollWheelZoom className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {coords.length ? (
            coords.map((submission) => (
              <Marker key={submission.id} position={[submission.d8Latitude!, submission.d8Longitude!]} icon={defaultIcon}>
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold">{submission.caseId}</p>
                    <p>{new Date(submission.submissionDate).toLocaleString()}</p>
                    <p>Status: {submission.status}</p>
                    {submission.d4Sex && <p>D4: {submission.d4Sex}</p>}
                    {submission.d9LocationType && <p>D9: {submission.d9LocationType}</p>}
                  </div>
                </Popup>
              </Marker>
            ))
          ) : (
            <CircleMarker center={[0, 0]} radius={10} color="#4fd1c5">
              <Popup>GPS data will appear here once available</Popup>
            </CircleMarker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};
