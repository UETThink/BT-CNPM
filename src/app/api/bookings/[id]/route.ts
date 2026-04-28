import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const booking = await prisma.booking.findUnique({
      where: { id },
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

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action } = body;

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    if (action === "cancel") {
      // Check if cancellation is allowed (2 hours before showtime)
      const showtime = await prisma.showtime.findUnique({
        where: { id: booking.showtimeId },
      });

      if (!showtime) {
        return NextResponse.json(
          { success: false, error: "Showtime not found" },
          { status: 404 }
        );
      }

      const hoursUntilShow = (showtime.startTime.getTime() - Date.now()) / (1000 * 60 * 60);
      if (hoursUntilShow < 2) {
        return NextResponse.json(
          { success: false, error: "Cannot cancel booking less than 2 hours before showtime" },
          { status: 400 }
        );
      }

      await prisma.booking.update({
        where: { id },
        data: { status: "CANCELLED" },
      });

      return NextResponse.json({
        success: true,
        message: "Booking cancelled successfully",
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    // Only allow deletion of cancelled or expired bookings
    if (!["CANCELLED", "EXPIRED"].includes(booking.status)) {
      return NextResponse.json(
        { success: false, error: "Only cancelled or expired bookings can be deleted" },
        { status: 400 }
      );
    }

    await prisma.booking.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}
