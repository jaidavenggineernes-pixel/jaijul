import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Gallery from "@/models/Gallery";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const body = await req.json();
    const updatedItem = await Gallery.findByIdAndUpdate(id, body, { new: true });
    
    if (!updatedItem) {
      return NextResponse.json({ error: "Foto tidak ditemukan" }, { status: 404 });
    }
    
    return NextResponse.json(updatedItem);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengupdate data foto" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const deletedItem = await Gallery.findByIdAndDelete(id);
    
    if (!deletedItem) {
      return NextResponse.json({ error: "Foto tidak ditemukan" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: "Foto berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus data foto" }, { status: 500 });
  }
}
