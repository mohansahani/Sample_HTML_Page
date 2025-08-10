import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

function toChart(data, labelKey = '_id', countKey = 'count', title = '') {
  const labels = data.map(d => d[labelKey] || 'N/A');
  const values = data.map(d => d[countKey]);
  const colors = labels.map((_, i) => `hsl(${(i * 53) % 360} 70% 55%)`);
  return { labels, datasets: [{ label: title, data: values, backgroundColor: colors }] };
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/assets/stats').then(res => setStats(res.data));
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="card">
        <h2 className="font-semibold mb-2">Assets by Type</h2>
        <Pie data={toChart(stats.byType, '_id', 'count', 'By Type')} />
      </div>
      <div className="card">
        <h2 className="font-semibold mb-2">Assets by Zone</h2>
        <Pie data={toChart(stats.byZone, '_id', 'count', 'By Zone')} />
      </div>
      <div className="card">
        <h2 className="font-semibold mb-2">Assigned vs Spare</h2>
        <Pie data={toChart(stats.assignedVsSpare, 'label', 'count', 'Assigned vs Spare')} />
      </div>
      <div className="card md:col-span-3">
        <h2 className="font-semibold mb-2">Assets by Branch</h2>
        <Pie data={toChart(stats.byBranch, '_id', 'count', 'By Branch')} />
      </div>
    </div>
  );
}