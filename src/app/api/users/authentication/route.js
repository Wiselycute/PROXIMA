import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";

export const POST = async (request) => {
  try {
    await connectDB();

    const body = await request.json();
    const email = (body.email || body.Email || "").trim().toLowerCase();
    const password = body.password || body.Password || "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Correct field name
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    // Success
    return NextResponse.json({
      message: "Authentication successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },
    });

  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
