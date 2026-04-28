"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/AuthProvider";
import { toast } from "@/components/ui/toaster";
import { Film, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Họ tên là bắt buộc";
    if (!formData.email) newErrors.email = "Email là bắt buộc";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email không hợp lệ";
    if (!formData.password) newErrors.password = "Mật khẩu là bắt buộc";
    else if (formData.password.length < 6) newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Auto login after registration
        const loginRes = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const loginData = await loginRes.json();

        if (loginData.success) {
          login(loginData.data.user, loginData.data.token);
          toast({ title: "Đăng ký thành công!", variant: "success" });
          router.push("/");
        } else {
          toast({ title: "Đăng ký thành công", description: "Vui lòng đăng nhập", variant: "success" });
          router.push("/login");
        }
      } else {
        toast({ title: "Lỗi", description: data.error || "Đăng ký thất bại", variant: "error" });
      }
    } catch (error) {
      console.error("Register error:", error);
      toast({ title: "Lỗi", description: "Đã xảy ra lỗi khi đăng ký", variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

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

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Tạo tài khoản mới
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Đăng ký để đặt vé xem phim dễ dàng hơn
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Họ và tên"
              type="text"
              placeholder="Nguyễn Văn A"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
            />

            <Input
              label="Email"
              type="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
            />

            <Input
              label="Số điện thoại (tùy chọn)"
              type="tel"
              placeholder="0901234567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              error={errors.phone}
            />

            <div className="relative">
              <Input
                label="Mật khẩu"
                type={showPassword ? "text" : "password"}
                placeholder="Ít nhất 6 ký tự"
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

            <Input
              label="Xác nhận mật khẩu"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
            />

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 rounded border-gray-300"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                Tôi đồng ý với{" "}
                <a href="#" className="text-primary-600 hover:underline">
                  Điều khoản sử dụng
                </a>{" "}
                và{" "}
                <a href="#" className="text-primary-600 hover:underline">
                  Chính sách bảo mật
                </a>
              </label>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Đang đăng ký...
                </div>
              ) : (
                "Đăng ký"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Đã có tài khoản?{" "}
              <Link href="/login" className="text-primary-600 font-medium hover:underline">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
