import { connectDB } from "@/lib/mongodb";
import Comment from "@/models/Comment";

export async function GET() {
  await connectDB();
  const comments = await Comment.find().populate("author");
  return Response.json(comments);
}

export async function POST(req) {
  await connectDB();
  const data = await req.json();
  const comment = await Comment.create(data);
  return Response.json(comment);
}
