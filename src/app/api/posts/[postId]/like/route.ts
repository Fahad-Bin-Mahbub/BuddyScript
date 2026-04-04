import { NextResponse } from "next/server";
import "@/models/User";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { getCurrentUser } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(
  _request: Request,
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

    const userId = new mongoose.Types.ObjectId(tokenPayload.userId);

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === tokenPayload.userId
    );

    if (alreadyLiked) {
      // Unlike — atomic pull
      await Post.findByIdAndUpdate(postId, {
        $pull: { likes: userId },
      });
    } else {
      // Like — atomic addToSet prevents duplicates
      await Post.findByIdAndUpdate(postId, {
        $addToSet: { likes: userId },
      });
    }

    const updatedPost = await Post.findById(postId).lean();
    const likesCount = updatedPost?.likes?.length ?? 0;

    return NextResponse.json({
      success: true,
      data: {
        liked: !alreadyLiked,
        likesCount,
        likes: updatedPost?.likes || [],
      },
    });
  } catch (error) {
    console.error("Toggle like error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: Request,
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

    const post = await Post.findById(postId)
      .select("likes")
      .populate("likes", "firstName lastName avatar")
      .lean();

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: post.likes,
    });
  } catch (error) {
    console.error("Get likers error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get likers" },
      { status: 500 }
    );
  }
}
