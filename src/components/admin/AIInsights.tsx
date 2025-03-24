import React from 'react';
import { Brain } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface InsightProps {
  users: any[];
}

export function AIInsights({ users }: InsightProps) {
  // User type distribution
  const pandits = users.filter(u => u.role === 'pandit').length;
  const devotees = users.filter(u => u.role === 'user').length;

  const userGrowthData = {
    labels: ['Current'],
    datasets: [
      {
        label: 'Total Users',
        data: [users.length],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const bookingsData = {
    labels: ['Current'],
    datasets: [
      {
        label: 'Total Bookings',
        data: [0], // Replace with actual bookings count
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  };

  const userDistributionData = {
    labels: ['Pandits', 'Devotees'],
    datasets: [
      {
        data: [pandits, devotees],
        backgroundColor: [
          'rgba(249, 115, 22, 0.8)',
          'rgba(59, 130, 246, 0.8)',
        ],
        borderColor: [
          'rgba(249, 115, 22, 1)',
          'rgba(59, 130, 246, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const revenueData = {
    labels: ['Current'],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: [0], // Replace with actual revenue
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-semibold">Platform Analytics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Total Users</h3>
          <Line options={options} data={userGrowthData} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Total Bookings</h3>
          <Bar options={options} data={bookingsData} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">User Distribution</h3>
          <div className="max-w-[300px] mx-auto">
            <Doughnut options={doughnutOptions} data={userDistributionData} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Total Revenue</h3>
          <Line options={options} data={revenueData} />
        </div>
      </div>
    </div>
  );
}