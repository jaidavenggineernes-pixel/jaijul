import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Setting from "@/models/Setting";

export async function GET() {
  try {
    await dbConnect();
    let setting = await Setting.findOne({});
    
    // Jika belum ada setting sama sekali, buat default
    if (!setting) {
      setting = await Setting.create({});
    }
    
    return NextResponse.json(setting);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data pengaturan" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    let setting = await Setting.findOne({});
    if (!setting) {
      setting = await Setting.create(body);
    } else {
      setting = await Setting.findByIdAndUpdate(setting._id, body, { new: true });
    }
    
    return NextResponse.json(setting);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengupdate data pengaturan" }, { status: 500 });
  }
}
