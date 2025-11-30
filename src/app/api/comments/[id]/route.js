import { connectDB } from "@/lib/mongodb";
import Comment from "@/models/Comment";

export async function GET(_, { params }) {
  await connectDB();
  const comment = await Comment.findById(params.id).populate("author");
  return Response.json(comment);
}

export async function PUT(req, { params }) {
  await connectDB();
  const data = await req.json();
  const comment = await Comment.findByIdAndUpdate(params.id, data, { new: true });
  return Response.json(comment);
}

export async function DELETE(_, { params }) {
  await connectDB();
  await Comment.findByIdAndDelete(params.id);
  return Response.json({ message: "Comment deleted" });
}
