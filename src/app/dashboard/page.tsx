"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";
import { toast } from "@/components/ui/toaster";
import {
  User,
  Ticket,
  History,
  Settings,
  LogOut,
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

interface BookingData {
  id: string;
  bookingCode: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  showtime: {
    startTime: string;
    movie: {
      title: string;
      poster: string | null;
    };
    room: {
      name: string;
    };
  };
  bookingSeats: {
    seat: {
      row: string;
      number: number;
    };
  }[];
}

type TabType = "upcoming" | "history" | "profile";

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/dashboard");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;

    try {
      const res = await fetch(`/api/bookings?userId=${user.id}`, {
        headers: { "x-user-id": user.id },
      });
      const data = await res.json();
      if (data.success) {
        setBookings(data.data.items);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!user) return;

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({ action: "cancel" }),
      });

      const data = await res.json();
      if (data.success) {
        toast({ title: "Hủy đặt vé thành công", variant: "success" });
        fetchBookings();
      } else {
        toast({ title: "Lỗi", description: data.error, variant: "error" });
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast({ title: "Lỗi", description: "Không thể hủy đặt vé", variant: "error" });
    }
  };

  const now = new Date();
  const upcomingBookings = bookings.filter(
    (b) => b.status === "CONFIRMED" && new Date(b.showtime.startTime) > now
  );
  const pastBookings = bookings.filter(
    (b) => b.status !== "CONFIRMED" || new Date(b.showtime.startTime) <= now
  );

  const statusConfig: Record<string, { label: string; class: string }> = {
    CONFIRMED: { label: "Đã xác nhận", class: "bg-green-100 text-green-700" },
    PENDING: { label: "Đang chờ", class: "bg-yellow-100 text-yellow-700" },
    CANCELLED: { label: "Đã hủy", class: "bg-red-100 text-red-700" },
    EXPIRED: { label: "Hết hạn", class: "bg-gray-100 text-gray-700" },
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6">
                {/* User Info */}
                <div className="text-center mb-6 pb-6 border-b">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-10 w-10 text-primary-600" />
                  </div>
                  <h2 className="font-bold text-gray-900">{user.name}</h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab("upcoming")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === "upcoming"
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Ticket className="h-5 w-5" />
                    <span className="flex-1 text-left">Vé sắp tới</span>
                    {upcomingBookings.length > 0 && (
                      <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                        {upcomingBookings.length}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab("history")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === "history"
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <History className="h-5 w-5" />
                    <span className="flex-1 text-left">Lịch sử đặt vé</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === "profile"
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Settings className="h-5 w-5" />
                    <span className="flex-1 text-left">Cài đặt tài khoản</span>
                  </button>
                </nav>

                <div className="mt-6 pt-6 border-t">
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm p-6">
                {/* Upcoming Bookings */}
                {activeTab === "upcoming" && (
                  <>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Vé sắp tới</h2>

                    {isLoading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="bg-gray-100 rounded-lg h-32 animate-pulse" />
                        ))}
                      </div>
                    ) : upcomingBookings.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingBookings.map((booking) => (
                          <div
                            key={booking.id}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex gap-4">
                              {booking.showtime.movie.poster ? (
                                <img
                                  src={booking.showtime.movie.poster}
                                  alt={booking.showtime.movie.title}
                                  className="w-20 h-28 object-cover rounded-lg"
                                />
                              ) : (
                                <div className="w-20 h-28 bg-gray-200 rounded-lg flex items-center justify-center">
                                  <Ticket className="h-8 w-8 text-gray-400" />
                                </div>
                              )}

                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h3 className="font-semibold text-gray-900">
                                      {booking.showtime.movie.title}
                                    </h3>
                                    <span className={`text-xs px-2 py-1 rounded-full ${statusConfig[booking.status].class}`}>
                                      {statusConfig[booking.status].label}
                                    </span>
                                  </div>
                                  <span className="font-bold text-primary-600">
                                    {formatCurrency(booking.totalAmount)}
                                  </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {formatDateTime(booking.showtime.startTime).split(",")[0]}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {formatDateTime(booking.showtime.startTime).split(",")[1]}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {booking.showtime.room.name}
                                  </div>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                  <div className="flex gap-2">
                                    <span className="text-sm text-gray-500">
                                      Ghế:{" "}
                                      {booking.bookingSeats.map((bs) => `${bs.seat.row}${bs.seat.number}`).join(", ")}
                                    </span>
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                      {booking.bookingCode}
                                    </span>
                                  </div>

                                  <div className="flex gap-2">
                                    <Link href={`/booking/confirmation/${booking.id}`}>
                                      <Button size="sm" variant="outline">
                                        Xem vé
                                      </Button>
                                    </Link>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-red-600 hover:bg-red-50"
                                      onClick={() => handleCancelBooking(booking.id)}
                                    >
                                      Hủy
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Ticket className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Chưa có vé nào
                        </h3>
                        <p className="text-gray-500 mb-4">
                          Bạn chưa có vé xem phim nào sắp tới.
                        </p>
                        <Link href="/movies">
                          <Button>Đặt vé ngay</Button>
                        </Link>
                      </div>
                    )}
                  </>
                )}

                {/* History */}
                {activeTab === "history" && (
                  <>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Lịch sử đặt vé</h2>

                    {isLoading ? (
                      <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="bg-gray-100 rounded-lg h-24 animate-pulse" />
                        ))}
                      </div>
                    ) : pastBookings.length > 0 ? (
                      <div className="space-y-4">
                        {pastBookings.map((booking) => (
                          <div
                            key={booking.id}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow opacity-75"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div>
                                  <h3 className="font-semibold text-gray-900">
                                    {booking.showtime.movie.title}
                                  </h3>
                                  <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                    <span>{formatDateTime(booking.showtime.startTime)}</span>
                                    <span>-</span>
                                    <span>{booking.showtime.room.name}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className={`text-xs px-2 py-1 rounded-full ${statusConfig[booking.status].class}`}>
                                  {statusConfig[booking.status].label}
                                </span>
                                <span className="font-medium text-gray-900">
                                  {formatCurrency(booking.totalAmount)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <History className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Chưa có lịch sử
                        </h3>
                        <p className="text-gray-500">
                          Bạn chưa có đơn đặt vé nào trước đó.
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* Profile Settings */}
                {activeTab === "profile" && (
                  <>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Cài đặt tài khoản</h2>

                    <form className="space-y-6 max-w-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Họ và tên
                        </label>
                        <input
                          type="text"
                          defaultValue={user.name}
                          className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          defaultValue={user.email}
                          disabled
                          className="w-full h-10 px-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số điện thoại
                        </label>
                        <input
                          type="tel"
                          placeholder="Nhập số điện thoại"
                          className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div className="pt-4 border-t">
                        <h3 className="font-medium text-gray-900 mb-4">Đổi mật khẩu</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Mật khẩu hiện tại
                            </label>
                            <input
                              type="password"
                              className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Mật khẩu mới
                            </label>
                            <input
                              type="password"
                              className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Xác nhận mật khẩu mới
                            </label>
                            <input
                              type="password"
                              className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                        </div>
                      </div>

                      <Button type="submit" className="w-full">
                        Lưu thay đổi
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
