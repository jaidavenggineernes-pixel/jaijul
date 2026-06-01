import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "vanguard-secret-key-123");

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Nama tidak boleh kosong" }, { status: 400 });
    }

    const trimmedName = name.trim();
    const role = trimmedName.toLowerCase() === 'admin' ? 'admin' : 'user';
    let userId = "mock-id-123";

    try {
      // Mencoba koneksi ke database
      await dbConnect();
      
      let user = await User.findOne({ name: trimmedName });
      
      if (!user) {
        user = await User.create({ name: trimmedName, role });
      } else {
        user.lastLogin = new Date();
        if (role === 'admin' && user.role !== 'admin') {
          user.role = 'admin';
        }
        await user.save();
      }
      userId = user._id.toString();
    } catch (dbError) {
      console.warn("Database tidak terhubung, menggunakan mode fallback/mock login.");
      // Mode fallback jika MongoDB belum di-setup (supaya tetap bisa test fitur)
    }

    const token = await new SignJWT({ id: userId, name: trimmedName, role })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    const response = NextResponse.json({ success: true, user: { name: trimmedName, role } });
    
    response.cookies.set({
      name: "vanguard_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
