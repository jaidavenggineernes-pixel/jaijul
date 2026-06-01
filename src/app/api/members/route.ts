import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Member from "@/models/Member";

export async function GET() {
  try {
    await dbConnect();
    const members = await Member.find({}).sort({ absen: 1, name: 1 });
    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data anggota" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const newMember = await Member.create(body);
    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menambah data anggota" }, { status: 500 });
  }
}
