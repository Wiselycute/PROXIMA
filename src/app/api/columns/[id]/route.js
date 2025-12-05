import { connectDB } from "@/lib/mongodb";
import Column from "@/models/Column";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const column = await Column.findById(params.id);
    if (!column) return NextResponse.json({ error: "Column not found" }, { status: 404 });
    return NextResponse.json(column);
  } catch (error) {
    console.error("GET /api/columns/[id] error", error);
    return NextResponse.json({ error: "Failed to fetch column" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const data = await req.json();
    const column = await Column.findByIdAndUpdate(params.id, data, { new: true });
    if (!column) return NextResponse.json({ error: "Column not found" }, { status: 404 });
    return NextResponse.json(column);
  } catch (error) {
    console.error("PUT /api/columns/[id] error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const deleted = await Column.findByIdAndDelete(params.id);
    if (!deleted) return NextResponse.json({ error: "Column not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/columns/[id] error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
