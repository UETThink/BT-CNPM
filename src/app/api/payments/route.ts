import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import QRCode from "qrcode";

export const dynamic = "force-dynamic";

const paymentSchema = z.object({
  bookingId: z.string().min(1),
  method: z.enum(["CREDIT_CARD", "MOMO", "ZALO_PAY", "VNPAY", "CASH"]),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = paymentSchema.parse(body);

    // Get booking
    const booking = await prisma.booking.findUnique({
      where: { id: validatedData.bookingId },
      include: {
        showtime: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    // Check if booking is still pending
    if (booking.status !== "PENDING") {
      return NextResponse.json(
        { success: false, error: "Booking is not pending" },
        { status: 400 }
      );
    }

    // Check if booking has expired
    if (new Date() > booking.expiresAt) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: "EXPIRED" },
      });

      return NextResponse.json(
        { success: false, error: "Booking has expired" },
        { status: 400 }
      );
    }

    // Simulate payment processing
    // In real app, integrate with payment gateway
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: booking.totalAmount,
        method: validatedData.method,
        status: "SUCCESS",
        transactionId,
        paidAt: new Date(),
      },
    });

    // Generate QR code for ticket
    const qrData = JSON.stringify({
      bookingCode: booking.bookingCode,
      movie: booking.showtime.movieId,
      showtime: booking.showtimeId,
      transaction: transactionId,
    });
    const qrCode = await QRCode.toDataURL(qrData);

    // Update booking status and add QR code
    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: "CONFIRMED",
        paymentId: payment.id,
        qrCode,
      },
    });

    const updatedBooking = await prisma.booking.findUnique({
      where: { id: booking.id },
      include: {
        showtime: {
          include: {
            movie: true,
            room: true,
          },
        },
        bookingSeats: {
          include: {
            seat: true,
          },
        },
        payment: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedBooking,
      message: "Payment successful",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors },
        { status: 400 }
      );
    }
    console.error("Error processing payment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process payment" },
      { status: 500 }
    );
  }
}

