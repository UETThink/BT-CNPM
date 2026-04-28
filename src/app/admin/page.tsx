"use client";

import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  Film,
  Ticket,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface DashboardStats {
  totalMovies: number;
  totalBookings: number;
  todayBookings: number;
  totalRevenue: number;
  todayRevenue: number;
}

interface RecentBooking {
  id: string;
  bookingCode: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  showtime: {
    movie: { title: string };
    room: { name: string };
  };
  payment?: {
    status: string;
    method: string;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/dashboard");
      const data = await res.json();
      if (data.success) {
        setStats(data.data.stats);
        setRecentBookings(data.data.recentBookings);
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: "Tổng doanh thu",
      value: formatCurrency(stats?.totalRevenue || 0),
      change: "+12%",
      trend: "up",
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      title: "Doanh thu hôm nay",
      value: formatCurrency(stats?.todayRevenue || 0),
      change: "+8%",
      trend: "up",
      icon: TrendingUp,
      color: "bg-blue-500",
    },
    {
      title: "Số phim",
      value: stats?.totalMovies || 0,
      change: "+3",
      trend: "up",
      icon: Film,
      color: "bg-purple-500",
    },
    {
      title: "Vé đã bán",
      value: stats?.totalBookings || 0,
      change: "+24",
      trend: "up",
      icon: Ticket,
      color: "bg-orange-500",
    },
    {
      title: "Đơn hàng hôm nay",
      value: stats?.todayBookings || 0,
      change: "+5",
      trend: "up",
      icon: Calendar,
      color: "bg-cyan-500",
    },
    {
      title: "Người dùng",
      value: 1250,
      change: "+45",
      trend: "up",
      icon: Users,
      color: "bg-pink-500",
    },
  ];

  const statusConfig: Record<string, { label: string; class: string }> = {
    CONFIRMED: { label: "Đã xác nhận", class: "bg-green-100 text-green-700" },
    PENDING: { label: "Đang chờ", class: "bg-yellow-100 text-yellow-700" },
    CANCELLED: { label: "Đã hủy", class: "bg-red-100 text-red-700" },
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Tổng quan hệ thống CinemaTicket</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
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
                <span
                  className={`flex items-center text-sm font-medium ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-bold text-gray-900">Đơn hàng gần đây</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã đặt vé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phim
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phòng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm text-gray-900">
                        {booking.bookingCode}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {booking.user.name}
                        </p>
                        <p className="text-xs text-gray-500">{booking.user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {booking.showtime.movie.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {booking.showtime.room.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900">
                        {formatCurrency(booking.totalAmount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          statusConfig[booking.status]?.class || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {statusConfig[booking.status]?.label || booking.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Chưa có đơn hàng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
