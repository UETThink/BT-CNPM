"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";
import { toast } from "@/components/ui/toaster";
import {
  CreditCard,
  Smartphone,
  Wallet,
  CheckCircle,
  Clock,
  Ticket,
  Calendar,
  MapPin,
} from "lucide-react";

interface BookingData {
  id: string;
  bookingCode: string;
  totalAmount: number;
  status: string;
  expiresAt: string;
  showtime: {
    startTime: string;
    movie: {
      id: string;
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
  payment?: {
    status: string;
    method: string;
  };
}

const paymentMethods = [
  { id: "CREDIT_CARD", name: "Thẻ tín dụng/ghi nợ", icon: CreditCard, description: "Visa, Mastercard, JCB" },
  { id: "MOMO", name: "Ví MoMo", icon: Smartphone, description: "Thanh toán qua ví MoMo" },
  { id: "ZALO_PAY", name: "ZaloPay", icon: Smartphone, description: "Thanh toán qua ZaloPay" },
  { id: "VNPAY", name: "VNPay", icon: Wallet, description: "Thanh toán qua VNPay" },
  { id: "CASH", name: "Tiền mặt", icon: Wallet, description: "Thanh toán trực tiếp tại quầy" },
];

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { user, token } = useAuth();
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>("CREDIT_CARD");
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    fetchBooking();
  }, []);

  useEffect(() => {
    if (!booking) return;

    const expiresAt = new Date(booking.expiresAt).getTime();
    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
      setTimeLeft(remaining);

      if (remaining === 0) {
        toast({ title: "Đơn hàng đã hết hạn", description: "Vui lòng đặt lại vé", variant: "error" });
        router.push("/movies");
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [booking]);

  const fetchBooking = async () => {
    try {
      const res = await fetch(`/api/bookings/${id}`);
      const data = await res.json();
      if (data.success) {
        setBooking(data.data);
      } else {
        toast({ title: "Lỗi", description: data.error || "Không tìm thấy đơn đặt vé", variant: "error" });
        router.push("/movies");
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
      toast({ title: "Lỗi", description: "Đã xảy ra lỗi khi tải đơn hàng", variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!user || !token) {
      router.push("/login");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({
          bookingId: id,
          method: selectedMethod,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast({ title: "Thanh toán thành công!", description: "Vé của bạn đã được xác nhận", variant: "success" });
        router.push(`/booking/confirmation/${data.data.id}`);
      } else {
        toast({ title: "Lỗi thanh toán", description: data.error || "Đã xảy ra lỗi", variant: "error" });
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast({ title: "Lỗi", description: "Đã xảy ra lỗi khi xử lý thanh toán", variant: "error" });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
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

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy đơn đặt vé</h2>
            <Link href="/movies">
              <Button>Quay lại</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (booking.status === "CONFIRMED") {
    router.push(`/booking/confirmation/${booking.id}`);
    return null;
  }

  const seats = booking.bookingSeats.map(bs => `${bs.seat.row}${bs.seat.number}`).join(", ");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Payment Methods */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Phương thức thanh toán</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Vui lòng chọn phương thức thanh toán phù hợp
                </p>

                {/* Timer */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="text-sm text-amber-800">Thời gian còn lại để thanh toán</p>
                      <p className="text-xl font-bold text-amber-600">{formatTime(timeLeft)}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Options */}
                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <label
                        key={method.id}
                        className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedMethod === method.id
                            ? "border-primary-500 bg-primary-50"
                            : "border-gray-200 hover:border-primary-300 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={selectedMethod === method.id}
                          onChange={(e) => setSelectedMethod(e.target.value)}
                          className="sr-only"
                        />
                        <div className={`p-2 rounded-lg ${
                          selectedMethod === method.id ? "bg-primary-100" : "bg-gray-100"
                        }`}>
                          <Icon className={`h-6 w-6 ${
                            selectedMethod === method.id ? "text-primary-600" : "text-gray-600"
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{method.name}</p>
                          <p className="text-sm text-gray-500">{method.description}</p>
                        </div>
                        {selectedMethod === method.id && (
                          <CheckCircle className="h-5 w-5 text-primary-600" />
                        )}
                      </label>
                    );
                  })}
                </div>

                {/* Pay Button */}
                <Button
                  className="w-full mt-6"
                  size="lg"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Đang xử lý thanh toán...
                    </>
                  ) : (
                    `Thanh toán ${formatCurrency(booking.totalAmount)}`
                  )}
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Thông tin đơn hàng</h2>

                {/* Movie Info */}
                <div className="flex gap-4 mb-6 pb-6 border-b">
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
                  <div>
                    <h3 className="font-semibold text-gray-900">{booking.showtime.movie.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(booking.showtime.startTime).toLocaleDateString("vi-VN")}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Clock className="h-4 w-4" />
                      {new Date(booking.showtime.startTime).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <MapPin className="h-4 w-4" />
                      {booking.showtime.room.name}
                    </div>
                  </div>
                </div>

                {/* Booking Info */}
                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã đặt vé</span>
                    <span className="font-mono font-medium">{booking.bookingCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ghế</span>
                    <span className="font-medium">{seats}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Tổng cộng</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatCurrency(booking.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
