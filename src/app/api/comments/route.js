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
    
    // Validate required fields
    if (!data.text || !data.taskId) {
      return NextResponse.json({ error: "Text and taskId are required" }, { status: 400 });
    }

    const comment = await Comment.create(data);
    const populated = await Comment.findById(comment._id).populate("author");
    return NextResponse.json(populated, { status: 201 });
  } catch (err) {
    console.error("POST /api/comments error", err);
    return NextResponse.json({ error: err.message || "Failed to create comment" }, { status: 500 });
  }
}
