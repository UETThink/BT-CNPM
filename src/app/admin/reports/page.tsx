"use client";

import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  DollarSign,
  Ticket,
  Film,
  TrendingUp,
  Calendar,
  Download,
} from "lucide-react";

interface ReportData {
  overview: {
    totalRevenue: number;
    totalBookings: number;
    totalMovies: number;
    averageTicketPrice: number;
  };
  revenueByDay: {
    date: string;
    revenue: number;
    bookings: number;
  }[];
  revenueByMonth: {
    month: string;
    revenue: number;
    bookings: number;
  }[];
  bookingsByStatus: {
    status: string;
    count: number;
    color: string;
  }[];
  topMovies: {
    movieId: string;
    title: string;
    revenue: number;
    bookings: number;
  }[];
}

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

export default function AdminReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "all">("30d");

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/reports?range=${dateRange}`);
      const data = await res.json();
      if (data.success) {
        setReportData(data.data);
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = reportData
    ? [
        {
          title: "Tổng doanh thu",
          value: formatCurrency(reportData.overview.totalRevenue),
          icon: DollarSign,
          color: "bg-green-500",
        },
        {
          title: "Tổng đơn hàng",
          value: reportData.overview.totalBookings.toLocaleString(),
          icon: Ticket,
          color: "bg-blue-500",
        },
        {
          title: "Phim đang chiếu",
          value: reportData.overview.totalMovies.toLocaleString(),
          icon: Film,
          color: "bg-purple-500",
        },
        {
          title: "Giá vé TB",
          value: formatCurrency(reportData.overview.averageTicketPrice),
          icon: TrendingUp,
          color: "bg-orange-500",
        },
      ]
    : [];

  if (isLoading && !reportData) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo cáo & Thống kê</h1>
          <p className="text-gray-500">Phân tích doanh thu và hoạt động kinh doanh</p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
            className="h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="7d">7 ngày qua</option>
            <option value="30d">30 ngày qua</option>
            <option value="90d">90 ngày qua</option>
            <option value="all">Tất cả</option>
          </select>
          <button className="flex items-center gap-2 px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            <Download className="h-4 w-4" />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Day */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Doanh thu theo ngày</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reportData?.revenueByDay || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getDate()}/${date.getMonth() + 1}`;
                  }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), "Doanh thu"]}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString("vi-VN");
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: "#3B82F6" }}
                  name="Doanh thu"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings by Status */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Đơn hàng theo trạng thái</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reportData?.bookingsByStatus || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="count"
                  nameKey="status"
                  label={({ status, count, percent }) =>
                    `${status} (${(percent * 100).toFixed(0)}%)`
                  }
                  labelLine={false}
                >
                  {reportData?.bookingsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [value, name]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Month */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Doanh thu theo tháng</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportData?.revenueByMonth || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), "Doanh thu"]}
                />
                <Legend />
                <Bar
                  dataKey="revenue"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                  name="Doanh thu"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Movies */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top phim bán chạy</h3>
          <div className="space-y-4">
            {reportData?.topMovies.slice(0, 5).map((movie, index) => (
              <div key={movie.movieId} className="flex items-center gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold text-sm">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{movie.title}</p>
                  <p className="text-xs text-gray-500">
                    {movie.bookings} vé
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">
                    {formatCurrency(movie.revenue)}
                  </p>
                </div>
              </div>
            ))}
            {(!reportData?.topMovies || reportData.topMovies.length === 0) && (
              <p className="text-center text-gray-500 py-8">Chưa có dữ liệu</p>
            )}
          </div>
        </div>
      </div>

      {/* Revenue by Day Bar Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Số lượng đặt vé theo ngày</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reportData?.revenueByDay || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number, name: string) => [
                  value,
                  name === "bookings" ? "Số vé" : name,
                ]}
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return date.toLocaleDateString("vi-VN");
                }}
              />
              <Legend />
              <Bar
                dataKey="bookings"
                fill="#10B981"
                radius={[4, 4, 0, 0]}
                name="Số vé"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
