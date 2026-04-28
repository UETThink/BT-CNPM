import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const showtime = await prisma.showtime.findUnique({
      where: { id },
      include: {
        movie: true,
        room: true,
      },
    });

    if (!showtime) {
      return NextResponse.json(
        { success: false, error: "Showtime not found" },
        { status: 404 }
      );
    }

    // Get all seats with booking status
    const seats = await prisma.seat.findMany({
      where: { showtimeId: id },
      include: {
        bookingSeats: {
          include: {
            booking: true,
          },
        },
      },
      orderBy: [{ row: "asc" }, { number: "asc" }],
    });

    // Add booking status to each seat
    const seatsWithStatus = seats.map((seat: { bookingSeats: { booking: { status: string } }[] } & Record<string, unknown>) => ({
      ...seat,
      isBooked: seat.bookingSeats.some(
        (bs: { booking: { status: string } }) => bs.booking.status === "CONFIRMED" || bs.booking.status === "PENDING"
      ),
    }));

    return NextResponse.json({
      success: true,
      data: {
        ...showtime,
        seats: seatsWithStatus,
      },
    });
  } catch (error) {
    console.error("Error fetching showtime:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch showtime" },
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
    
    // Check if showtime has any confirmed bookings
    const bookings = await prisma.booking.count({
      where: {
        showtimeId: id,
        status: { in: ["CONFIRMED", "PENDING"] },
      },
    });

    if (bookings > 0) {
      return NextResponse.json(
        { success: false, error: "Cannot delete showtime with existing bookings" },
        { status: 400 }
      );
    }

    await prisma.showtime.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Showtime deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting showtime:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete showtime" },
      { status: 500 }
    );
  }
}
