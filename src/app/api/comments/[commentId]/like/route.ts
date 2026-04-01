import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Comment from "@/models/Comment";
import { getCurrentUser } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { commentId } = await params;
    await dbConnect();

    const userId = new mongoose.Types.ObjectId(tokenPayload.userId);

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json(
        { success: false, error: "Comment not found" },
        { status: 404 }
      );
    }

    const alreadyLiked = comment.likes.some(
      (id) => id.toString() === tokenPayload.userId
    );

    if (alreadyLiked) {
      await Comment.findByIdAndUpdate(commentId, {
        $pull: { likes: userId },
      });
    } else {
      await Comment.findByIdAndUpdate(commentId, {
        $addToSet: { likes: userId },
      });
    }

    const updatedComment = await Comment.findById(commentId).lean();
    const likesCount = updatedComment?.likes?.length ?? 0;

    return NextResponse.json({
      success: true,
      data: {
        liked: !alreadyLiked,
        likesCount,
        likes: updatedComment?.likes || [],
      },
    });
  } catch (error) {
    console.error("Toggle comment like error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { commentId } = await params;
    await dbConnect();

    const comment = await Comment.findById(commentId)
      .select("likes")
      .populate("likes", "firstName lastName avatar")
      .lean();

    if (!comment) {
      return NextResponse.json(
        { success: false, error: "Comment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: comment.likes,
    });
  } catch (error) {
    console.error("Get comment likers error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get likers" },
      { status: 500 }
    );
  }
}
