import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { z } from "zod";

export const dynamic = "force-dynamic";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = forgotPasswordSchema.parse(body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    // If user doesn't exist, return error
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Email này không tồn tại trong hệ thống" },
        { status: 404 }
      );
    }

    // Delete any existing reset tokens for this email
    await prisma.passwordReset.deleteMany({
      where: { email: validatedData.email },
    });

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Save reset token to database
    await prisma.passwordReset.create({
      data: {
        email: validatedData.email,
        token: resetToken,
        expiresAt,
      },
    });

    // In a production environment, you would send an email here
    // For now, we'll log the reset link (or return it in development)
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

    console.log("=".repeat(50));
    console.log("PASSWORD RESET REQUEST");
    console.log("=".repeat(50));
    console.log(`Email: ${validatedData.email}`);
    console.log(`Reset Link: ${resetLink}`);
    console.log("=".repeat(50));

    // In production, send email with reset link
    // await sendPasswordResetEmail(user.email, resetLink);

    // For demo purposes, we'll include the reset link in the response
    // In production, this would be sent via email instead
    return NextResponse.json({
      success: true,
      message: "Nếu email tồn tại trong hệ thống, bạn sẽ nhận được liên kết đặt lại mật khẩu.",
      resetLink,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, error: "Đã xảy ra lỗi khi xử lý yêu cầu" },
      { status: 500 }
    );
  }
}
