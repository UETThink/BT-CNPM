"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  CheckCircle,
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Download,
  Printer,
  Home,
} from "lucide-react";

interface BookingData {
  id: string;
  bookingCode: string;
  totalAmount: number;
  status: string;
  qrCode: string | null;
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

export default function ConfirmationPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBooking();
  }, []);

  const fetchBooking = async () => {
    try {
      const res = await fetch(`/api/bookings/${id}`);
      const data = await res.json();
      if (data.success) {
        setBooking(data.data);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadQR = () => {
    if (!booking?.qrCode) return;
    
    const link = document.createElement("a");
    link.href = booking.qrCode;
    link.download = `ticket-${booking.bookingCode}.png`;
    link.click();
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
    return null;
  }

  const seats = booking.bookingSeats.map(bs => `${bs.seat.row}${bs.seat.number}`).join(", ");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Success Message */}
          <div className="bg-white rounded-xl shadow-sm p-8 text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Đặt vé thành công!</h1>
            <p className="text-gray-600">
              Cảm ơn bạn đã đặt vé tại CinemaTicket. Chúc bạn có những trải nghiệm xem phim tuyệt vời!
            </p>
          </div>

          {/* Ticket */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8" id="ticket">
            {/* Ticket Header */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Ticket className="h-8 w-8" />
                  <span className="text-xl font-bold">CinemaTicket</span>
                </div>
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                  {booking.bookingCode}
                </span>
              </div>
            </div>

            {/* Ticket Content */}
            <div className="p-6">
              <div className="flex gap-6 mb-6">
                {booking.showtime.movie.poster ? (
                  <img
                    src={booking.showtime.movie.poster}
                    alt={booking.showtime.movie.title}
                    className="w-24 h-36 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-24 h-36 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Ticket className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    {booking.showtime.movie.title}
                  </h2>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDateTime(booking.showtime.startTime).split(",")[0]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{formatDateTime(booking.showtime.startTime).split(",")[1]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{booking.showtime.room.name}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-dashed border-gray-300 my-6"></div>

              {/* Ticket Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Ghế</p>
                  <p className="text-lg font-bold text-gray-900">{seats}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Tổng cộng</p>
                  <p className="text-lg font-bold text-primary-600">{formatCurrency(booking.totalAmount)}</p>
                </div>
              </div>

              {/* QR Code */}
              {booking.qrCode && (
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-500 mb-4">Quét mã QR để check-in</p>
                  <img
                    src={booking.qrCode}
                    alt="QR Code"
                    className="w-48 h-48 border-2 border-gray-200 rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Ticket Footer */}
            <div className="bg-gray-50 px-6 py-4 text-center">
              <p className="text-sm text-gray-500">
                Vui lòng đến trước 15 phút. Vé đã thanh toán không hoàn tiền.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="outline" className="gap-2" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
              In vé
            </Button>
            {booking.qrCode && (
              <Button variant="outline" className="gap-2" onClick={handleDownloadQR}>
                <Download className="h-4 w-4" />
                Tải QR Code
              </Button>
            )}
            <Link href="/">
              <Button className="gap-2">
                <Home className="h-4 w-4" />
                Trang chủ
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
