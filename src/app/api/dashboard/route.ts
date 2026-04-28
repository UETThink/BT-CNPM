import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Get dashboard statistics
    const [
      totalMovies,
      totalBookings,
      todayBookings,
      totalRevenue,
      todayRevenue,
      recentBookings,
    ] = await Promise.all([
      prisma.movie.count(),
      prisma.booking.count(),
      prisma.booking.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: "SUCCESS" },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          status: "SUCCESS",
          paidAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.booking.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { name: true, email: true },
          },
          showtime: {
            include: {
              movie: { select: { title: true } },
              room: { select: { name: true } },
            },
          },
          payment: true,
        },
      }),
    ]);

    // Get monthly revenue data (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await prisma.payment.groupBy({
      by: ["paidAt"],
      _sum: { amount: true },
      where: {
        status: "SUCCESS",
        paidAt: { gte: sixMonthsAgo },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalMovies,
          totalBookings,
          todayBookings,
          totalRevenue: totalRevenue._sum.amount || 0,
          todayRevenue: todayRevenue._sum.amount || 0,
        },
        recentBookings,
        monthlyRevenue,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard" },
      { status: 500 }
    );
  }
}
