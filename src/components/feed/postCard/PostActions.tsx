import React from "react";
import { LikeIconBW, REACTIONS } from "./postMeta";

interface PostActionsProps {
	currentReaction: string | null;
	showReactionPicker: boolean;
	reactionZoneRef: React.RefObject<HTMLDivElement | null>;
	onMouseEnterReactionZone: () => void;
	onMouseLeaveReactionZone: () => void;
	onPickReaction: (reactionType: string) => void;
	onReactionClick: () => void;
	onToggleComments: () => void;
}

export default function PostActions({
	currentReaction,
	showReactionPicker,
	reactionZoneRef,
	onMouseEnterReactionZone,
	onMouseLeaveReactionZone,
	onPickReaction,
	onReactionClick,
	onToggleComments,
}: PostActionsProps) {
	const reactionInfo =
		REACTIONS.find((r) => r.type === currentReaction) || null;

	return (
		<div className="flex items-center border-t border-b border-border2 mx-6">
			<div
				ref={reactionZoneRef}
				className="flex-1 relative"
				onMouseEnter={onMouseEnterReactionZone}
				onMouseLeave={onMouseLeaveReactionZone}
			>
				{showReactionPicker && (
					<div
						style={{
							position: "absolute",
							bottom: "100%",
							left: "50%",
							transform: "translateX(-50%)",
							paddingBottom: "8px",
							zIndex: 50,
						}}
					>
						<div
							className="bg-bg2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] px-2 py-1.5 flex gap-0.5"
							style={{ whiteSpace: "nowrap" }}
						>
							{REACTIONS.map((r) => (
								<button
									key={r.type}
									onClick={() => onPickReaction(r.type)}
									className="w-9 h-9 flex items-center justify-center rounded-full transition-transform duration-200 hover:scale-[1.35] hover:bg-bg3"
									style={{
										transform:
											currentReaction === r.type ? "scale(1.2)" : undefined,
									}}
									title={r.label}
								>
									<span className="text-[22px]">{r.emoji}</span>
								</button>
							))}
						</div>
					</div>
				)}

				<button
					onClick={onReactionClick}
					className={`w-full flex items-center justify-center gap-1.5 py-2.5 text-[13px] font-medium transition-colors ${
						currentReaction
							? "text-primary"
							: "text-gray hover:text-primary"
					}`}
				>
					{reactionInfo ? (
						<>
							<span className="text-[18px]">{reactionInfo.emoji}</span>
							{reactionInfo.label}
						</>
					) : (
						<>
							<LikeIconBW />
							Like
						</>
					)}
				</button>
			</div>

			<button
				onClick={onToggleComments}
				className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[13px] font-medium text-gray hover:text-primary transition-colors"
			>
				<svg
					className="opacity-60"
					xmlns="http://www.w3.org/2000/svg"
					width="21"
					height="21"
					fill="none"
					viewBox="0 0 21 21"
				>
					<path
						stroke="currentColor"
						d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5z"
					/>
					<path
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M6.938 9.313h7.125M10.5 14.063h3.563"
					/>
				</svg>
				Comment
			</button>

			<button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[13px] font-medium text-gray hover:text-primary transition-colors">
				<svg
					className="opacity-60"
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="21"
					fill="none"
					viewBox="0 0 24 21"
				>
					<path
						stroke="currentColor"
						strokeLinejoin="round"
						d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z"
					/>
				</svg>
				Share
			</button>
		</div>
	);
}
