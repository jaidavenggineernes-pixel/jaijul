import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Message from "@/models/Message";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const body = await req.json();
    const updatedMessage = await Message.findByIdAndUpdate(id, body, { new: true });
    
    if (!updatedMessage) {
      return NextResponse.json({ error: "Pesan tidak ditemukan" }, { status: 404 });
    }
    
    return NextResponse.json(updatedMessage);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengupdate data pesan" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const deletedMessage = await Message.findByIdAndDelete(id);
    
    if (!deletedMessage) {
      return NextResponse.json({ error: "Pesan tidak ditemukan" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: "Pesan berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus pesan" }, { status: 500 });
  }
}
