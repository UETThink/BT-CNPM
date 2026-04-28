"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { formatCurrency, cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";
import { toast } from "@/components/ui/toaster";
import { Ticket, Clock, Calendar, MapPin, ArrowLeft, ShoppingCart } from "lucide-react";

interface SeatData {
  id: string;
  row: string;
  number: number;
  type: string;
  price: number;
  isBooked: boolean;
}

interface ShowtimeData {
  id: string;
  startTime: string;
  price: number;
  movie: {
    id: string;
    title: string;
    poster: string | null;
    duration: number;
  };
  room: {
    id: string;
    name: string;
    roomType: string;
    rows: number;
    seatsPerRow: number;
  };
  seats: SeatData[];
}

export default function BookingPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { user, token } = useAuth();
  const [showtime, setShowtime] = useState<ShowtimeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState<SeatData[]>([]);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    fetchShowtime();
  }, []);

  const fetchShowtime = async () => {
    try {
      const res = await fetch(`/api/showtimes/${id}`);
      const data = await res.json();
      if (data.success) {
        setShowtime(data.data);
      }
    } catch (error) {
      console.error("Error fetching showtime:", error);
      toast({ title: "Lỗi", description: "Không thể tải thông tin suất chiếu", variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSeat = (seat: SeatData) => {
    if (seat.isBooked) {
      toast({ title: "Ghế đã được đặt", description: "Vui lòng chọn ghế khác", variant: "warning" });
      return;
    }

    if (selectedSeats.length >= 10 && !selectedSeats.find(s => s.id === seat.id)) {
      toast({ title: "Giới hạn ghế", description: "Bạn chỉ có thể đặt tối đa 10 ghế", variant: "warning" });
      return;
    }

    setSelectedSeats(prev => 
      prev.find(s => s.id === seat.id)
        ? prev.filter(s => s.id !== seat.id)
        : [...prev, seat]
    );
  };

  const getSeatClass = (seat: SeatData) => {
    const isSelected = selectedSeats.find(s => s.id === seat.id);
    if (isSelected) return "seat-selected";
    if (seat.isBooked) return "seat-booked";
    if (seat.type === "VIP") return "seat-vip";
    return "seat-available";
  };

  const handleBooking = async () => {
    if (!user || !token) {
      router.push(`/login?redirect=/booking/${id}`);
      return;
    }

    if (selectedSeats.length === 0) {
      toast({ title: "Chưa chọn ghế", description: "Vui lòng chọn ít nhất 1 ghế", variant: "warning" });
      return;
    }

    setIsBooking(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({
          showtimeId: id,
          seatIds: selectedSeats.map(s => s.id),
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push(`/checkout/${data.data.id}`);
      } else {
        toast({ title: "Lỗi", description: data.error || "Không thể tạo đơn đặt vé", variant: "error" });
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({ title: "Lỗi", description: "Đã xảy ra lỗi khi đặt vé", variant: "error" });
    } finally {
      setIsBooking(false);
    }
  };

  const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải thông tin suất chiếu...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!showtime) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy suất chiếu</h2>
            <Link href="/movies">
              <Button>Quay lại danh sách phim</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const rows = [...new Set(showtime.seats.map(s => s.row))].sort();
  const seatsByRow: Record<string, SeatData[]> = {};
  rows.forEach(row => {
    seatsByRow[row] = showtime.seats.filter(s => s.row === row).sort((a, b) => a.number - b.number);
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8 bg-gradient-to-b from-gray-100 to-gray-50">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link
            href={`/movies/${showtime.movie.id}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            Quay lại trang phim
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Seat Selection */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Chọn ghế ngồi</h2>

                {/* Screen */}
                <div className="relative mb-10">
                  <div className="absolute inset-x-0 top-1/2 h-16 -translate-y-1/2 bg-gradient-to-b from-gray-300 to-gray-200 rounded-t-full opacity-80" />
                  <div className="relative h-6 flex items-center justify-center">
                    <span className="text-xs text-gray-500 font-bold tracking-widest bg-white/80 px-4 py-1 rounded-full shadow-sm">MÀN HÌNH</span>
                  </div>
                </div>

                {/* Seats */}
                <div className="space-y-4">
                  {rows.map(row => (
                    <div key={row} className="flex items-center gap-3">
                      <span className="w-8 text-center text-base font-bold text-gray-400">{row}</span>
                      <div className="flex gap-2 flex-1 justify-center">
                        {seatsByRow[row].map(seat => (
                          <button
                            key={seat.id}
                            onClick={() => toggleSeat(seat)}
                            disabled={seat.isBooked}
                            className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold transition-all duration-200 transform hover:scale-110",
                              getSeatClass(seat)
                            )}
                            title={`Hàng ${seat.row}, Ghế ${seat.number} - ${formatCurrency(seat.price)}`}
                          >
                            {seat.number}
                          </button>
                        ))}
                      </div>
                      <span className="w-8 text-center text-base font-bold text-gray-400">{row}</span>
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-6 mt-10 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 border-2 border-primary-300"></div>
                    <span className="text-sm text-gray-600 font-medium">Ghế thường</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary-100 border-2 border-secondary-400"></div>
                    <span className="text-sm text-gray-600 font-medium">Ghế VIP</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-600 text-white flex items-center justify-center font-bold">✓</div>
                    <span className="text-sm text-gray-600 font-medium">Đang chọn</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-300 opacity-60"></div>
                    <span className="text-sm text-gray-600 font-medium">Đã đặt</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Ticket className="h-5 w-5 text-primary-600" />
                  Thông tin đặt vé
                </h2>

                {/* Movie Info */}
                <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
                  {showtime.movie.poster ? (
                    <img
                      src={showtime.movie.poster}
                      alt={showtime.movie.title}
                      className="w-20 h-28 object-cover rounded-lg shadow-sm"
                    />
                  ) : (
                    <div className="w-20 h-28 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Ticket className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">{showtime.movie.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                      <Clock className="h-4 w-4" />
                      {new Date(showtime.startTime).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(showtime.startTime).toLocaleDateString("vi-VN")}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <MapPin className="h-4 w-4" />
                      {showtime.room.name}
                    </div>
                  </div>
                </div>

                {/* Selected Seats */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Ghế đã chọn</h4>
                  {selectedSeats.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedSeats.map(seat => (
                        <span
                          key={seat.id}
                          className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium border border-primary-200"
                        >
                          {seat.row}{seat.number}
                          {seat.type === "VIP" && <span className="ml-1 text-secondary-600">★</span>}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">Chưa chọn ghế nào</p>
                  )}
                </div>

                {/* Price Breakdown */}
                {selectedSeats.length > 0 && (
                  <div className="space-y-2 mb-6 pb-6 border-b border-gray-100">
                    {selectedSeats.map(seat => (
                      <div key={seat.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">Ghế {seat.row}{seat.number} ({seat.type === "VIP" ? "VIP" : "Thường"})</span>
                        <span className="text-gray-900 font-medium">{formatCurrency(seat.price)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Total */}
                <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-primary-50 to-secondary-50 p-4 rounded-lg">
                  <span className="text-lg font-semibold text-gray-900">Tổng cộng</span>
                  <span className="text-2xl font-bold text-primary-600">{formatCurrency(totalAmount)}</span>
                </div>

                {/* Book Button */}
                <Button
                  className="w-full gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
                  size="lg"
                  onClick={handleBooking}
                  disabled={selectedSeats.length === 0 || isBooking}
                >
                  {isBooking ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5" />
                      Đặt vé ngay
                    </>
                  )}
                </Button>

                {!user && (
                  <p className="text-xs text-center text-gray-500 mt-4">
                    Bạn cần <Link href="/login" className="text-primary-600 hover:underline font-medium">đăng nhập</Link> để đặt vé
                  </p>
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
