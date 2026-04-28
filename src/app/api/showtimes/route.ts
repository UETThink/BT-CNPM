import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const createShowtimeSchema = z.object({
  movieId: z.string().min(1),
  roomId: z.string().min(1),
  startTime: z.string().transform((s) => new Date(s)),
  price: z.number().positive(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get("movieId");
    const roomId = searchParams.get("roomId");
    const date = searchParams.get("date");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");

    const where: Record<string, unknown> = { isActive: true };

    if (movieId) {
      where.movieId = movieId;
    }

    if (roomId) {
      where.roomId = roomId;
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      where.startTime = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    const [showtimes, total] = await Promise.all([
      prisma.showtime.findMany({
        where,
        include: {
          movie: {
            select: {
              id: true,
              title: true,
              poster: true,
              duration: true,
            },
          },
          room: {
            select: {
              id: true,
              name: true,
              roomType: true,
            },
          },
        },
        orderBy: { startTime: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.showtime.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items: showtimes,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching showtimes:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch showtimes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createShowtimeSchema.parse(body);

    // Get movie duration to calculate end time
    const movie = await prisma.movie.findUnique({
      where: { id: validatedData.movieId },
      select: { duration: true },
    });

    if (!movie) {
      return NextResponse.json(
        { success: false, error: "Movie not found" },
        { status: 404 }
      );
    }

    const endTime = new Date(
      validatedData.startTime.getTime() + movie.duration * 60 * 1000
    );

    const showtime = await prisma.showtime.create({
      data: {
        ...validatedData,
        endTime,
      },
      include: {
        movie: true,
        room: true,
      },
    });

    // Create seats for this showtime
    const room = await prisma.room.findUnique({
      where: { id: validatedData.roomId },
    });

    if (room) {
      const seats = [];
      for (let row = 0; row < room.rows; row++) {
        const rowLetter = String.fromCharCode(65 + row);
        const seatType = row >= room.rows - 2 ? "VIP" : "STANDARD";
        const seatPrice =
          seatType === "VIP"
            ? validatedData.price * 1.5
            : validatedData.price;

        for (let num = 1; num <= room.seatsPerRow; num++) {
          seats.push({
            showtimeId: showtime.id,
            row: rowLetter,
            number: num,
            type: seatType,
            price: seatPrice,
          });
        }
      }

      await prisma.seat.createMany({ data: seats });
    }

    return NextResponse.json(
      { success: true, data: showtime },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating showtime:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create showtime" },
      { status: 500 }
    );
  }
}

