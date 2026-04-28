"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toaster";
import { Film, Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [resetLink, setResetLink] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!email) {
      setErrors({ email: "Email là bắt buộc" });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: "Email không hợp lệ" });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setIsSuccess(true);
        // Store reset link
        if (data.resetLink) {
          setResetLink(data.resetLink);
        }
        toast({
          title: "Gửi thành công!",
          description: "Kiểm tra email để đặt lại mật khẩu",
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
      console.error("Forgot password error:", error);
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi gửi yêu cầu",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
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

          {/* Success Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Kiểm tra email của bạn!
            </h1>
            <p className="text-gray-600 mb-6">
              Chúng tôi đã gửi liên kết đặt lại mật khẩu đến email{" "}
              <span className="font-medium text-gray-900">{email}</span>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Nếu không thấy email, hãy kiểm tra thư mục spam hoặc thử lại sau vài phút.
            </p>

            {/* Reset link for demo */}
            {resetLink && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-left">
                <p className="text-sm font-medium text-yellow-800 mb-2">
                  Link đặt lại mật khẩu (Demo):
                </p>
                <a
                  href={resetLink}
                  className="text-sm text-blue-600 hover:underline break-all"
                >
                  {resetLink}
                </a>
              </div>
            )}

            <div className="mt-6">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-primary-600 hover:underline font-medium"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay lại đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Quên mật khẩu?
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Nhập email của bạn để nhận liên kết đặt lại mật khẩu
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
              <Input
                label="Email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                className="pl-10"
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Đang gửi...
                </div>
              ) : (
                "Gửi liên kết đặt lại"
              )}
            </Button>
          </form>

          <div className="mt-6">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
