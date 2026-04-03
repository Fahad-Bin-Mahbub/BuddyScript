"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import {
	Image as ImageIcn,
	Video,
	CalendarSearch,
	Newspaper,
	Globe,
	Lock,
	ChevronDown,
	PenLine,
} from "lucide-react";

interface CreatePostProps {
	onPostCreated: () => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
	const { user } = useAuth();

	const [content, setContent] = useState("");
	const [visibility, setVisibility] = useState<"public" | "private">("public");
	const [open, setOpen] = useState(false);

	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	const fileInputRef = useRef<HTMLInputElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// 🔹 Close dropdown on outside click
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target as Node)
			) {
				setOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (file.size > 5 * 1024 * 1024) {
			setError("Image must be less than 5MB");
			return;
		}

		setImageFile(file);
		setError("");

		const reader = new FileReader();
		reader.onloadend = () => setImagePreview(reader.result as string);
		reader.readAsDataURL(file);
	};

	const removeImage = () => {
		setImageFile(null);
		setImagePreview(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const handleSubmit = async () => {
		if (!content.trim() || isSubmitting) return;

		setIsSubmitting(true);
		setError("");

		try {
			const formData = new FormData();
			formData.append("content", content.trim());
			formData.append("visibility", visibility);
			if (imageFile) formData.append("image", imageFile);

			const res = await fetch("/api/posts", {
				method: "POST",
				credentials: "include",
				body: formData,
			});

			const data = await res.json();
			if (!data.success) throw new Error(data.error);

			setContent("");
			removeImage();
			setVisibility("public");
			onPostCreated();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to create post");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="bg-bg2 rounded-md p-6 mb-4 shadow-sm">

			<div className="flex gap-3 mb-4">
				<div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
					<Image
						src={user?.avatar || "/images/txt_img.png"}
						alt="You"
						width={40}
						height={40}
						className="object-cover"
					/>
				</div>

				<div className="relative flex-1">

					<textarea
						value={content}
						onChange={(e) => setContent(e.target.value)}
						rows={2}
						id="post-content"
						className="w-full min-h-15 border-0 bg-transparent text-[14px] text-dark2 focus:outline-none resize-none px-2 py-2 peer"
					/>


					<label
						htmlFor="post-content"
						className={`absolute left-2 top-2 text-gray-400 pointer-events-none transition-all duration-200 peer-focus:opacity-0 peer-focus:-translate-y-1 ${
							content ? "opacity-0" : ""
						}`}
					>
						Write something ...
					</label>


					<div
						className={`absolute left-40 top-5 -translate-y-1/2 text-gray-400 pointer-events-none peer-focus:opacity-0 peer-focus:-translate-y-1 ${
							content ? "opacity-0" : ""
						}`}
					>
						<PenLine className="w-5 h-5" />
					</div>
				</div>
			</div>


			{imagePreview && (
				<div className="relative mb-4 flex justify-center rounded-md overflow-hidden bg-black/5 max-h-75">
					<Image
						src={imagePreview}
						alt="Preview"
						width={600}
						height={800}
						className="max-w-full h-auto max-h-75 object-contain"
					/>
					<button
						onClick={removeImage}
						className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition"
					>
						✕
					</button>
				</div>
			)}


			{error && (
				<div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-[12px]">
					{error}
				</div>
			)}

			<div className="flex flex-col gap-3 border-t bg-border3 border-border2 p-3 rounded-lg sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-wrap items-center gap-2 min-w-0">

					<button
						type="button"
						onClick={() => fileInputRef.current?.click()}
						className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs sm:px-3 sm:text-sm text-gray hover:text-primary hover:bg-bg3 rounded transition"
					>
						<ImageIcn className="w-5 h-5 shrink-0" />
						<span className="hidden sm:inline">Photo</span>
					</button>


					<button
						type="button"
						className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs sm:px-3 sm:text-sm text-gray hover:text-primary hover:bg-bg3 rounded transition"
					>
						<Video className="w-5 h-5 shrink-0" />
						<span className="hidden sm:inline">Video</span>
					</button>


					<button
						type="button"
						className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs sm:px-3 sm:text-[13px] text-gray hover:text-primary hover:bg-bg3 rounded transition-colors"
					>
						<CalendarSearch className="w-5 h-5 rounded-lg shrink-0" />
						<span className="hidden sm:inline">Event</span>
					</button>


					<button
						type="button"
						className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs sm:px-3 sm:text-[13px] text-gray hover:text-primary hover:bg-bg3 rounded transition-colors"
					>
						<Newspaper className="w-5 h-5 rounded-lg shrink-0" />
						<span className="hidden sm:inline">Article</span>
					</button>


					<div ref={dropdownRef} className="relative">
						<button
							type="button"
							onClick={() => setOpen(!open)}
							className="flex items-center justify-center gap-2 px-2 py-1.5 text-xs text-gray bg-bg3 border border-border2 rounded hover:border-primary transition"
						>
							{visibility === "public" ? (
								<>
									<Globe className="w-4 h-4 shrink-0" />
									<span className="hidden sm:inline">Public</span>
								</>
							) : (
								<>
									<Lock className="w-4 h-4 shrink-0" />
									<span className="hidden sm:inline">Private</span>
								</>
							)}
							<ChevronDown
								className={`w-3 h-3 transition ${open ? "rotate-180" : ""}`}
							/>
						</button>

						{open && (
							<div className="absolute left-0 sm:right-0 sm:left-auto mt-1 w-32 bg-bg3 border border-border2 rounded shadow-md z-50 overflow-hidden">
								<button
									onClick={() => {
										setVisibility("public");
										setOpen(false);
									}}
									className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-white/10 transition"
								>
									<Globe className="w-4 h-4" />
									Public
								</button>

								<button
									onClick={() => {
										setVisibility("private");
										setOpen(false);
									}}
									className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-white/10 transition"
								>
									<Lock className="w-4 h-4" />
									Private
								</button>
							</div>
						)}
					</div>
				</div>

				<button
					onClick={handleSubmit}
					disabled={!content.trim() || isSubmitting}
					className="w-full sm:w-auto px-5 py-2 bg-primary text-white text-sm font-medium rounded-md hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isSubmitting ? "Posting..." : "Post"}
				</button>
			</div>

			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				onChange={handleImageSelect}
				className="hidden"
			/>
		</div>
	);
}
