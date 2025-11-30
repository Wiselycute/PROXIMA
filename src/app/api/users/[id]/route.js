import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(_, { params }) {
  await connectDB();
  const user = await User.findById(params.id);
  return Response.json(user);
}

export async function PUT(req, { params }) {
  await connectDB();
  const data = await req.json();
  const user = await User.findByIdAndUpdate(params.id, data, { new: true });
  return Response.json(user);
}

export async function DELETE(_, { params }) {
  await connectDB();
  await User.findByIdAndDelete(params.id);
  return Response.json({ message: "User deleted" });
}
