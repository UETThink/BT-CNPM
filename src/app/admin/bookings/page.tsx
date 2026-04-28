"use client";

import { useState, useEffect } from "react";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import {
  Search,
  Filter,
  Eye,
  XCircle,
  CheckCircle,
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface BookingItem {
  id: string;
  bookingCode: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  expiresAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  showtime: {
    id: string;
    startTime: string;
    movie: {
      id: string;
      title: string;
      poster: string | null;
    };
    room: {
      id: string;
      name: string;
    };
  };
  bookingSeats: {
    id: string;
    seat: {
      row: string;
      number: number;
      type: string;
    };
    price: number;
  }[];
  payment?: {
    id: string;
    status: string;
    method: string;
    paidAt: string | null;
  };
}

const statusConfig: Record<string, { label: string; class: string; icon: typeof CheckCircle }> = {
  PENDING: { label: "Đang chờ", class: "bg-yellow-100 text-yellow-700", icon: Clock },
  CONFIRMED: { label: "Đã xác nhận", class: "bg-green-100 text-green-700", icon: CheckCircle },
  CANCELLED: { label: "Đã hủy", class: "bg-red-100 text-red-700", icon: XCircle },
  EXPIRED: { label: "Hết hạn", class: "bg-gray-100 text-gray-700", icon: Clock },
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchBookings();
  }, [currentPage, statusFilter]);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      let url = `/api/bookings?page=${currentPage}&pageSize=${pageSize}`;
      if (statusFilter) url += `&status=${statusFilter}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setBookings(data.data.items);
        setTotalPages(data.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: status === "CANCELLED" ? "cancel" : "confirm" }),
      });

      const data = await res.json();
      if (data.success) {
        toast({
          title: "Cập nhật thành công",
          description: `Đơn hàng đã được ${status === "CANCELLED" ? "hủy" : "xác nhận"}`,
          variant: "success",
        });
        fetchBookings();
        setSelectedBooking(null);
      } else {
        toast({ title: "Lỗi", description: data.error, variant: "error" });
      }
    } catch (error) {
      toast({ title: "Lỗi", description: "Không thể cập nhật đơn hàng", variant: "error" });
    }
  };

  const filteredBookings = bookings.filter((booking) =>
    searchTerm
      ? booking.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.showtime.movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
          <p className="text-gray-500">Xem và quản lý tất cả đơn đặt vé</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đặt vé, tên, email, phim..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="PENDING">Đang chờ</option>
              <option value="CONFIRMED">Đã xác nhận</option>
              <option value="CANCELLED">Đã hủy</option>
              <option value="EXPIRED">Hết hạn</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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
                  Suất chiếu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
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
              ) : filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => {
                  const StatusIcon = statusConfig[booking.status]?.icon || Clock;
                  return (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm font-medium text-primary-600">
                          {booking.bookingCode}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{booking.user.name}</p>
                          <p className="text-xs text-gray-500">{booking.user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 line-clamp-1">{booking.showtime.movie.title}</p>
                        <p className="text-xs text-gray-500">{booking.showtime.room.name}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900">
                          {formatDateTime(booking.showtime.startTime)}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-gray-900">
                          {formatCurrency(booking.totalAmount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                            statusConfig[booking.status]?.class || "bg-gray-100 text-gray-700"
                          }`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig[booking.status]?.label || booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Không có đơn hàng nào
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

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Chi tiết đơn hàng</h2>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Booking Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Mã đặt vé</p>
                  <p className="font-mono font-medium text-primary-600">
                    {selectedBooking.bookingCode}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Trạng thái</p>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                      statusConfig[selectedBooking.status]?.class || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {statusConfig[selectedBooking.status]?.label || selectedBooking.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày đặt</p>
                  <p className="font-medium">{formatDateTime(selectedBooking.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hết hạn</p>
                  <p className="font-medium">{formatDateTime(selectedBooking.expiresAt)}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-900 mb-3">Thông tin khách hàng</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Tên</p>
                    <p className="font-medium">{selectedBooking.user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedBooking.user.email}</p>
                  </div>
                </div>
              </div>

              {/* Movie Info */}
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-900 mb-3">Thông tin phim</h3>
                <div className="flex gap-4">
                  {selectedBooking.showtime.movie.poster ? (
                    <img
                      src={selectedBooking.showtime.movie.poster}
                      alt={selectedBooking.showtime.movie.title}
                      className="w-16 h-24 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">
                      {selectedBooking.showtime.movie.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDateTime(selectedBooking.showtime.startTime)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedBooking.showtime.room.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Seats */}
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-900 mb-3">Ghế đã đặt</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedBooking.bookingSeats.map((bs) => (
                    <span
                      key={bs.id}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        bs.seat.type === "VIP"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {bs.seat.row}{bs.seat.number} ({formatCurrency(bs.price)})
                    </span>
                  ))}
                </div>
              </div>

              {/* Payment Info */}
              {selectedBooking.payment && (
                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-900 mb-3">Thông tin thanh toán</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Phương thức</p>
                      <p className="font-medium">{selectedBooking.payment.method}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Trạng thái thanh toán</p>
                      <p className="font-medium">{selectedBooking.payment.status}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="border-t pt-4 flex justify-between items-center">
                <span className="text-lg font-medium text-gray-900">Tổng cộng</span>
                <span className="text-2xl font-bold text-primary-600">
                  {formatCurrency(selectedBooking.totalAmount)}
                </span>
              </div>

              {/* Actions */}
              {selectedBooking.status === "PENDING" && (
                <div className="border-t pt-4 flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1 text-red-600 hover:bg-red-50"
                    onClick={() => handleUpdateStatus(selectedBooking.id, "CANCELLED")}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Hủy đơn
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => handleUpdateStatus(selectedBooking.id, "CONFIRMED")}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Xác nhận
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
