import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const users = await User.find().select("-password"); // hide password
    return NextResponse.json(users);
  } catch (error) {
    console.error("GET /api/users error", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const data = await req.json();
    console.log("POST /api/users body:", JSON.stringify(data));

    // tolerate multiple payload shapes (client may send nested user/profile)
    const email =
      data?.email ||
      data?.user?.email ||
      data?.profile?.email ||
      data?._json?.email ||
      (data?.emails && data.emails[0] && data.emails[0].value) ||
      (data?.profile?.emails && data.profile.emails[0] && data.profile.emails[0].value) ||
      data?.email_address ||
      data?.given_email ||
      data?.account?.email ||
      data?.user?.profile?.email ||
      data?.user?._json?.email ||
      data?.profile?._json?.email;
    // indicate where email came from for easier debugging
    const matchedEmailSource =
      data?.email
        ? "data.email"
        : data?.user?.email
        ? "data.user.email"
        : data?.profile?.email
        ? "data.profile.email"
        : data?._json?.email
        ? "data._json.email"
        : data?.emails
        ? "data.emails[0].value"
        : data?.profile?.emails
        ? "data.profile.emails[0].value"
        : data?.email_address
        ? "data.email_address"
        : data?.given_email
        ? "data.given_email"
        : data?.account?.email
        ? "data.account.email"
        : data?.user?.profile?.email
        ? "data.user.profile.email"
        : data?.user?._json?.email
        ? "data.user._json.email"
        : data?.profile?._json?.email
        ? "data.profile._json.email"
        : null;
    const plainPassword =
      data?.password || data?.password_hash || data?.credentials?.password || data?.user?.password;
    const isOAuth = Boolean(
      data?.provider || data?.oauth || data?.google || data?.idToken || data?.from === "google"
    );

    if (!email) {
      console.warn("POST /api/users missing email, body:", JSON.stringify(data));
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    console.log("POST /api/users matched email source:", matchedEmailSource, "email:", email);

    if (!plainPassword && !isOAuth) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered." }, { status: 409 });
    }

    // If OAuth/signup without password, generate a random password to satisfy schema
    if (!plainPassword && isOAuth) {
      const fallback = Math.random().toString(36).slice(2);
      data.password = await bcrypt.hash(fallback, 10);
    } else if (plainPassword) {
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      data.password = hashedPassword;
    }

    // normalize email onto root object and clean up
    data.email = email;
    delete data.password_hash;

    // Create user
    const user = await User.create(data);

    // remove password before sending to client
    const safeUser = user.toObject();
    delete safeUser.password;

    return NextResponse.json(safeUser, { status: 201 });

  } catch (error) {
    console.error("Error creating user:", error);
    console.error("Error stack:", error.stack);
    console.error("Error details:", JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: "Internal Server Error: " + error.message },
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