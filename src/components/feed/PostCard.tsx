"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { IPost } from "@/types";
import { useAuth } from "@/context/AuthContext";
import CommentSection from "./CommentSection";
import LikersModal from "./postCard/LikersModal";
import PostHeader from "./postCard/PostHeader";
import PostStats from "./postCard/PostStats";
import PostActions from "./postCard/PostActions";
import EditPostModal from "./postCard/EditPostModal";
import { REACTIONS } from "./postCard/postMeta";

interface PostCardProps {
	post: IPost;
	onPostDeleted: () => void;
}

export default function PostCard({ post, onPostDeleted }: PostCardProps) {
	const { user } = useAuth();

	const [liked, setLiked] = useState(
		post.likes?.includes(user?._id || "") || false
	);
	const [likesCount, setLikesCount] = useState(post.likesCount || 0);
	const [currentReaction, setCurrentReaction] = useState<string | null>(
		post.likes?.includes(user?._id || "") ? "like" : null
	);

	const [showReactionPicker, setShowReactionPicker] = useState(false);
	const [showComments, setShowComments] = useState(true);
	const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
	const [showDropdown, setShowDropdown] = useState(false);
	const [showLikers, setShowLikers] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const [postContent, setPostContent] = useState(post.content);
	const [postImage, setPostImage] = useState<string | null>(post.image || null);

	const [isHidden, setIsHidden] = useState(false);
	const [isSaved, setIsSaved] = useState(false);
	const [notifOn, setNotifOn] = useState(false);

	const [showEditModal, setShowEditModal] = useState(false);
	const [editContent, setEditContent] = useState(post.content);
	const [editImageFile, setEditImageFile] = useState<File | null>(null);
	const [editImagePreview, setEditImagePreview] = useState<string | null>(
		post.image || null
	);
	const [removeEditImage, setRemoveEditImage] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	const dropdownRef = useRef<HTMLDivElement>(null);
	const reactionZoneRef = useRef<HTMLDivElement>(null);
	const hidePickerTimeout = useRef<NodeJS.Timeout | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const previewUrlRef = useRef<string | null>(null);

	const author = post.author;
	const isOwner = user?._id === author?._id;

	const clearPreviewObjectUrl = () => {
		if (previewUrlRef.current) {
			URL.revokeObjectURL(previewUrlRef.current);
			previewUrlRef.current = null;
		}
	};

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setShowDropdown(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			clearPreviewObjectUrl();
		};
	}, []);

	const callLikeAPI = async (): Promise<{
		liked: boolean;
		likesCount: number;
	} | null> => {
		try {
			const res = await fetch(`/api/posts/${post._id}/like`, {
				method: "POST",
				credentials: "include",
			});
			const data = await res.json();
			if (data.success) return data.data;
		} catch (err) {
			console.error("Like error:", err);
		}
		return null;
	};

	const handleReactionClick = async () => {
		if (currentReaction) {
			const result = await callLikeAPI();
			if (result && !result.liked) {
				setLiked(false);
				setLikesCount(result.likesCount);
				setCurrentReaction(null);
			}
		} else {
			const result = await callLikeAPI();
			if (result && result.liked) {
				setLiked(true);
				setLikesCount(result.likesCount);
				setCurrentReaction("like");
			}
		}
	};

	const handlePickReaction = async (reactionType: string) => {
		setShowReactionPicker(false);

		if (currentReaction === reactionType) {
			const result = await callLikeAPI();
			if (result && !result.liked) {
				setLiked(false);
				setLikesCount(result.likesCount);
				setCurrentReaction(null);
			}
			return;
		}

		if (!liked) {
			const result = await callLikeAPI();
			if (result && result.liked) {
				setLiked(true);
				setLikesCount(result.likesCount);
			}
		}

		setCurrentReaction(reactionType);
	};

	const handleDelete = async () => {
		if (!confirm("Are you sure you want to delete this post?")) return;

		setIsDeleting(true);
		try {
			const res = await fetch(`/api/posts/${post._id}`, {
				method: "DELETE",
				credentials: "include",
			});
			const data = await res.json();
			if (data.success) onPostDeleted();
		} catch (err) {
			console.error("Delete error:", err);
		} finally {
			setIsDeleting(false);
			setShowDropdown(false);
		}
	};

	const openEditModal = () => {
		clearPreviewObjectUrl();
		setEditContent(postContent);
		setEditImageFile(null);
		setEditImagePreview(postImage || null);
		setRemoveEditImage(false);
		if (fileInputRef.current) fileInputRef.current.value = "";
		setShowEditModal(true);
		setShowDropdown(false);
	};

	const closeEditModal = () => {
		clearPreviewObjectUrl();
		setEditImageFile(null);
		setEditImagePreview(postImage || null);
		setRemoveEditImage(false);
		if (fileInputRef.current) fileInputRef.current.value = "";
		setShowEditModal(false);
	};

	const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		clearPreviewObjectUrl();

		const previewUrl = URL.createObjectURL(file);
		previewUrlRef.current = previewUrl;

		setEditImageFile(file);
		setEditImagePreview(previewUrl);
		setRemoveEditImage(false);
	};

	const handleRemoveEditImage = () => {
		clearPreviewObjectUrl();
		setEditImageFile(null);
		setEditImagePreview(null);
		setRemoveEditImage(true);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const handleEdit = async () => {
		if (!editContent.trim() || isEditing) return;

		setIsEditing(true);

		try {
			const formData = new FormData();
			formData.append("content", editContent.trim());
			formData.append("removeImage", removeEditImage ? "true" : "false");

			if (editImageFile) {
				formData.append("image", editImageFile);
			}

			const res = await fetch(`/api/posts/${post._id}`, {
				method: "PATCH",
				credentials: "include",
				body: formData,
			});

			const data = await res.json();

			if (data.success) {
				setPostContent(data.data.content);
				setPostImage(data.data.image || null);

				clearPreviewObjectUrl();
				setEditImageFile(null);
				setEditImagePreview(data.data.image || null);
				setRemoveEditImage(false);

				if (fileInputRef.current) fileInputRef.current.value = "";
				setShowEditModal(false);
			}
		} catch (err) {
			console.error("Edit error:", err);
		} finally {
			setIsEditing(false);
		}
	};

	const handleMouseEnterReactionZone = () => {
		if (hidePickerTimeout.current) {
			clearTimeout(hidePickerTimeout.current);
			hidePickerTimeout.current = null;
		}
		setShowReactionPicker(true);
	};

	const handleMouseLeaveReactionZone = () => {
		hidePickerTimeout.current = setTimeout(() => {
			setShowReactionPicker(false);
		}, 300);
	};

	if (isHidden) {
		return (
			<div className="bg-bg2 rounded-md p-6 mb-4 shadow-sm text-center">
				<p className="text-[14px] text-gray mb-2">This post has been hidden.</p>
				<button
					onClick={() => setIsHidden(false)}
					className="text-[13px] text-primary hover:underline"
				>
					Undo
				</button>
			</div>
		);
	}

	return (
		<>
			<div className="bg-bg2 rounded-md pb-6 pt-6 mb-4 shadow-sm">
				<PostHeader
					author={author}
					createdAt={post.createdAt}
					visibility={post.visibility}
					showDropdown={showDropdown}
					setShowDropdown={setShowDropdown}
					dropdownRef={dropdownRef}
					isSaved={isSaved}
					notifOn={notifOn}
					isOwner={isOwner}
					isDeleting={isDeleting}
					onToggleSave={() => {
						setIsSaved(!isSaved);
						setShowDropdown(false);
					}}
					onToggleNotif={() => {
						setNotifOn(!notifOn);
						setShowDropdown(false);
					}}
					onHide={() => {
						setIsHidden(true);
						setShowDropdown(false);
					}}
					onEdit={openEditModal}
					onDelete={handleDelete}
				/>

				<div className="px-6">
					<h4 className="text-[14px] font-medium text-dark2 mb-3 whitespace-pre-wrap">
						{postContent}
					</h4>
				</div>

				{postImage && (
					<div className="mb-3 flex justify-center bg-black/5">
						<Image
							src={postImage}
							alt="Post image"
							width={1200}
							height={1600}
							className="w-auto max-w-full h-auto max-h-125 object-contain"
						/>
					</div>
				)}

				<PostStats
					postId={post._id}
					likesCount={likesCount}
					commentsCount={commentsCount}
					onOpenLikers={() => setShowLikers(true)}
					onToggleComments={() => setShowComments(!showComments)}
				/>

				<PostActions
					currentReaction={currentReaction}
					showReactionPicker={showReactionPicker}
					reactionZoneRef={reactionZoneRef}
					onMouseEnterReactionZone={handleMouseEnterReactionZone}
					onMouseLeaveReactionZone={handleMouseLeaveReactionZone}
					onPickReaction={handlePickReaction}
					onReactionClick={handleReactionClick}
					onToggleComments={() => setShowComments(!showComments)}
				/>

				{showComments && (
					<CommentSection
						postId={post._id}
						onCommentCountChange={(count) => setCommentsCount(count)}
					/>
				)}

				{showLikers && (
					<LikersModal
						type="post"
						id={post._id}
						onClose={() => setShowLikers(false)}
					/>
				)}
			</div>

			<EditPostModal
				isOpen={showEditModal}
				author={author}
				visibility={post.visibility}
				editContent={editContent}
				setEditContent={setEditContent}
				editImagePreview={editImagePreview}
				isEditing={isEditing}
				fileInputRef={fileInputRef}
				onClose={closeEditModal}
				onImageChange={handleEditImageChange}
				onRemoveImage={handleRemoveEditImage}
				onSubmit={handleEdit}
			/>
		</>
	);
}
