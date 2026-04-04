import { NextRequest, NextResponse } from "next/server";
import "@/models/User";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { getCurrentUser } from "@/lib/auth";
import { createPostSchema } from "@/lib/validations";
import { uploadImage } from "@/lib/cloudinary";
import { ZodError } from "zod";
import mongoose from "mongoose";

const POSTS_PER_PAGE = 10;

export async function GET(request: NextRequest) {
  try {
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const limit = Math.min(
      parseInt(searchParams.get("limit") || String(POSTS_PER_PAGE)),
      50
    );

    const userId = new mongoose.Types.ObjectId(tokenPayload.userId);

    // Build query: public posts OR user's own private posts
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {
      $or: [
        { visibility: "public" },
        { author: userId, visibility: "private" },
      ],
    };

    // Cursor-based pagination using createdAt
    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .populate("author", "firstName lastName email avatar")
      .lean();

    const hasMore = posts.length > limit;
    const resultPosts = hasMore ? posts.slice(0, limit) : posts;
    const nextCursor = hasMore
      ? resultPosts[resultPosts.length - 1].createdAt.toISOString()
      : undefined;

    // Add likesCount to each post
    const postsWithCounts = resultPosts.map((post) => ({
      ...post,
      likesCount: post.likes?.length ?? 0,
    }));

    return NextResponse.json({
      success: true,
      data: postsWithCounts,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error("Fetch posts error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    await dbConnect();

    const formData = await request.formData();
    const content = formData.get("content") as string;
    const visibility = (formData.get("visibility") as string) || "public";
    const imageFile = formData.get("image") as File | null;

    // Validate text fields
    const validated = createPostSchema.parse({ content, visibility });

    let imageUrl: string | undefined;
    let imagePublicId: string | undefined;

    // Handle image upload
    if (imageFile && imageFile.size > 0) {
      // Validate file size (max 5MB)
      if (imageFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: "Image must be less than 5MB" },
          { status: 400 }
        );
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(imageFile.type)) {
        return NextResponse.json(
          {
            success: false,
            error: "Only JPEG, PNG, GIF, and WebP images are allowed",
          },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const result = await uploadImage(buffer);
      imageUrl = result.url;
      imagePublicId = result.publicId;
    }

    const post = await Post.create({
      author: tokenPayload.userId,
      content: validated.content,
      visibility: validated.visibility,
      image: imageUrl,
      imagePublicId,
    });

    const populatedPost = await Post.findById(post._id)
      .populate("author", "firstName lastName email avatar")
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: {
          ...populatedPost,
          likesCount: 0,
          commentsCount: 0,
        },
        message: "Post created successfully",
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

    console.error("Create post error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create post" },
      { status: 500 }
    );
  }
}
