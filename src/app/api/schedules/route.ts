export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Schedule from "@/models/Schedule";

export async function GET() {
  try {
    await dbConnect();
    const schedules = await Schedule.find({});
    // Urutkan berdasarkan hari (Senin-Minggu)
    const daysOrder = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
    schedules.sort((a, b) => daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day));
    
    return NextResponse.json(schedules);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data jadwal" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const newSchedule = await Schedule.create(body);
    return NextResponse.json(newSchedule, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menambah data jadwal" }, { status: 500 });
  }
}
