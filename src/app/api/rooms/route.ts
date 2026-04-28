import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const createRoomSchema = z.object({
  name: z.string().min(1),
  rows: z.number().int().positive().max(15),
  seatsPerRow: z.number().int().positive().max(20),
  roomType: z.enum(["STANDARD", "VIP", "IMAX", "THREE_D"]).default("STANDARD"),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get("isActive");

    const where: Record<string, unknown> = {};
    if (isActive !== null) {
      where.isActive = isActive === "true";
    }

    const rooms = await prisma.room.findMany({
      where,
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, data: rooms });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createRoomSchema.parse(body);

    const room = await prisma.room.create({
      data: validatedData,
    });

    return NextResponse.json(
      { success: true, data: room },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating room:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create room" },
      { status: 500 }
    );
  }
}

