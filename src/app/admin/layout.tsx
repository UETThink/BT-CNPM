"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Film,
  Building,
  CalendarClock,
  Ticket,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";

const adminNav = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Phim", href: "/admin/movies", icon: Film },
  { name: "Phòng chiếu", href: "/admin/rooms", icon: Building },
  { name: "Suất chiếu", href: "/admin/showtimes", icon: CalendarClock },
  { name: "Đơn hàng", href: "/admin/bookings", icon: Ticket },
  { name: "Người dùng", href: "/admin/users", icon: Users },
  { name: "Báo cáo", href: "/admin/reports", icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "ADMIN")) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-40 h-16">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Link href="/admin" className="flex items-center gap-2">
              <div className="bg-primary-600 text-white p-2 rounded-lg">
                <Film className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-gray-900 hidden sm:block">
                <span className="text-primary-600">Admin</span> Panel
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-gray-600 hover:text-primary-600">
              Xem website
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-medium text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                {user.name}
              </span>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Đăng xuất"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-white shadow-lg transform transition-transform lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } z-30`}
      >
        <nav className="p-4 space-y-1">
          {adminNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft className="h-4 w-4" />
            Quay về website
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="pt-16 lg:pl-64 min-h-screen">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
