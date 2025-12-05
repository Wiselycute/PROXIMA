import { connectDB } from "@/lib/mongodb";
import Column from "@/models/Column";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const columns = await Column.find();
  return NextResponse.json(columns);
}

export async function POST(req) {
  await connectDB();
  const data = await req.json();
  const column = await Column.create(data);
  return NextResponse.json(column);
}
