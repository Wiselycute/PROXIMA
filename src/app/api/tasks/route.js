import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";

export async function GET() {
  await connectDB();
  const tasks = await Task.find()
    .populate("assignees")
    .populate("columnId")
    .populate("projectId");
  return Response.json(tasks);
}

export async function POST(req) {
  await connectDB();
  const data = await req.json();
  const task = await Task.create(data);
  return Response.json(task);
}
