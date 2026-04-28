import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const room = await prisma.room.findUnique({
      where: { id },
    });

    if (!room) {
      return NextResponse.json(
        { success: false, error: "Room not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: room });
  } catch (error) {
    console.error("Error fetching room:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch room" },
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

    const room = await prisma.room.update({
      where: { id },
      data: {
        name: body.name,
        rows: body.rows,
        seatsPerRow: body.seatsPerRow,
        roomType: body.roomType,
        isActive: body.isActive,
      },
    });

    return NextResponse.json({ success: true, data: room });
  } catch (error) {
    console.error("Error updating room:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update room" },
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
    
    // Check if room has any showtimes
    const showtimes = await prisma.showtime.count({
      where: { roomId: id },
    });

    if (showtimes > 0) {
      return NextResponse.json(
        { success: false, error: "Cannot delete room with existing showtimes" },
        { status: 400 }
      );
    }

    await prisma.room.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting room:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete room" },
      { status: 500 }
    );
  }
}
