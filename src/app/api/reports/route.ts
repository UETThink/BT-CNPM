import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "30d";

    // Calculate date range
    let startDate = new Date();
    switch (range) {
      case "7d":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(startDate.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(startDate.getDate() - 90);
        break;
      case "all":
        startDate = new Date(0); // Beginning of time
        break;
    }

    // Overview stats
    const [
      totalRevenueResult,
      totalBookings,
      totalMovies,
      confirmedPayments,
    ] = await Promise.all([
      prisma.payment.aggregate({
        where: {
          status: "SUCCESS",
          paidAt: { gte: startDate },
        },
        _sum: { amount: true },
      }),
      prisma.booking.count({
        where: { createdAt: { gte: startDate } },
      }),
      prisma.movie.count({
        where: { status: "NOW_SHOWING" },
      }),
      prisma.payment.findMany({
        where: {
          status: "SUCCESS",
          paidAt: { gte: startDate },
        },
        select: { amount: true },
      }),
    ]);

    const totalRevenue = totalRevenueResult._sum.amount || 0;
    const averageTicketPrice = confirmedPayments.length > 0
      ? totalRevenue / confirmedPayments.length
      : 0;

    // Revenue by day
    const dailyData = await prisma.payment.groupBy({
      by: ["paidAt"],
      where: {
        status: "SUCCESS",
        paidAt: { gte: startDate },
      },
      _sum: { amount: true },
      _count: true,
    });

    const revenueByDay = dailyData.map((day) => ({
      date: day.paidAt?.toISOString().split("T")[0] || "",
      revenue: day._sum.amount || 0,
      bookings: day._count,
    }));

    // Revenue by month
    const monthlyData = await prisma.payment.groupBy({
      by: ["paidAt"],
      where: {
        status: "SUCCESS",
        paidAt: { gte: new Date(startDate.getFullYear(), startDate.getMonth(), 1) },
      },
      _sum: { amount: true },
      _count: true,
    });

    const revenueByMonthMap = new Map<string, { revenue: number; bookings: number }>();
    monthlyData.forEach((month) => {
      const date = month.paidAt;
      if (date) {
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        const existing = revenueByMonthMap.get(key) || { revenue: 0, bookings: 0 };
        revenueByMonthMap.set(key, {
          revenue: existing.revenue + (month._sum.amount || 0),
          bookings: existing.bookings + month._count,
        });
      }
    });

    const revenueByMonth = Array.from(revenueByMonthMap.entries())
      .map(([month, data]) => ({
        month,
        revenue: data.revenue,
        bookings: data.bookings,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Bookings by status
    const statusCounts = await prisma.booking.groupBy({
      by: ["status"],
      where: { createdAt: { gte: startDate } },
      _count: true,
    });

    const statusColors: Record<string, string> = {
      PENDING: "#F59E0B",
      CONFIRMED: "#10B981",
      CANCELLED: "#EF4444",
      EXPIRED: "#6B7280",
    };

    const bookingsByStatus = statusCounts.map((status) => ({
      status: status.status,
      count: status._count,
      color: statusColors[status.status] || "#6B7280",
    }));

    // Top movies by revenue
    const topMoviesData = await prisma.booking.findMany({
      where: {
        createdAt: { gte: startDate },
        status: "CONFIRMED",
      },
      include: {
        showtime: {
          include: {
            movie: {
              select: { id: true, title: true },
            },
          },
        },
        payment: {
          select: { amount: true },
        },
      },
    });

    const movieRevenueMap = new Map<string, { title: string; revenue: number; bookings: number }>();
    topMoviesData.forEach((booking) => {
      const movieId = booking.showtime.movie.id;
      const movieTitle = booking.showtime.movie.title;
      const revenue = booking.payment?.amount || 0;
      const existing = movieRevenueMap.get(movieId) || {
        title: movieTitle,
        revenue: 0,
        bookings: 0,
      };
      movieRevenueMap.set(movieId, {
        title: movieTitle,
        revenue: existing.revenue + revenue,
        bookings: existing.bookings + 1,
      });
    });

    const topMovies = Array.from(movieRevenueMap.entries())
      .map(([movieId, data]) => ({
        movieId,
        ...data,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalRevenue,
          totalBookings,
          totalMovies,
          averageTicketPrice,
        },
        revenueByDay: revenueByDay.sort((a, b) => a.date.localeCompare(b.date)),
        revenueByMonth,
        bookingsByStatus,
        topMovies,
      },
    });
  } catch (error) {
    console.error("Error fetching report data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch report data" },
      { status: 500 }
    );
  }
}
