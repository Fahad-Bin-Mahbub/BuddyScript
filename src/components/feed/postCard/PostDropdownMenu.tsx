import React from "react";

interface PostDropdownMenuProps {
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

export default function PostDropdownMenu({
	isSaved,
	notifOn,
	isOwner,
	isDeleting,
	onToggleSave,
	onToggleNotif,
	onHide,
	onEdit,
	onDelete,
}: PostDropdownMenuProps) {
	return (
		<div className="absolute top-full right-0 mt-1 w-55 bg-bg2 rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.15)] z-50">
			<ul className="py-1">
				<li>
					<button
						onClick={onToggleSave}
						className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-dark4 hover:bg-bg3 transition-colors"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							fill="none"
							viewBox="0 0 18 18"
						>
							<path
								stroke="#1890FF"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="1.2"
								d="M14.25 15.75L9 12l-5.25 3.75v-12a1.5 1.5 0 011.5-1.5h7.5a1.5 1.5 0 011.5 1.5v12z"
							/>
						</svg>
						{isSaved ? "Unsave Post" : "Save Post"}
					</button>
				</li>

				<li>
					<button
						onClick={onToggleNotif}
						className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-dark4 hover:bg-bg3 transition-colors"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="20"
							fill="none"
							viewBox="0 0 20 22"
						>
							<path
								fill="#377DFF"
								fillRule="evenodd"
								d="M7.547 19.55c.533.59 1.218.915 1.93.915.714 0 1.403-.324 1.938-.916a.777.777 0 011.09-.056c.318.284.344.77.058 1.084-.832.917-1.927 1.423-3.086 1.423h-.002c-1.155-.001-2.248-.506-3.077-1.424a.762.762 0 01.057-1.083.774.774 0 011.092.057zM9.527 0c4.58 0 7.657 3.543 7.657 6.85 0 1.702.436 2.424.899 3.19.457.754.976 1.612.976 3.233-.36 4.14-4.713 4.478-9.531 4.478-4.818 0-9.172-.337-9.528-4.413-.003-1.686.515-2.544.973-3.299l.161-.27c.398-.679.737-1.417.737-2.918C1.871 3.543 4.948 0 9.528 0z"
								clipRule="evenodd"
							/>
						</svg>
						{notifOn ? "Turn Off Notification" : "Turn On Notification"}
					</button>
				</li>

				<li>
					<button
						onClick={onHide}
						className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-dark4 hover:bg-bg3 transition-colors"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							fill="none"
							viewBox="0 0 18 18"
						>
							<path
								stroke="#1890FF"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="1.2"
								d="M14.25 2.25H3.75a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V3.75a1.5 1.5 0 00-1.5-1.5zM6.75 6.75l4.5 4.5M11.25 6.75l-4.5 4.5"
							/>
						</svg>
						Hide
					</button>
				</li>

				{isOwner && (
					<li>
						<button
							onClick={onEdit}
							className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-dark4 hover:bg-bg3 transition-colors"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
								fill="none"
								viewBox="0 0 18 18"
							>
								<path
									stroke="#1890FF"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="1.2"
									d="M8.25 3H3a1.5 1.5 0 00-1.5 1.5V15A1.5 1.5 0 003 16.5h10.5A1.5 1.5 0 0015 15V9.75"
								/>
								<path
									stroke="#1890FF"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="1.2"
									d="M13.875 1.875a1.591 1.591 0 112.25 2.25L9 11.25 6 12l.75-3 7.125-7.125z"
								/>
							</svg>
							Edit Post
						</button>
					</li>
				)}

				{isOwner && (
					<li>
						<button
							onClick={onDelete}
							disabled={isDeleting}
							className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
								fill="none"
								viewBox="0 0 18 18"
							>
								<path
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="1.2"
									d="M2.25 4.5h13.5M6 4.5V3a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0112 3v1.5m2.25 0V15a1.5 1.5 0 01-1.5 1.5h-7.5a1.5 1.5 0 01-1.5-1.5V4.5h10.5zM7.5 8.25v4.5M10.5 8.25v4.5"
								/>
							</svg>
							{isDeleting ? "Deleting..." : "Delete Post"}
						</button>
					</li>
				)}
			</ul>
		</div>
	);
}
