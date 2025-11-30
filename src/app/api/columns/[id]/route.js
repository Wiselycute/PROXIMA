import { connectDB } from "@/lib/mongodb";
import Column from "@/models/Column";

export async function GET(_, { params }) {
  await connectDB();
  const column = await Column.findById(params.id);
  return Response.json(column);
}

export async function PUT(req, { params }) {
  await connectDB();
  const data = await req.json();
  const column = await Column.findByIdAndUpdate(params.id, data, { new: true });
  return Response.json(column);
}

export async function DELETE(_, { params }) {
  await connectDB();
  await Column.findByIdAndDelete(params.id);
  return Response.json({ message: "Column deleted" });
}
