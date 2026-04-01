import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { signToken, setAuthCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";
import { ZodError } from "zod";

// Generic error message to prevent user enumeration
const INVALID_CREDENTIALS_MSG = "Invalid email or password";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const validated = loginSchema.parse(body);

    await dbConnect();

    // Find user with password field included
    const user = await User.findOne({ email: validated.email }).select(
      "+password"
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: INVALID_CREDENTIALS_MSG },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(validated.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: INVALID_CREDENTIALS_MSG },
        { status: 401 }
      );
    }

    // Generate token and set cookie
    const token = await signToken(
      user._id.toString(),
      user.email
    );
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
      },
      message: "Login successful",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const firstIssue = error.issues?.[0];
      return NextResponse.json(
        { success: false, error: firstIssue?.message || "Validation failed" },
        { status: 400 }
      );
    }

    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
