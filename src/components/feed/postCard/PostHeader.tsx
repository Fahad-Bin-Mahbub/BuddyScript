import React from "react";
import Image from "next/image";
import { IPost } from "@/types";
import { timeAgo } from "./postMeta";
import PostDropdownMenu from "./PostDropdownMenu";
import { EllipsisVertical } from "lucide-react";

interface PostHeaderProps {
	author: IPost["author"];
	createdAt: string;
	visibility: string;
	showDropdown: boolean;
	setShowDropdown: (value: boolean) => void;
	dropdownRef: React.RefObject<HTMLDivElement | null>;
	isSaved: boolean;
	notifOn: boolean;
	isOwner: boolean;
	isDeleting: boolean;
	onToggleSave: () => void;
	onToggleNotif: () => void;
	onHide: () => void;
	onEdit: () => void;
	onDelete: () => void;
}

export default function PostHeader({
	author,
	createdAt,
	visibility,
	showDropdown,
	setShowDropdown,
	dropdownRef,
	isSaved,
	notifOn,
	isOwner,
	isDeleting,
	onToggleSave,
	onToggleNotif,
	onHide,
	onEdit,
	onDelete,
}: PostHeaderProps) {
	return (
		<div className="flex items-center justify-between px-6 mb-3">
			<div className="flex items-center gap-3">
				<div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
					<Image
						src={author?.avatar || "/images/post_img.png"}
						alt={author ? `${author.firstName} ${author.lastName}` : "User"}
						width={40}
						height={40}
						className="object-cover"
					/>
				</div>

				<div>
					<h4 className="text-[14px] font-medium text-dark2">
						{author ? `${author.firstName} ${author.lastName}` : "Unknown"}
					</h4>
					<div className="text-[12px] text-gray">
						{timeAgo(createdAt)} .{" "}
						<span className="text-primary">
							{visibility === "private" ? "Private" : "Public"}
						</span>
					</div>
				</div>
			</div>

			<div className="relative" ref={dropdownRef}>
				<button
					onClick={() => setShowDropdown(!showDropdown)}
					className="p-2 hover:bg-bg3 rounded-full transition-colors"
				>
					<EllipsisVertical className="w-6 h-6 text-gray"/>
				</button>

				{showDropdown && (
					<PostDropdownMenu
						isSaved={isSaved}
						notifOn={notifOn}
						isOwner={isOwner}
						isDeleting={isDeleting}
						onToggleSave={onToggleSave}
						onToggleNotif={onToggleNotif}
						onHide={onHide}
						onEdit={onEdit}
						onDelete={onDelete}
					/>
				)}
			</div>
		</div>
	);
}
