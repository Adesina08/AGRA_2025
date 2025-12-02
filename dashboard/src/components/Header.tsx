import React from 'react';
import { dictionaries } from '../data/dictionaries';

interface HeaderProps {
  lastRefreshed: Date;
  latestSubmission?: Date;
  onRefresh: () => void;
}

export const Header: React.FC<HeaderProps> = ({ lastRefreshed, latestSubmission, onRefresh }) => {
  return (
    <header className="bg-navy-800 border-b border-navy-700/80 px-6 py-4 rounded-xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">AGRA 2025 QC Realtime Dashboard</h1>
          <p className="text-gray-300">Unified monitoring for Farmer, Enterprise, and Youth projects</p>
          <p className="text-xs text-gray-400 mt-1">
            Data dictionary sheets detected: {dictionaries.map((d) => d.sheetName).join(', ')}
          </p>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-300">
          <div>
            <p className="text-xs text-gray-400">Last refreshed</p>
            <p className="font-semibold">{lastRefreshed.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Latest submission</p>
            <p className="font-semibold">{latestSubmission ? latestSubmission.toLocaleString() : 'n/a'}</p>
          </div>
          <button
            onClick={onRefresh}
            className="px-4 py-2 rounded-lg bg-accent/10 text-accent border border-accent hover:bg-accent/20"
          >
            Refresh
          </button>
        </div>
      </div>
    </header>
  );
};
