import React from "react";
import Image from "next/image";
import { IPost } from "@/types";

interface EditPostModalProps {
	isOpen: boolean;
	author: IPost["author"];
	visibility: string;
	editContent: string;
	setEditContent: (value: string) => void;
	editImagePreview: string | null;
	isEditing: boolean;
	fileInputRef: React.RefObject<HTMLInputElement | null>;
	onClose: () => void;
	onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onRemoveImage: () => void;
	onSubmit: () => void;
}

export default function EditPostModal({
	isOpen,
	author,
	visibility,
	editContent,
	setEditContent,
	editImagePreview,
	isEditing,
	fileInputRef,
	onClose,
	onImageChange,
	onRemoveImage,
	onSubmit,
}: EditPostModalProps) {
	if (!isOpen) return null;

	return (
		<div
			style={{
				position: "fixed",
				inset: 0,
				background: "rgba(0,0,0,0.5)",
				zIndex: 99999,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: "16px",
			}}
			onClick={onClose}
		>
			<div
				className="bg-bg2 rounded-xl w-full max-w-125 shadow-xl"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-center justify-between p-4 border-b border-border2">
					<h3 className="text-[16px] font-semibold text-dark2">
						Edit Post
					</h3>
					<button
						onClick={onClose}
						className="w-8 h-8 rounded-full hover:bg-bg3 flex items-center justify-center"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="none"
							viewBox="0 0 24 24"
						>
							<path
								stroke="var(--color-gray)"
								strokeLinecap="round"
								strokeWidth="2"
								d="M6 6l12 12M18 6L6 18"
							/>
						</svg>
					</button>
				</div>

				<div className="p-4">
					<div className="flex items-center gap-3 mb-4">
						<div className="w-10 h-10 rounded-full overflow-hidden">
							<Image
								src={author?.avatar || "/images/profile.png"}
								alt=""
								width={40}
								height={40}
								className="object-cover"
							/>
						</div>
						<div>
							<h4 className="text-[14px] font-medium text-dark2">
								{author ? `${author.firstName} ${author.lastName}` : "User"}
							</h4>
							<span className="text-[12px] text-gray">
								{visibility}
							</span>
						</div>
					</div>

					<textarea
						value={editContent}
						onChange={(e) => setEditContent(e.target.value)}
						className="w-full min-h-30 border border-border2 rounded-md p-3 text-[14px] text-dark2 bg-bg3 focus:outline-none focus:border-primary resize-none"
					/>

					<div className="mt-4">
						{editImagePreview ? (
							<div className="rounded-[10px] overflow-hidden border border-border2 bg-bg3">
								<Image
									src={editImagePreview}
									alt="Edit preview"
									width={700}
									height={400}
									className="w-full h-auto max-h-70 object-cover"
								/>
								<div className="p-3 flex items-center justify-center gap-2">
									<button
										type="button"
										onClick={() => fileInputRef.current?.click()}
										className="px-3 py-2 text-[13px] font-medium rounded-md bg-primary text-white hover:opacity-90"
									>
										Replace Image
									</button>
									<button
										type="button"
										onClick={onRemoveImage}
										className="px-3 py-2 text-[13px] font-medium rounded-md border border-red-200 text-red-500 hover:bg-red-50"
									>
										Remove Image
									</button>
								</div>
							</div>
						) : (
							<button
								type="button"
								onClick={() => fileInputRef.current?.click()}
								className="w-full border border-dashed border-border2 rounded-[10px] p-4 text-[13px] text-primary hover:bg-bg3 transition-colors"
							>
								Add Image
							</button>
						)}

						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							className="hidden"
							onChange={onImageChange}
						/>
					</div>
				</div>

				<div className="px-4 pb-4">
					<button
						onClick={onSubmit}
						disabled={!editContent.trim() || isEditing}
						className="w-full py-2.5 bg-primary text-white text-[14px] font-medium rounded-md hover:opacity-90 disabled:opacity-50"
					>
						{isEditing ? "Saving..." : "Save Changes"}
					</button>
				</div>
			</div>
		</div>
	);
}
