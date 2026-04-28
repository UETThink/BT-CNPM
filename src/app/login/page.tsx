"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/AuthProvider";
import { toast } from "@/components/ui/toaster";
import { Film, Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const redirect = searchParams.get("redirect") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = "Email là bắt buộc";
    if (!formData.password) newErrors.password = "Mật khẩu là bắt buộc";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        login(data.data.user, data.data.token);
        toast({ title: "Đăng nhập thành công!", variant: "success" });
        router.push(redirect);
      } else {
        toast({ title: "Lỗi", description: data.error || "Đăng nhập thất bại", variant: "error" });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({ title: "Lỗi", description: "Đã xảy ra lỗi khi đăng nhập", variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
        Chào mừng trở lại!
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Đăng nhập để tiếp tục đặt vé xem phim
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email"
          type="email"
          placeholder="email@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
        />

        <div className="relative">
          <Input
            label="Mật khẩu"
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300" />
            <span className="text-gray-600">Ghi nhớ đăng nhập</span>
          </label>
          <a href="#" className="text-primary-600 hover:underline">
            Quên mật khẩu?
          </a>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Đang đăng nhập...
            </div>
          ) : (
            "Đăng nhập"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-primary-600 font-medium hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="bg-primary-600 text-white p-2 rounded-lg">
              <Film className="h-8 w-8" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              <span className="text-primary-600">Cinema</span>Ticket
            </span>
          </Link>
        </div>

        <Suspense fallback={<div className="bg-white rounded-2xl shadow-lg p-8 text-center">Loading...</div>}>
          <LoginForm />
        </Suspense>

        {/* Demo Account */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 font-medium mb-2">Tài khoản demo:</p>
          <p className="text-sm text-blue-600">Email: admin@cinema.com</p>
          <p className="text-sm text-blue-600">Mật khẩu: admin123</p>
        </div>
      </div>
    </div>
  );
}
