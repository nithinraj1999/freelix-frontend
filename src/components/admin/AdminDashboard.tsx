import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { dashboardData } from '../../api/admin/adminServices';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// TypeScript interfaces for the data structures
interface Revenue {
  totalRevenue: number;
  totalEarnings: number;
}

interface MonthlyRevenue {
  total: number;
  orderDate: string;
}

interface EscrowBalance {
  escrowBalance: number;
}

interface data{
    revenueData: Revenue[];
    monthlyRevenue: MonthlyRevenue[];
    escrowBalance: EscrowBalance[];
    totalFreelancers: number;
    totalJobPost: number;
    walletAmount: number | null;
}
interface DashboardDataResponse {
    dashboardData:data
}

const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalProfit: 0,
    totalFreelancers: 0,
    totalJobPosts: 0,
    escrowBalance: 0,
    platformWallet: 0,
  });

  const [revenueData, setRevenueData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: 'Total Revenue',
        data: [] as number[],
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
      },
    ],
  });

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const data: DashboardDataResponse = await dashboardData();
        
        const response = data.dashboardData
        console.log(response.revenueData);
        
        if (response) {
          // Update metrics
          setMetrics({
            totalRevenue: response.revenueData?.[0]?.totalRevenue || 0,
            totalProfit: response.revenueData?.[0]?.totalEarnings || 0,
            totalFreelancers: response.totalFreelancers || 0,
            totalJobPosts: response.totalJobPost || 0,
            escrowBalance: response.escrowBalance?.[0]?.escrowBalance || 0,
            platformWallet: response.walletAmount || 0,
          });

          // Process monthly revenue for graph
          const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December',
          ];

          const revenueByMonth = new Array(12).fill(0); // Initialize revenue data for 12 months
          response.monthlyRevenue?.forEach((item) => {
            const monthIndex = new Date(item.orderDate).getMonth();
            revenueByMonth[monthIndex] += item.total; // Aggregate revenue by month
          });

          setRevenueData({
            labels: months,
            datasets: [
              {
                label: 'Total Revenue',
                data: revenueByMonth,
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
              },
            ],
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    }

    fetchDashboardData();
  }, []);

  const revenueOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Revenue Over Time',
      },
    },
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Metrics Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow-md p-4 rounded-md">
          <h2 className="text-lg font-semibold">Total Revenue</h2>
          <p className="text-2xl font-bold text-green-500">${metrics.totalRevenue}</p>
        </div>
        <div className="bg-white shadow-md p-4 rounded-md">
          <h2 className="text-lg font-semibold">Total Profit</h2>
          <p className="text-2xl font-bold text-blue-500">${metrics.totalProfit}</p>
        </div>
        <div className="bg-white shadow-md p-4 rounded-md">
          <h2 className="text-lg font-semibold">Total Freelancers</h2>
          <p className="text-2xl font-bold text-purple-500">{metrics.totalFreelancers}</p>
        </div>
        <div className="bg-white shadow-md p-4 rounded-md">
          <h2 className="text-lg font-semibold">Total Job Posts</h2>
          <p className="text-2xl font-bold text-yellow-500">{metrics.totalJobPosts}</p>
        </div>
        <div className="bg-white shadow-md p-4 rounded-md">
          <h2 className="text-lg font-semibold">Escrow Balance</h2>
          <p className="text-2xl font-bold text-orange-500">${metrics.escrowBalance}</p>
        </div>
        {/* <div className="bg-white shadow-md p-4 rounded-md">
          <h2 className="text-lg font-semibold">Platform Wallet Amount</h2>
          <p className="text-2xl font-bold text-red-500">${metrics.platformWallet}</p>
        </div> */}
      </div>

      {/* Revenue Graph */}
      <div className="bg-white shadow-md p-6 rounded-md">
        <Line data={revenueData} options={revenueOptions} />
      </div>
    </div>
  );
};

export default AdminDashboard;
