import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const tasks = await Task.find()
      .populate("assignees")
      .populate("columnId")
      .populate("projectId");
    return NextResponse.json(tasks);
  } catch (err) {
    console.error("GET /api/tasks error", err);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    const task = await Task.create(data);
    return NextResponse.json(task, { status: 201 });
  } catch (err) {
    console.error("POST /api/tasks error", err);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
