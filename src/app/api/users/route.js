import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const users = await User.find().select("-password"); // hide password
  return NextResponse.json(users);
}

export async function POST(req) {
  try {
    await connectDB();

    const data = await req.json();
    const plainPassword = data.password || data.password_hash;

    if (!data.email || !plainPassword) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered." },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Replace password field correctly
    data.password = hashedPassword;
    delete data.password_hash;

    // Create user
    const user = await User.create(data);

    // remove password before sending to client
    const safeUser = user.toObject();
    delete safeUser.password;

    return NextResponse.json(safeUser, { status: 201 });

  } catch (error) {
    console.error("Error creating user:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// export async function GET() {
//   await connectDB();
//   const users = await User.find();
//   return Response.json(users);
// }


// export async function POST(req) {
//   await connectDB();
//   const data = await req.json();
//   const user = await User.create(data);
//   return Response.json(user);
// }
// import { NextResponse } from "next/server";
// import connectDB from "@/db/connectDB";
// import User from "@/models/User";
// import bcrypt from "bcryptjs";