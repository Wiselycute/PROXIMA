import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";

export async function GET() {
  await connectDB();
  const projects = await Project.find().populate("members");
  return Response.json(projects);
}

export async function POST(req) {
  await connectDB();
  const data = await req.json();
  const project = await Project.create(data);
  return Response.json(project);
}
