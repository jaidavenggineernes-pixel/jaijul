import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      return NextResponse.json({ 
        status: "Error", 
        message: "MONGODB_URI is not set in Environment Variables!" 
      });
    }

    // Try to connect explicitly
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000 // timeout after 5 seconds to prevent hanging
    });
    
    const dbState = mongoose.connection.readyState;
    const states = {
      0: "Disconnected",
      1: "Connected",
      2: "Connecting",
      3: "Disconnecting",
      99: "Uninitialized"
    };

    return NextResponse.json({ 
      status: "Success", 
      message: "Connected successfully to MongoDB!",
      readyState: states[dbState as keyof typeof states],
      uriPrefix: uri.substring(0, 15) + "..."
    });

  } catch (error: any) {
    console.error("Test DB Error:", error);
    return NextResponse.json({ 
      status: "Error", 
      message: error.message,
      name: error.name,
      code: error.code,
      stack: error.stack
    }, { status: 500 });
  }
}
