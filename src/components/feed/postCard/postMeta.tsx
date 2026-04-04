import React from "react";

export function timeAgo(dateStr: string): string {
	const now = new Date();
	const date = new Date(dateStr);
	const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (seconds < 60) return "just now";

	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes} minute ago`;

	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;

	const days = Math.floor(hours / 24);
	if (days < 30) return `${days}d ago`;

	return date.toLocaleDateString();
}

export const REACTIONS = [
	{ type: "like", emoji: "👍", label: "Like" },
	{ type: "love", emoji: "❤️", label: "Love" },
	{ type: "haha", emoji: "😂", label: "Haha" },
	{ type: "wow", emoji: "😮", label: "Wow" },
	{ type: "sad", emoji: "😢", label: "Sad" },
	{ type: "angry", emoji: "😡", label: "Angry" },
] as const;

export function LikeIconBW() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
		</svg>
	);
}
