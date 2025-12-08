import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";
import User from "@/models/User";
import Column from "@/models/Column";
import Project from "@/models/Project";
import { NextResponse } from "next/server";

export async function GET(request, context) {
  const params = await context.params;
  try {
    await connectDB();
    const task = await Task.findById(params.id)
      .populate("assignees")
      .populate("columnId")
      .populate("projectId");
    if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(task);
  } catch (err) {
    console.error("GET /api/tasks/[id]", err);
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 });
  }
}

export async function PUT(req, context) {
  const params = await context.params;
  try {
    await connectDB();
    const data = await req.json();
    const task = await Task.findByIdAndUpdate(params.id, data, { new: true });
    if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(task);
  } catch (err) {
    console.error("PUT /api/tasks/[id]", err);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  const params = await context.params;
  try {
    await connectDB();
    const doc = await Task.findByIdAndDelete(params.id);
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ message: "Task deleted" });
  } catch (err) {
    console.error("DELETE /api/tasks/[id]", err);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
