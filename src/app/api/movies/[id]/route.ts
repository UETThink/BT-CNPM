import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { searchMoviePoster } from "@/lib/tmdb";

export const dynamic = "force-dynamic";

const updateMovieSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  poster: z.string().url().optional().nullable(),
  trailer: z.string().url().optional().nullable(),
  description: z.string().optional().nullable(),
  director: z.string().optional().nullable(),
  cast: z.string().optional().nullable(),
  genre: z.string().optional(),
  duration: z.number().int().positive().optional(),
  rating: z.number().min(0).max(10).optional().nullable(),
  language: z.string().optional(),
  status: z.enum(["COMING_SOON", "NOW_SHOWING", "ENDED"]).optional(),
  releaseDate: z.string().transform((s) => new Date(s)).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const movie = await prisma.movie.findUnique({
      where: { id },
      include: {
        showtimes: {
          where: {
            isActive: true,
            startTime: { gte: new Date() },
          },
          include: {
            room: true,
          },
          orderBy: { startTime: "asc" },
        },
      },
    });

    if (!movie) {
      return NextResponse.json(
        { success: false, error: "Movie not found" },
        { status: 404 }
      );
    }

    const tmdbPoster = await searchMoviePoster(movie.title);
    const poster = tmdbPoster || movie.poster;

    return NextResponse.json({ success: true, data: { ...movie, poster } });
  } catch (error) {
    console.error("Error fetching movie:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch movie" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateMovieSchema.parse(body);

    const movie = await prisma.movie.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json({ success: true, data: movie });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating movie:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update movie" },
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
    
    // Check if movie has any showtimes
    const showtimes = await prisma.showtime.count({
      where: { movieId: id },
    });

    if (showtimes > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete movie with existing showtimes",
        },
        { status: 400 }
      );
    }

    await prisma.movie.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Movie deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting movie:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete movie" },
      { status: 500 }
    );
  }
}
