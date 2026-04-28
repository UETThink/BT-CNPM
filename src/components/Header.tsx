"use client";

import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Film, User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary-600 text-white p-2 rounded-lg">
              <Film className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              <span className="text-primary-600">Cinema</span>Ticket
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              Trang chủ
            </Link>
            <Link
              href="/movies"
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              Phim
            </Link>
            <Link
              href="/showtimes"
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              Lịch chiếu
            </Link>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    {user.name}
                  </Button>
                </Link>
                {user.role === "ADMIN" && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm">
                      Quản trị
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Đăng xuất
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Đăng ký</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-3">
              <Link
                href="/"
                className="text-gray-600 hover:text-primary-600 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Trang chủ
              </Link>
              <Link
                href="/movies"
                className="text-gray-600 hover:text-primary-600 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Phim
              </Link>
              <Link
                href="/showtimes"
                className="text-gray-600 hover:text-primary-600 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Lịch chiếu
              </Link>
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-600 hover:text-primary-600 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Tài khoản: {user.name}
                  </Link>
                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="text-gray-600 hover:text-primary-600 font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Quản trị
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left text-gray-600 hover:text-primary-600 font-medium py-2"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-primary-600 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/register"
                    className="text-gray-600 hover:text-primary-600 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
