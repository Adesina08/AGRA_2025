import React from 'react';
import { ProjectId } from '../types';

interface TabsProps {
  active: ProjectId;
  onChange: (project: ProjectId) => void;
}

const tabs: { id: ProjectId; label: string }[] = [
  { id: 'FARMER', label: 'AGRA FARMER' },
  { id: 'ENTERPRISE', label: 'AGRA ENTERPRISE' },
  { id: 'YOUTH', label: 'AGRA YOUTH' },
];

export const Tabs: React.FC<TabsProps> = ({ active, onChange }) => {
  return (
    <div className="flex space-x-3 border-b border-navy-700 pb-2 mt-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition border ${
            active === tab.id
              ? 'bg-accent/10 border-accent text-accent'
              : 'bg-navy-800 border-transparent text-gray-300 hover:border-accent/60'
          }`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
