import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";

export async function GET(_, { params }) {
  await connectDB();
  const project = await Project.findById(params.id).populate("members");
  return Response.json(project);
}

export async function PUT(req, { params }) {
  await connectDB();
  const data = await req.json();
  const project = await Project.findByIdAndUpdate(params.id, data, { new: true });
  return Response.json(project);
}

export async function DELETE(_, { params }) {
  await connectDB();
  await Project.findByIdAndDelete(params.id);
  return Response.json({ message: "Project deleted" });
}
