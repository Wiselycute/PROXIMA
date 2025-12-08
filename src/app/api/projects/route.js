import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find().populate("members");
    return NextResponse.json(projects);
  } catch (err) {
    console.error("GET /api/projects error", err);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    const project = await Project.create(data);
    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    console.error("POST /api/projects error", err);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
