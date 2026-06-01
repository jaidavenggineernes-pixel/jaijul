import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Schedule from "@/models/Schedule";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const body = await req.json();
    const updatedSchedule = await Schedule.findByIdAndUpdate(id, body, { new: true });
    
    if (!updatedSchedule) {
      return NextResponse.json({ error: "Jadwal tidak ditemukan" }, { status: 404 });
    }
    
    return NextResponse.json(updatedSchedule);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengupdate data jadwal" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const deletedSchedule = await Schedule.findByIdAndDelete(id);
    
    if (!deletedSchedule) {
      return NextResponse.json({ error: "Jadwal tidak ditemukan" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: "Jadwal berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus data jadwal" }, { status: 500 });
  }
}
