import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const dynamic = "force-dynamic";

const resetPasswordSchema = z.object({
  token: z.string().min(1, { message: "Token không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = resetPasswordSchema.parse(body);

    // Find valid reset token
    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token: validatedData.token },
    });

    if (!resetRecord) {
      return NextResponse.json(
        { success: false, error: "Liên kết đặt lại mật khẩu không hợp lệ" },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (new Date() > resetRecord.expiresAt) {
      // Delete expired token
      await prisma.passwordReset.delete({
        where: { id: resetRecord.id },
      });
      return NextResponse.json(
        { success: false, error: "Liên kết đặt lại mật khẩu đã hết hạn" },
        { status: 400 }
      );
    }

    // Check if token was already used
    if (resetRecord.used) {
      return NextResponse.json(
        { success: false, error: "Liên kết đặt lại mật khẩu đã được sử dụng" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: resetRecord.email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Update user's password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Mark reset token as used
    await prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { used: true },
    });

    // Optionally delete all reset tokens for this user
    await prisma.passwordReset.deleteMany({
      where: { email: resetRecord.email },
    });

    return NextResponse.json({
      success: true,
      message: "Mật khẩu đã được đặt lại thành công. Bạn có thể đăng nhập ngay.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Reset password error:", error);
    return NextResponse.json(
      { success: false, error: "Đã xảy ra lỗi khi đặt lại mật khẩu" },
      { status: 500 }
    );
  }
}
