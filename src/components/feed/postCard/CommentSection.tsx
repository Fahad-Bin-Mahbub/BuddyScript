"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { IComment } from "@/types";
import LikersModal from "./LikersModal";
import { Heart, ImageIcon, Mic, ThumbsUp } from "lucide-react";

function timeAgo(dateStr: string): string {
	const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
	if (seconds < 60) return "just now";
	const m = Math.floor(seconds / 60);
	if (m < 60) return `${m}m`;
	const h = Math.floor(m / 60);
	if (h < 24) return `${h}h`;
	return `${Math.floor(h / 24)}d`;
}

interface CommentSectionProps {
	postId: string;
	onCommentCountChange: (count: number) => void;
}

export default function CommentSection({
	postId,
	onCommentCountChange,
}: CommentSectionProps) {
	const { user } = useAuth();
	const [comments, setComments] = useState<IComment[]>([]);
	const [newComment, setNewComment] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [replyTo, setReplyTo] = useState<string | null>(null);
	const [replyText, setReplyText] = useState("");
	const [replies, setReplies] = useState<Record<string, IComment[]>>({});
	const [showReplies, setShowReplies] = useState<Record<string, boolean>>({});
	const [likersModal, setLikersModal] = useState<{
		type: "comment";
		id: string;
	} | null>(null);
	const [showAllComments, setShowAllComments] = useState(false);

	const fetchComments = useCallback(async () => {
		try {
			const res = await fetch(`/api/posts/${postId}/comments`, {
				credentials: "include",
			});
			const data = await res.json();
			if (data.success) {
				setComments(data.data);
				onCommentCountChange(data.data.length);
			}
		} catch (err) {
			console.error("Fetch comments error:", err);
		}
	}, [postId, onCommentCountChange]);

	useEffect(() => {
		fetchComments();
	}, [fetchComments]);

	const fetchReplies = async (commentId: string) => {
		try {
			const res = await fetch(
				`/api/posts/${postId}/comments?parentId=${commentId}`,
				{
					credentials: "include",
				}
			);
			const data = await res.json();
			if (data.success) {
				setReplies((prev) => ({ ...prev, [commentId]: data.data }));
				setShowReplies((prev) => ({ ...prev, [commentId]: true }));
			}
		} catch (err) {
			console.error("Fetch replies error:", err);
		}
	};

	const submitComment = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newComment.trim() || isSubmitting) return;
		setIsSubmitting(true);

		try {
			const res = await fetch(`/api/posts/${postId}/comments`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ content: newComment.trim() }),
			});
			const data = await res.json();
			if (data.success) {
				setComments((prev) => [...prev, data.data]);
				setNewComment("");
				onCommentCountChange(comments.length + 1);
			}
		} catch (err) {
			console.error("Submit comment error:", err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const submitReply = async (parentCommentId: string) => {
		if (!replyText.trim() || isSubmitting) return;
		setIsSubmitting(true);

		try {
			const res = await fetch(`/api/posts/${postId}/comments`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					content: replyText.trim(),
					parentComment: parentCommentId,
				}),
			});
			const data = await res.json();
			if (data.success) {
				setReplies((prev) => ({
					...prev,
					[parentCommentId]: [...(prev[parentCommentId] || []), data.data],
				}));
				setReplyTo(null);
				setReplyText("");
				setShowReplies((prev) => ({ ...prev, [parentCommentId]: true }));
			}
		} catch (err) {
			console.error("Submit reply error:", err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const toggleCommentLike = async (
		commentId: string,
		isReply: boolean,
		parentId?: string
	) => {
		try {
			const res = await fetch(`/api/comments/${commentId}/like`, {
				method: "POST",
				credentials: "include",
			});
			const data = await res.json();
			if (data.success) {
				if (isReply && parentId) {
					setReplies((prev) => ({
						...prev,
						[parentId]: (prev[parentId] || []).map((r) =>
							r._id === commentId
								? {
										...r,
										likes: data.data.likes,
										likesCount: data.data.likesCount,
								  }
								: r
						),
					}));
				} else {
					setComments((prev) =>
						prev.map((c) =>
							c._id === commentId
								? {
										...c,
										likes: data.data.likes,
										likesCount: data.data.likesCount,
								  }
								: c
						)
					);
				}
			}
		} catch (err) {
			console.error("Toggle comment like error:", err);
		}
	};

	const visibleComments = showAllComments ? comments : comments.slice(-1);
	const hiddenCount = comments.length - visibleComments.length;

	const renderComment = (
		comment: IComment,
		isReply = false,
		parentId?: string
	) => {
		const isLiked = comment.likes?.includes(user?._id || "");

		return (
			<div
				key={comment._id}
				className={`flex gap-2.5 ${isReply ? "ml-10 mt-3" : "mt-4"}`}
			>
				<div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
					<Image
						src={comment.author?.avatar || "/images/profile.png"}
						alt={comment.author ? `${comment.author.firstName}` : "User"}
						width={32}
						height={32}
						className="object-cover"
					/>
				</div>
				<div className="flex-1">
					<div className="relative inline-block max-w-full pb-4">
						<div className="bg-bg3 rounded-[14px] px-3 py-2">
							<h4 className="text-[13px] font-medium text-dark2">
								{comment.author
									? `${comment.author.firstName} ${comment.author.lastName}`
									: "Unknown"}
							</h4>

							<p className="text-[13px] text-dark4 mt-0.5">{comment.content}</p>
						</div>

						{comment.likesCount > 0 && (
							<button
								onClick={() =>
									setLikersModal({ type: "comment", id: comment._id })
								}
								className="absolute right-2 bottom-0 z-10 flex items-center gap-1 rounded-full bg-bg2/95 px-2.5 py-1 text-[12px] text-gray backdrop-blur-md shadow-[0_4px_10px_rgba(59,130,246,0.35)]"
							>
								<span className="flex items-center gap-0.5">
									<ThumbsUp className="w-4 h-4 text-primary font-medium" />
									<Heart className="w-4 h-4 text-red-500 font-medium" />
								</span>
								{comment.likesCount}
							</button>
						)}
					</div>

					<div className="flex items-center gap-0 mt-1 ml-1">
						<ul className="flex items-center gap-0 text-[12px]">
							<li>
								<button
									onClick={() =>
										toggleCommentLike(comment._id, isReply, parentId)
									}
									className={`font-medium transition-colors px-1 ${
										isLiked ? "text-primary" : "text-gray hover:text-primary"
									}`}
								>
									{isLiked ? "Liked" : "Like"}.
								</button>
							</li>
							{!isReply && (
								<li>
									<button
										onClick={() => {
											setReplyTo(replyTo === comment._id ? null : comment._id);
											setReplyText("");
										}}
										className="font-medium text-gray hover:text-primary px-1"
									>
										Reply.
									</button>
								</li>
							)}
							<li>
								<span className="text-gray px-1">Share</span>
							</li>
							<li>
								<span className="text-gray-light px-1">
									.{timeAgo(comment.createdAt)}
								</span>
							</li>
						</ul>
					</div>

					{!isReply &&
						comment.repliesCount > 0 &&
						!showReplies[comment._id] && (
							<button
								onClick={() => fetchReplies(comment._id)}
								className="text-[12px] text-primary mt-2 ml-1 hover:underline"
							>
								View {comment.repliesCount}{" "}
								{comment.repliesCount === 1 ? "reply" : "replies"}
							</button>
						)}

					{showReplies[comment._id] &&
						replies[comment._id]?.map((reply) =>
							renderComment(reply, true, comment._id)
						)}

					{replyTo === comment._id && (
						<div className="mt-3">
							<div className="relative">
								<div className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full overflow-hidden shrink-0">
									<Image
										src={user?.avatar || "/images/comment_img.png"}
										alt="You"
										width={28}
										height={28}
										className="object-cover w-full h-full"
									/>
								</div>

								<input
									type="text"
									value={replyText}
									onChange={(e) => setReplyText(e.target.value)}
									placeholder="Write a reply..."
									className="w-full h-9 pl-11 pr-16 bg-bg3 rounded-full text-[12px] text-dark2 border-0 focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-gray-400 placeholder:opacity-100 placeholder:font-medium placeholder:transition-opacity placeholder:duration-200 focus:placeholder:opacity-0"
									onKeyDown={(e) => {
										if (e.key === "Enter" && !e.shiftKey) {
											e.preventDefault();
											submitReply(comment._id);
										}
									}}
									autoFocus
								/>

								<div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2.5">
									<button
										type="button"
										className="text-gray hover:text-primary"
									>
										<Mic className="w-4 h-4 text-primary" />
									</button>

									<button
										type="button"
										className="text-gray hover:text-primary"
									>
										<ImageIcon className="w-4 h-4 text-primary" />
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		);
	};

	return (
		<div className="px-6 pt-4">
			<form onSubmit={submitComment} className="mb-2">
				<div className="relative">
					<div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full overflow-hidden shrink-0">
						<Image
							src={user?.avatar || "/images/comment_img.png"}
							alt="You"
							width={32}
							height={32}
							className="object-cover w-full h-full"
						/>
					</div>

					<input
						type="text"
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
						placeholder="Write a comment"
						className="w-full h-11 pl-14 pr-20 bg-bg3 rounded-full text-[13px] text-dark2 border-0 focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-gray-400 placeholder:opacity-100 placeholder:font-medium placeholder:transition-opacity placeholder:duration-200 focus:placeholder:opacity-0"
						disabled={isSubmitting}
					/>
					<div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2.5">
						<button type="button" className="text-gray hover:text-primary">
							<Mic className="w-4 h-4 text-primary" />
						</button>

						<button type="button" className="text-gray hover:text-primary">
							<ImageIcon className="w-4 h-4 text-primary" />
						</button>
					</div>
				</div>
			</form>

			{hiddenCount > 0 && !showAllComments && (
				<div className="ml-10 mb-1">
					<button
						onClick={() => setShowAllComments(true)}
						className="text-[13px] font-medium text-gray hover:text-primary hover:underline"
					>
						View {hiddenCount} previous comments
					</button>
				</div>
			)}

			<div className="mt-1">
				{visibleComments.map((comment) => renderComment(comment))}
			</div>

			{likersModal && (
				<LikersModal
					type={likersModal.type}
					id={likersModal.id}
					onClose={() => setLikersModal(null)}
				/>
			)}
		</div>
	);
}
