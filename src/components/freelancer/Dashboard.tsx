import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js'
import { useSelector } from 'react-redux'
import { RootState } from '../../state/store'
import { getDashboardData } from '../../api/freelancer/freelancerServices'

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend)

const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.user)
  const [chartData, setChartData] = useState<any>(null)
  const [earnings,setEarnings] =useState<any>(0)
  const [graphData,setGraphData]=useState<any>([])
  const [pendingEarnings,setPendingEarnings]=useState<any>(0)
  const [revenue,setRevenue] =useState<any>(0)
  const [totalbid,setTotalBidsCount] =useState<any>(0)
  const [totalOrdersCount,setTotalOrdersCount] =useState<any>(0)
  const [totalPendingOrders,setTotalPendingOrders] =useState<any>(0)

  useEffect(() => {
    async function fetchFreelancerData() {
      // Dummy data simulating API response
      const responsee = [
        
        {
          _id: '673df10ecd33a67924c7c037',
          orderDate: '2024-11-20T14:24:14.056+00:00',
          total: 9000,
        },
        {
          _id: '673deebbcd33a67924c7bff4',
          orderDate: '2024-10-20T14:14:19.238+00:00',
          total: 5000,
        },
        {
          _id: '673df10ecd33a67924c7c038',
          orderDate: '2024-09-15T14:14:19.238+00:00',
          total: 7000,
        },
        {
          _id: '673deebbcd33a67924c7bff5',
          orderDate: '2024-08-20T14:14:19.238+00:00',
          total: 6500,
        },
      ]
      const data ={
        userId:user?._id
      }
      const response = await getDashboardData(data)
      console.log("dashboard...",response);
      setEarnings(response.earnings)
      setTotalPendingOrders(response.totalPendingOrders)
      setTotalOrdersCount(response.totalOrdersCount)
      setTotalBidsCount(response.totalBidsCount)
      setRevenue(response.revenue)
      setPendingEarnings(response.pendingEarnings)
      setGraphData(response.orderByDate)
      setEarnings(response.earnings)
      processChartData(response.orderByDate) 
    }

    if (user?._id) {
      fetchFreelancerData()
    }
  }, [user])

  // Process the data to group totals by month
  const processChartData = (data: any) => {
    const months = Array(12).fill(0) // Initialize array for all months
    data.forEach((item: any) => {
      const orderDate = new Date(item.orderDate)
      const monthIndex = orderDate.getMonth() // Get month (0-indexed)
      months[monthIndex] += item.total // Add total to the corresponding month
    })

    const labels = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 
      'September', 'October', 'November', 'December'
    ]

    const updatedData = {
      labels: labels,
      datasets: [
        {
          label: 'Total Revenue',
          data: months, // Total revenue for each month
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0.4,
        },
      ],
    }

    setChartData(updatedData)
  }

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Revenue Over Time',
        font: { size: 16 },
      },
      tooltip: {
        mode: 'index' as 'index',
        intersect: false,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-32 w-full">
      <div className="w-full mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-semibold text-gray-700">Dashboard</h1>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <span className="text-xl text-gray-500">Total Revenue</span>
            <span className="text-3xl font-semibold text-green-600">${revenue}</span>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <span className="text-xl text-gray-500">Total Earnings</span>
            <span className="text-3xl font-semibold text-blue-600">${earnings}</span>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <span className="text-xl text-gray-500">Pending Earnings</span>
            <span className="text-3xl font-semibold text-yellow-600">${pendingEarnings}</span>
          </div>
        </div>

        {/* More Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <span className="text-xl text-gray-500">Total Jobs</span>
            <span className="text-3xl font-semibold text-gray-700">{totalOrdersCount}</span>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <span className="text-xl text-gray-500">Total Bids Sent</span>
            <span className="text-3xl font-semibold text-purple-600">{totalbid}</span>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <span className="text-xl text-gray-500">Active Job</span>
            <span className="text-3xl font-semibold text-red-600">{totalPendingOrders}</span>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Revenue Chart</h2>
          {chartData ? <Line data={chartData} options={options} /> : <p>Loading...</p>}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
