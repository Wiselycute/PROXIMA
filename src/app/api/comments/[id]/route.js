import { connectDB } from "@/lib/mongodb";
import Comment from "@/models/Comment";
import { NextResponse } from "next/server";

export async function GET(request, context) {
  const params = await context.params;
  try {
    await connectDB();
    const comment = await Comment.findById(params.id).populate("author");
    if (!comment) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(comment);
  } catch (err) {
    console.error("GET /api/comments/[id]", err);
    return NextResponse.json({ error: "Failed to fetch comment" }, { status: 500 });
  }
}

export async function PUT(req, context) {
  const params = await context.params;
  try {
    await connectDB();
    const data = await req.json();
    const comment = await Comment.findByIdAndUpdate(params.id, data, { new: true });
    if (!comment) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(comment);
  } catch (err) {
    console.error("PUT /api/comments/[id]", err);
    return NextResponse.json({ error: "Failed to update comment" }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  const params = await context.params;
  try {
    await connectDB();
    
    // Find the comment first
    const comment = await Comment.findById(params.id);
    if (!comment) return NextResponse.json({ error: "Not found" }, { status: 404 });
    
    // Get userId from request (you can enhance this with proper auth middleware)
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    // Check if the user is the author of the comment
    if (userId && comment.author && comment.author.toString() !== userId) {
      return NextResponse.json({ error: "Unauthorized: You can only delete your own comments" }, { status: 403 });
    }
    
    await Comment.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Comment deleted" });
  } catch (err) {
    console.error("DELETE /api/comments/[id]", err);
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
