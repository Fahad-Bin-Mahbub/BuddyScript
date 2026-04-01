import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Comment from "@/models/Comment";
import Post from "@/models/Post";
import { getCurrentUser } from "@/lib/auth";
import { createCommentSchema } from "@/lib/validations";
import { ZodError } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { postId } = await params;
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get("parentId");

    // Fetch top-level comments or replies
    const query = parentId
      ? { post: postId, parentComment: parentId }
      : { post: postId, parentComment: { $exists: false } };

    const comments = await Comment.find(query)
      .sort({ createdAt: 1 })
      .populate("author", "firstName lastName avatar")
      .lean();

    // For top-level comments, also count replies
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const repliesCount = await Comment.countDocuments({
          parentComment: comment._id,
        });
        return {
          ...comment,
          likesCount: comment.likes?.length ?? 0,
          repliesCount,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: commentsWithReplies,
    });
  } catch (error) {
    console.error("Fetch comments error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { postId } = await params;
    const body = await request.json();
    const validated = createCommentSchema.parse(body);

    await dbConnect();

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    // If replying, verify parent comment exists and belongs to same post
    if (validated.parentComment) {
      const parentComment = await Comment.findById(validated.parentComment);
      if (!parentComment || parentComment.post.toString() !== postId) {
        return NextResponse.json(
          { success: false, error: "Parent comment not found" },
          { status: 404 }
        );
      }
    }

    const comment = await Comment.create({
      post: postId,
      author: tokenPayload.userId,
      content: validated.content,
      parentComment: validated.parentComment || undefined,
    });

    // Increment post comment count (atomic)
    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

    const populatedComment = await Comment.findById(comment._id)
      .populate("author", "firstName lastName avatar")
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: {
          ...populatedComment,
          likesCount: 0,
          repliesCount: 0,
        },
        message: "Comment added successfully",
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

    console.error("Create comment error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
