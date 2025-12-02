import React, { useEffect, useMemo, useState } from 'react';
import './index.css';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { Header } from './components/Header';
import { Tabs } from './components/Tabs';
import { KpiCard } from './components/KpiCard';
import { ChartCard } from './components/ChartCard';
import { DataTable } from './components/DataTable';
import { MapPanel } from './components/MapPanel';
import { ProjectId, Submission } from './types';
import { submissionsSeed, generateNewSubmission } from './data/sampleData';

const colors = ['#4fd1c5', '#63b3ed', '#f6ad55', '#f472b6', '#c084fc'];

const countByField = (rows: Submission[], getter: (row: Submission) => string | number | undefined) => {
  const counts: Record<string, number> = {};
  rows.forEach((row) => {
    const key = getter(row) ?? 'Unknown';
    counts[key] = (counts[key] || 0) + 1;
  });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
};

const trendByDate = (rows: Submission[]) => {
  const map: Record<string, number> = {};
  rows.forEach((row) => {
    const dateLabel = new Date(row.submissionDate).toLocaleDateString();
    map[dateLabel] = (map[dateLabel] || 0) + 1;
  });
  return Object.entries(map).map(([date, value]) => ({ date, value }));
};

const averageAge = (values: (number | undefined)[]) => {
  const filtered = values.filter((v): v is number => typeof v === 'number');
  if (!filtered.length) return 'n/a';
  return Math.round(filtered.reduce((acc, v) => acc + v, 0) / filtered.length);
};

const latestSubmissionDate = (rows: Submission[]) => {
  if (!rows.length) return undefined;
  return new Date(Math.max(...rows.map((r) => new Date(r.submissionDate).getTime())));
};

export const App: React.FC = () => {
  const [activeProject, setActiveProject] = useState<ProjectId>('FARMER');
  const [submissions, setSubmissions] = useState<Submission[]>(submissionsSeed);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setSubmissions((prev) => [...prev, generateNewSubmission(activeProject)]);
      setLastRefreshed(new Date());
    }, 45000); // simulate real-time with a short interval for demo
    return () => clearInterval(interval);
  }, [activeProject]);

  const latest = useMemo(() => latestSubmissionDate(submissions), [submissions]);
  const projectRows = useMemo(() => submissions.filter((s) => s.project === activeProject), [submissions, activeProject]);

  const kpis = useMemo(() => {
    if (activeProject === 'FARMER') {
      const total = projectRows.length;
      const approved = projectRows.filter((r) => r.status === 'approved').length;
      const femaleCount = projectRows.filter((r) => r.db7Gender === 'Female').length;
      const genderSplit = total ? Math.round((femaleCount / total) * 100) : 0;
      const youthBand = projectRows.filter((r) => r.db6AgeCategory === '18-35').length;
      const avgDuration = projectRows.reduce((sum, r) => sum + r.durationMinutes, 0) / (projectRows.length || 1);
      return [
        { title: 'Total farmer submissions', value: total, tone: 'info' as const },
        { title: 'Approved records', value: approved, subtitle: `${Math.round((approved / (total || 1)) * 100)}%`, tone: 'success' as const },
        { title: 'Female respondents (DB7)', value: `${genderSplit}%`, subtitle: `${femaleCount} of ${total}`, tone: 'warning' as const },
        { title: 'Age category 18-35 (DB6)', value: youthBand, subtitle: 'Youth segment', tone: 'info' as const },
        { title: 'Avg duration (minutes)', value: avgDuration.toFixed(1), tone: 'info' as const },
      ];
    }

    if (activeProject === 'ENTERPRISE') {
      const total = projectRows.length;
      const validated = projectRows.filter((r) => r.validationStatus === 'validated').length;
      const femaleOwners = projectRows.filter((r) => r.b1OwnerGender === 'Female').length;
      const avgAge = averageAge(projectRows.flatMap((r) => [r.b2MaleOwnerAge, r.b3FemaleOwnerAge]));
      const approved = projectRows.filter((r) => r.status === 'approved').length;
      return [
        { title: 'Enterprises surveyed', value: total, tone: 'info' as const },
        { title: 'Validated cases', value: validated, subtitle: `${Math.round((validated / (total || 1)) * 100)}%`, tone: 'success' as const },
        { title: 'Female-led enterprises', value: `${Math.round((femaleOwners / (total || 1)) * 100)}%`, subtitle: `${femaleOwners} of ${total}`, tone: 'warning' as const },
        { title: 'Avg owner age (B2/B3)', value: avgAge, tone: 'info' as const },
        { title: 'Approved interviews', value: approved, tone: 'success' as const },
      ];
    }

    const total = projectRows.length;
    const female = projectRows.filter((r) => r.d4Sex === 'Female').length;
    const engagementSplit = countByField(projectRows, (r) => r.engagementType);
    const topEngagement = engagementSplit.sort((a, b) => b.value - a.value)[0];
    return [
      { title: 'Youth submissions', value: total, tone: 'info' as const },
      { title: 'Female youth (D4)', value: `${Math.round((female / (total || 1)) * 100)}%`, subtitle: `${female} of ${total}`, tone: 'warning' as const },
      { title: 'Most common engagement', value: topEngagement ? topEngagement.name : 'n/a', tone: 'info' as const },
      { title: 'Pending QC', value: projectRows.filter((r) => r.status === 'pending').length, tone: 'error' as const },
      { title: 'Map-enabled records', value: projectRows.filter((r) => r.d8Latitude && r.d8Longitude).length, tone: 'success' as const },
    ];
  }, [activeProject, projectRows]);

  const donutData = useMemo(() => {
    if (activeProject === 'FARMER') return countByField(projectRows, (r) => r.db7Gender || r.d10Gender);
    if (activeProject === 'ENTERPRISE') return countByField(projectRows, (r) => r.b1OwnerGender || r.a10RespondentGender);
    return countByField(projectRows, (r) => r.d4Sex);
  }, [projectRows, activeProject]);

  const barData = useMemo(() => {
    if (activeProject === 'FARMER') return countByField(projectRows, (r) => r.db11Region || r.db10District);
    if (activeProject === 'ENTERPRISE') return countByField(projectRows, (r) => r.b14District);
    return countByField(projectRows, (r) => r.d9LocationType);
  }, [projectRows, activeProject]);

  const trendData = useMemo(() => trendByDate(projectRows), [projectRows]);

  const coverageRows = useMemo(() => {
    return barData.map((row) => ({ ...row, percent: projectRows.length ? Math.round((row.value / projectRows.length) * 100) : 0 }));
  }, [barData, projectRows.length]);

  const demographicRows = useMemo(() => {
    if (activeProject === 'FARMER') {
      return projectRows.map((r) => ({ AgeCategory: r.db6AgeCategory ?? 'Unknown', Gender: r.db7Gender ?? 'Unknown' }));
    }
    if (activeProject === 'ENTERPRISE') {
      return projectRows.map((r) => ({ OwnerGender: r.b1OwnerGender ?? 'Unknown', RespondentGender: r.a10RespondentGender ?? 'Unknown' }));
    }
    return projectRows.map((r) => ({ Engagement: r.engagementType ?? 'Unknown', Sex: r.d4Sex ?? 'Unknown' }));
  }, [projectRows, activeProject]);

  const enumeratorTable = useMemo(() => {
    const grouped = countByField(projectRows, (r) => r.enumerator);
    return grouped.map((g) => ({ enumerator: g.name, submissions: g.value }));
  }, [projectRows]);

  const recentSubmissions = useMemo(() => {
    return [...projectRows]
      .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime())
      .slice(0, 20);
  }, [projectRows]);

  return (
    <div className="min-h-screen bg-navy-900 text-gray-100 p-4 md:p-8 space-y-6">
      <Header lastRefreshed={lastRefreshed} latestSubmission={latest} onRefresh={() => setLastRefreshed(new Date())} />
      <Tabs active={activeProject} onChange={setActiveProject} />

      <section className="grid-auto-fill">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.title} title={kpi.title} value={kpi.value} subtitle={kpi.subtitle} tone={kpi.tone} />
        ))}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ChartCard title="Gender / Sex split">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={donutData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={4}>
                {donutData.map((_, idx) => (
                  <Cell key={idx} fill={colors[idx % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title={activeProject === 'YOUTH' ? 'Location type (D9)' : 'Coverage by location'}>
          <ResponsiveContainer>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2a44" />
              <XAxis dataKey="name" tick={{ fill: '#cbd5f5', fontSize: 12 }} />
              <YAxis tick={{ fill: '#cbd5f5', fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#63b3ed" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Daily submissions">
          <ResponsiveContainer>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2a44" />
              <XAxis dataKey="date" tick={{ fill: '#cbd5f5', fontSize: 12 }} />
              <YAxis tick={{ fill: '#cbd5f5', fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#f6ad55" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MapPanel
          submissions={projectRows}
          title={activeProject === 'YOUTH' ? 'Youth map (D8 coordinates)' : 'Map placeholder'}
          colorBy={(r) => r.status}
        />
        <div className="grid grid-rows-2 gap-4">
          <DataTable
            title="Quota / Coverage"
            columns={[
              { key: 'name' as const, label: activeProject === 'YOUTH' ? 'Location type (D9)' : 'Region/District' },
              { key: 'value' as const, label: 'Submissions' },
              { key: 'percent' as const, label: '% of project' },
            ]}
            rows={coverageRows}
          />
          <DataTable
            title="Demographic breakdown"
            columns={Object.keys(demographicRows[0] || { Label: '', Value: '' }).map((key) => ({
              key: key as keyof (typeof demographicRows)[number],
              label: key,
            }))}
            rows={demographicRows}
          />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DataTable
          title="Enumerator performance"
          columns={[
            { key: 'enumerator' as const, label: 'Enumerator (username)' },
            { key: 'submissions' as const, label: 'Submissions' },
          ]}
          rows={enumeratorTable}
        />
        <DataTable
          title="Recent submissions"
          columns={[
            { key: 'submissionDate' as const, label: 'SubmissionDate' },
            { key: 'caseId' as const, label: 'Case ID' },
            { key: 'status' as const, label: 'QC Status' },
            { key: 'db7Gender' as const, label: activeProject === 'ENTERPRISE' ? 'B1 Owner gender' : 'Gender / Sex' },
            { key: 'db11Region' as const, label: 'Region/Province' },
            { key: 'd9LocationType' as const, label: 'Location type (D9)' },
          ]}
          rows={recentSubmissions.map((row) => ({
            ...row,
            submissionDate: new Date(row.submissionDate).toLocaleString(),
          }))}
        />
      </section>

      <section className="card text-sm text-gray-300">
        <p className="section-title">Implementation notes</p>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li>
            Replace sample data in <code>src/data/sampleData.ts</code> with the real datasets that follow the AGRA data dictionary.
          </li>
          <li>
            All field names use the official variable codes (e.g., DB7, D4, B14_Q) and labels appear in tooltips and headers per the
            dictionary mapping.
          </li>
          <li>
            Map layer currently uses youth GPS (D8 latitude/longitude). Farmer/Enterprise tabs show a placeholder until GPS is
            provided.
          </li>
          <li>
            Auto-refresh is simulated every 45 seconds; swap with your real data refresh cadence (e.g., hourly) or connect to a
            backend streaming endpoint.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default App;
