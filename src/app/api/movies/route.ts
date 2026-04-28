import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { searchMoviePoster } from "@/lib/tmdb";

export const dynamic = "force-dynamic";

const createMovieSchema = z.object({
  title: z.string().min(1).max(255),
  poster: z.string().url().optional().nullable(),
  trailer: z.string().url().optional().nullable(),
  description: z.string().optional().nullable(),
  director: z.string().optional().nullable(),
  cast: z.string().optional().nullable(),
  genre: z.string().min(1),
  duration: z.number().int().positive(),
  rating: z.number().min(0).max(10).optional().nullable(),
  language: z.string().default("Vietnamese"),
  status: z.enum(["COMING_SOON", "NOW_SHOWING", "ENDED"]).default("COMING_SOON"),
  releaseDate: z.string().transform((s) => new Date(s)),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const genre = searchParams.get("genre");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status;
    }

    if (genre) {
      where.genre = { contains: genre };
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { director: { contains: search } },
        { cast: { contains: search } },
      ];
    }

    const [movies, total] = await Promise.all([
      prisma.movie.findMany({
        where,
        include: {
          showtimes: {
            where: {
              isActive: true,
              startTime: { gte: new Date() },
            },
            take: 5,
            orderBy: { startTime: "asc" },
            include: {
              room: true,
            },
          },
        },
        orderBy: { releaseDate: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.movie.count({ where }),
    ]);

    const moviesWithPosters = await Promise.all(
      movies.map(async (movie) => {
        const tmdbPoster = await searchMoviePoster(movie.title);
        if (tmdbPoster) {
          return { ...movie, poster: tmdbPoster };
        }
        return movie;
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        items: moviesWithPosters,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching movies:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch movies" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createMovieSchema.parse(body);

    const movie = await prisma.movie.create({
      data: validatedData,
    });

    return NextResponse.json(
      { success: true, data: movie },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating movie:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create movie" },
      { status: 500 }
    );
  }
}

