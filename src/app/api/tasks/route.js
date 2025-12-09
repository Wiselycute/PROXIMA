import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";
import User from "@/models/User";
import Column from "@/models/Column";
import Project from "@/models/Project";
import Comment from "@/models/Comment";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const projectId = url.searchParams.get("projectId");

    const query = {};
    if (projectId) {
      // allow passing either Mongo _id or string id
      query.projectId = projectId;
    }

    const tasks = await Task.find(query)
      .populate("assignees")
      .populate("columnId")
      .populate("projectId");

    // Fetch comments for all tasks
    const taskIds = tasks.map(t => t._id);
    const comments = await Comment.find({ taskId: { $in: taskIds } }).populate("author");
    
    // Group comments by taskId
    const commentsByTask = {};
    comments.forEach(comment => {
      const taskId = comment.taskId.toString();
      if (!commentsByTask[taskId]) {
        commentsByTask[taskId] = [];
      }
      commentsByTask[taskId].push(comment);
    });
    
    // Add comments to each task
    const tasksWithComments = tasks.map(task => {
      const taskObj = task.toObject();
      taskObj.comments = commentsByTask[task._id.toString()] || [];
      return taskObj;
    });

    return NextResponse.json(tasksWithComments);
  } catch (err) {
    console.error("GET /api/tasks error", {
      error: err.message,
      stack: err.stack,
      projectId,
      time: new Date().toISOString()
    });
    return NextResponse.json(
      { 
        error: "Failed to fetch tasks",
        details: process.env.NODE_ENV === 'development' ? err.message : undefined 
      }, 
      { status: 500 }
    );
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
