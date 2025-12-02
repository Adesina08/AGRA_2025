import React, { useMemo, useState } from 'react';

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  title: string;
  columns: Column<T>[];
  rows: T[];
}

export function DataTable<T extends object>({ title, columns, rows }: DataTableProps<T>) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    return rows.filter((row) =>
      Object.values(row).some((value) => value?.toString().toLowerCase().includes(query.toLowerCase()))
    );
  }, [rows, query]);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <p className="section-title m-0">{title}</p>
        <div className="flex items-center space-x-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="bg-navy-900 border border-navy-700 rounded px-3 py-1 text-sm focus:outline-none focus:border-accent"
          />
          <button className="px-3 py-1 text-sm rounded border border-accent text-accent hover:bg-accent/10">
            Export CSV
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-gray-400">
              {columns.map((col) => (
                <th key={col.key as string} className="text-left py-2 pr-4 font-semibold">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, idx) => (
              <tr key={idx} className="border-t border-navy-700/60 text-gray-100">
                {columns.map((col) => (
                  <td key={col.key as string} className="py-2 pr-4">
                    {col.render ? col.render(row) : (row[col.key] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td colSpan={columns.length} className="py-4 text-center text-gray-400">
                  No records
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
