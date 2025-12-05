import { connectDB } from "@/lib/mongodb";
import Comment from "@/models/Comment";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const comments = await Comment.find().populate("author");
    return NextResponse.json(comments);
  } catch (err) {
    console.error("GET /api/comments error", err);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    const comment = await Comment.create(data);
    return NextResponse.json(comment, { status: 201 });
  } catch (err) {
    console.error("POST /api/comments error", err);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}
