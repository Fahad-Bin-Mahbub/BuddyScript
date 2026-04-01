import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import { getCurrentUser } from "@/lib/auth";
import { deleteImage } from "@/lib/cloudinary";

export async function PATCH(
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
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, error: "Content is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    if (post.author.toString() !== tokenPayload.userId) {
      return NextResponse.json(
        { success: false, error: "Not authorized to edit this post" },
        { status: 403 }
      );
    }

    post.content = content.trim();
    await post.save();

    const updatedPost = await Post.findById(postId)
      .populate("author", "firstName lastName avatar")
      .lean();

    return NextResponse.json({
      success: true,
      data: updatedPost,
    });
  } catch (error) {
    console.error("Edit post error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to edit post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const post = await Post.findById(postId).select("+imagePublicId");
    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    // Only author can delete their post
    if (post.author.toString() !== tokenPayload.userId) {
      return NextResponse.json(
        { success: false, error: "Not authorized to delete this post" },
        { status: 403 }
      );
    }

    // Delete image from Cloudinary if exists
    if (post.imagePublicId) {
      try {
        await deleteImage(post.imagePublicId);
      } catch (e) {
        console.error("Failed to delete image from Cloudinary:", e);
      }
    }

    // Delete all comments on this post
    await Comment.deleteMany({ post: postId });

    // Delete the post
    await Post.findByIdAndDelete(postId);

    return NextResponse.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete post error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
