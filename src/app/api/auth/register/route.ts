import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { signToken, setAuthCookie } from "@/lib/auth";
import { registerSchema } from "@/lib/validations";
import { ZodError } from "zod";

function generateRandomDicebearAvatar(firstName: string, lastName: string) {
	const seed = `${firstName}-${lastName}-${crypto.randomUUID()}`;

	return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
		seed
	)}`;
}

export async function POST(request: Request) {
	try {
		const body = await request.json();

		const validated = registerSchema.parse(body);

		await dbConnect();

		const existingUser = await User.findOne({ email: validated.email }).lean();
		if (existingUser) {
			return NextResponse.json(
				{ success: false, error: "An account with this email already exists" },
				{ status: 409 }
			);
		}

		const avatar = generateRandomDicebearAvatar(
			validated.firstName,
			validated.lastName
		);

		const user = await User.create({
			firstName: validated.firstName,
			lastName: validated.lastName,
			email: validated.email,
			password: validated.password,
			avatar,
		});

		const token = await signToken(user._id.toString(), user.email);
		await setAuthCookie(token);

		return NextResponse.json(
			{
				success: true,
				data: {
					_id: user._id,
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
					avatar: user.avatar,
				},
				message: "Registration successful",
			},
			{ status: 201 }
		);
	} catch (error) {
		if (error instanceof ZodError) {
			const firstIssue = error.issues?.[0];
			return NextResponse.json(
				{ success: false, error: firstIssue?.message || "Validation failed" },
				{ status: 400 }
			);
		}

		console.error("Registration error:", error);
		return NextResponse.json(
			{ success: false, error: "Registration failed. Please try again." },
			{ status: 500 }
		);
	}
}
