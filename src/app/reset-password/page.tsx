"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toaster";
import { Film, Eye, EyeOff, CheckCircle, ArrowLeft } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  // If no token, show error
  if (!token) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">!</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Liên kết không hợp lệ
        </h1>
        <p className="text-gray-600 mb-6">
          Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
        </p>
        <Link
          href="/forgot-password"
          className="inline-flex items-center gap-2 text-primary-600 hover:underline font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Yêu cầu liên kết mới
        </Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Đặt lại mật khẩu thành công!
        </h1>
        <p className="text-gray-600 mb-6">
          Mật khẩu của bạn đã được đặt lại. Bây giờ bạn có thể đăng nhập với mật khẩu mới.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};

    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsSuccess(true);
        toast({
          title: "Thành công!",
          description: "Mật khẩu đã được đặt lại",
          variant: "success",
        });
      } else {
        toast({
          title: "Lỗi",
          description: data.error || "Đã xảy ra lỗi",
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi đặt lại mật khẩu",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
        Đặt lại mật khẩu
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Nhập mật khẩu mới cho tài khoản của bạn
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <Input
            label="Mật khẩu mới"
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

        <div className="relative">
          <Input
            label="Xác nhận mật khẩu mới"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Nhập lại mật khẩu mới"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            error={errors.confirmPassword}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Đang xử lý...
            </div>
          ) : (
            "Đặt lại mật khẩu"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
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
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
