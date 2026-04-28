import Link from "next/link";
import { Film } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary-600 text-white p-2 rounded-lg">
                <Film className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-white">
                <span className="text-primary-400">Cinema</span>Ticket
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              Hệ thống đặt vé xem phim trực tuyến hàng đầu Việt Nam. 
              Trải nghiệm đặt vé dễ dàng, nhanh chóng và tiện lợi.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary-400 transition-colors">
                Facebook
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                Instagram
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                Youtube
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/movies" className="hover:text-primary-400 transition-colors">
                  Phim đang chiếu
                </Link>
              </li>
              <li>
                <Link href="/showtimes" className="hover:text-primary-400 transition-colors">
                  Lịch chiếu
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-primary-400 transition-colors">
                  Đăng ký tài khoản
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-primary-400 transition-colors">
                  Tài khoản của tôi
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Liên hệ</h3>
            <ul className="space-y-2 text-gray-400">
              <li>📍 123 Đường ABC, Quận 1, TP.HCM</li>
              <li>📞 1900 1234</li>
              <li>✉️ support@cinematicket.vn</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>© 2026 CinemaTicket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
