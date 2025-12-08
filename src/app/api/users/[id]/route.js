import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET(request, context) {
  const params = await context.params;
  try {
    await connectDB();
    const user = await User.findById(params.id).select("-password");
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    console.error("GET /api/users/[id] error", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PUT(req, context) {
  const params = await context.params;
  try {
    await connectDB();
    const data = await req.json();
    if (data.password) {
      const hashed = await bcrypt.hash(data.password, 10);
      data.password = hashed;
    }
    const user = await User.findByIdAndUpdate(params.id, data, { new: true }).select("-password");
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    console.error("PUT /api/users/[id] error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  const params = await context.params;
  try {
    await connectDB();
    const deleted = await User.findByIdAndDelete(params.id);
    if (!deleted) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/users/[id] error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
