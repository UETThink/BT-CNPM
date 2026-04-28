"use client";

import { useState, useEffect } from "react";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Search,
  Eye,
  X,
  Mail,
  Phone,
  Calendar,
  Ticket,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface UserItem {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: string;
  createdAt: string;
  _count: {
    bookings: number;
  };
  bookings: {
    id: string;
    bookingCode: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    showtime: {
      movie: {
        title: string;
      };
      room: {
        name: string;
      };
    };
  }[];
}

const roleLabels: Record<string, { label: string; class: string }> = {
  ADMIN: { label: "Quản trị", class: "bg-purple-100 text-purple-700" },
  CUSTOMER: { label: "Khách hàng", class: "bg-blue-100 text-blue-700" },
};

const statusConfig: Record<string, { label: string; class: string }> = {
  PENDING: { label: "Đang chờ", class: "bg-yellow-100 text-yellow-700" },
  CONFIRMED: { label: "Đã xác nhận", class: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Đã hủy", class: "bg-red-100 text-red-700" },
  EXPIRED: { label: "Hết hạn", class: "bg-gray-100 text-gray-700" },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchUsers();
  }, [currentPage, roleFilter]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      let url = `/api/users?page=${currentPage}&pageSize=${pageSize}`;
      if (roleFilter) url += `&role=${roleFilter}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setUsers(data.data.items);
        setTotalPages(data.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    searchTerm
      ? user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone && user.phone.includes(searchTerm))
      : true
  );

  const fetchUserDetail = async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`);
      const data = await res.json();
      if (data.success) {
        setSelectedUser(data.data);
      }
    } catch (error) {
      console.error("Error fetching user detail:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
          <p className="text-gray-500">Xem danh sách và thông tin tài khoản</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Tất cả vai trò</option>
            <option value="ADMIN">Quản trị</option>
            <option value="CUSTOMER">Khách hàng</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số điện thoại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số đơn hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tham gia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.phone || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          roleLabels[user.role]?.class || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {roleLabels[user.role]?.label || user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Ticket className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{user._count.bookings}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => fetchUserDetail(user.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Không có người dùng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <p className="text-sm text-gray-500">
              Trang {currentPage} / {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Chi tiết người dùng</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold text-2xl">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedUser.name}</h3>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      roleLabels[selectedUser.role]?.class || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {roleLabels[selectedUser.role]?.label || selectedUser.role}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Số điện thoại</p>
                    <p className="font-medium">{selectedUser.phone || "Chưa cập nhật"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Ngày tham gia</p>
                    <p className="font-medium">{formatDateTime(selectedUser.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Ticket className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Tổng đơn hàng</p>
                    <p className="font-medium">{selectedUser.bookings?.length || 0} đơn</p>
                  </div>
                </div>
              </div>

              {/* Booking History */}
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-900 mb-4">Lịch sử đặt vé</h3>
                {selectedUser.bookings && selectedUser.bookings.length > 0 ? (
                  <div className="space-y-3">
                    {selectedUser.bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {booking.showtime.movie.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {booking.showtime.room.name} • {formatDateTime(booking.createdAt)}
                          </p>
                          <p className="text-xs text-gray-400 font-mono">
                            {booking.bookingCode}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary-600">
                            {formatCurrency(booking.totalAmount)}
                          </p>
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                              statusConfig[booking.status]?.class || "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {statusConfig[booking.status]?.label || booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    Chưa có đơn hàng nào
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
