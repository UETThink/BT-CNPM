import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { generateBookingCode } from "@/lib/utils";

export const dynamic = "force-dynamic";

const createBookingSchema = z.object({
  showtimeId: z.string().min(1),
  seatIds: z.array(z.string()).min(1).max(10),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    const where: Record<string, unknown> = {};

    if (userId) {
      where.userId = userId;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { bookingCode: { contains: search } },
        { user: { name: { contains: search } } },
        { user: { email: { contains: search } } },
        { showtime: { movie: { title: { contains: search } } } },
      ];
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          showtime: {
            include: {
              movie: {
                select: {
                  id: true,
                  title: true,
                  poster: true,
                },
              },
              room: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          bookingSeats: {
            include: {
              seat: true,
            },
          },
          payment: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.booking.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items: bookings,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createBookingSchema.parse(body);

    // Get user from header (in real app, use auth)
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Check if showtime exists and is active
    const showtime = await prisma.showtime.findUnique({
      where: { id: validatedData.showtimeId },
      include: { movie: true },
    });

    if (!showtime || !showtime.isActive) {
      return NextResponse.json(
        { success: false, error: "Showtime not found or inactive" },
        { status: 404 }
      );
    }

    // Check if seats are available
    const seats = await prisma.seat.findMany({
      where: {
        id: { in: validatedData.seatIds },
        showtimeId: validatedData.showtimeId,
      },
      include: {
        bookingSeats: {
          include: {
            booking: true,
          },
        },
      },
    });

    if (seats.length !== validatedData.seatIds.length) {
      return NextResponse.json(
        { success: false, error: "Some seats not found" },
        { status: 400 }
      );
    }

    // Check if any seat is already booked
    const bookedSeats = seats.filter((seat: { bookingSeats: { booking: { status: string } }[] }) =>
      seat.bookingSeats.some((bs: { booking: { status: string } }) => bs.booking.status === "CONFIRMED")
    );

    if (bookedSeats.length > 0) {
      return NextResponse.json(
        { success: false, error: "Some seats are already booked" },
        { status: 400 }
      );
    }

    // Check for pending bookings that might be expired
    const pendingSeats = seats.filter((seat: { bookingSeats: { booking: { status: string } }[] }) =>
      seat.bookingSeats.some((bs: { booking: { status: string } }) => bs.booking.status === "PENDING")
    );

    if (pendingSeats.length > 0) {
      return NextResponse.json(
        { success: false, error: "Some seats are being held by other users" },
        { status: 400 }
      );
    }

    // Calculate total amount
    const totalAmount = seats.reduce((sum: number, seat: { price: number }) => sum + seat.price, 0);

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId,
        showtimeId: validatedData.showtimeId,
        totalAmount,
        status: "PENDING",
        bookingCode: generateBookingCode(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        bookingSeats: {
          create: seats.map((seat: { id: string; price: number }) => ({
            seatId: seat.id,
            price: seat.price,
          })),
        },
      },
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
      },
    });

    return NextResponse.json(
      { success: true, data: booking },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

