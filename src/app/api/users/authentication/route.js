import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

export const POST = async (request) => {
  try {
    await connectDB();

    const body = await request.json();
    const email = (body.email || body.Email || "").trim().toLowerCase();
    const password = body.password || body.Password || "";

    console.log("Authentication attempt for email:", email);

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Correct field name
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Invalid password for user:", email);
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    console.log("Authentication successful for user:", email);
    // Success
    return NextResponse.json({
      message: "Authentication successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role || "member", // Include role in response
      },
    });

  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { error: "Internal Server Error: " + error.message },
      { status: 500 }
    );
  }
};
