import { NextResponse } from "next/server";
import "@/models/User";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import { getCurrentUser } from "@/lib/auth";
import { deleteImage, uploadImage } from "@/lib/cloudinary";

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
		const formData = await request.formData();

		const content = String(formData.get("content") || "");
		const removeImage =
			String(formData.get("removeImage") || "false") === "true";
		const imageFile = formData.get("image");

		if (!content.trim()) {
			return NextResponse.json(
				{ success: false, error: "Content is required" },
				{ status: 400 }
			);
		}

		const hasNewImage = imageFile instanceof File && imageFile.size > 0;

		if (hasNewImage && !imageFile.type.startsWith("image/")) {
			return NextResponse.json(
				{ success: false, error: "Only image files are allowed" },
				{ status: 400 }
			);
		}

		await dbConnect();

		const post = await Post.findById(postId).select("+imagePublicId");

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

		let uploadedImage: { url: string; publicId: string } | null = null;

		if (hasNewImage) {
			const arrayBuffer = await imageFile.arrayBuffer();
			const fileBuffer = Buffer.from(arrayBuffer);
			uploadedImage = await uploadImage(fileBuffer);
		}

		const shouldReplaceOrRemoveOldImage = removeImage || hasNewImage;

		if (shouldReplaceOrRemoveOldImage && post.imagePublicId) {
			try {
				await deleteImage(post.imagePublicId);
			} catch (e) {
				console.error("Failed to delete old image from Cloudinary:", e);
			}

			post.image = undefined;
			post.imagePublicId = undefined;
		}

		if (uploadedImage) {
			post.image = uploadedImage.url;
			post.imagePublicId = uploadedImage.publicId;
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

		if (post.author.toString() !== tokenPayload.userId) {
			return NextResponse.json(
				{ success: false, error: "Not authorized to delete this post" },
				{ status: 403 }
			);
		}

		if (post.imagePublicId) {
			try {
				await deleteImage(post.imagePublicId);
			} catch (e) {
				console.error("Failed to delete image from Cloudinary:", e);
			}
		}

		await Comment.deleteMany({ post: postId });
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
