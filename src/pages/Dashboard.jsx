import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = ({ analysis }) => {
  const total = analysis.length;
  const highSeverity = analysis.filter(b => b.severity === 'high').length;

  const severityCounts = {
    low: analysis.filter(b => b.severity === 'low').length,
    medium: analysis.filter(b => b.severity === 'medium').length,
    high: highSeverity
  };

  const pieData = {
    labels: ['Gravité Faible', 'Gravité Moyenne', 'Gravité Élevée'],
    datasets: [
      {
        data: [severityCounts.low, severityCounts.medium, severityCounts.high],
        backgroundColor: ['#4ade80', '#facc15', '#ef4444'],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Tableau de Bord</h2>

      <div className="flex gap-4 mt-4">
        <div className="bg-white p-4 shadow rounded w-full text-center">
          <h4 className="text-sm font-medium text-gray-500">Total Biais</h4>
          <p className="text-xl font-bold text-gray-700">{total}</p>
        </div>
        <div className="bg-white p-4 shadow rounded w-full text-center">
          <h4 className="text-sm font-medium text-gray-500">Gravité Élevée</h4>
          <p className="text-xl font-bold text-red-600">{highSeverity}</p>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded shadow">
        <h4 className="text-lg font-medium mb-4 text-gray-600">Répartition des biais par gravité</h4>
        <Pie data={pieData} />
      </div>
    </div>
  );
};

export default Dashboard;
