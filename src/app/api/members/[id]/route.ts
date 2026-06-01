import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Member from "@/models/Member";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const body = await req.json();
    const updatedMember = await Member.findByIdAndUpdate(id, body, { new: true });
    
    if (!updatedMember) {
      return NextResponse.json({ error: "Anggota tidak ditemukan" }, { status: 404 });
    }
    
    return NextResponse.json(updatedMember);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengupdate data anggota" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const deletedMember = await Member.findByIdAndDelete(id);
    
    if (!deletedMember) {
      return NextResponse.json({ error: "Anggota tidak ditemukan" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: "Anggota berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus data anggota" }, { status: 500 });
  }
}
