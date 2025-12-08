import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(request, context) {
  const params = await context.params;
  const id = params.id;
  
  console.log("GET /api/projects/[id] - Looking for project:", id);
  
  try {
    await connectDB();
    const project = await Project.findById(id).populate("members");
    
    if (!project) {
      console.log("Project not found in database:", id);
      // Try to list all projects to debug
      const allProjects = await Project.find().select("_id name").limit(5);
      console.log("Available projects:", allProjects.map(p => ({ id: p._id.toString(), name: p.name })));
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    
    return NextResponse.json(project);
  } catch (err) {
    console.error("GET /api/projects/[id] error:", err.message);
    return NextResponse.json({ error: "Failed to fetch project", details: err.message }, { status: 500 });
  }
}

export async function PUT(req, context) {
  const params = await context.params;
  try {
    await connectDB();
    const data = await req.json();
    const project = await Project.findByIdAndUpdate(params.id, data, { new: true });
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(project);
  } catch (err) {
    console.error("PUT /api/projects/[id]", err);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  const params = await context.params;
  try {
    await connectDB();
    const doc = await Project.findByIdAndDelete(params.id);
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ message: "Project deleted" });
  } catch (err) {
    console.error("DELETE /api/projects/[id]", err);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
