"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

type Liker = {
	_id: string;
	name: string;
	avatar?: string;
};

interface PostStatsProps {
	postId: string;
	likesCount: number;
	commentsCount: number;
	onOpenLikers: () => void;
	onToggleComments: () => void;
}

export default function PostStats({
	postId,
	likesCount,
	commentsCount,
	onOpenLikers,
	onToggleComments,
}: PostStatsProps) {
	const [likers, setLikers] = useState<Liker[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchLikers = async () => {
			try {
				const res = await fetch(`/api/posts/${postId}/like`, {
					credentials: "include",
				});
				const data = await res.json();

				if (data.success) {
					setLikers(data.data || []);
				}
			} catch (err) {
				console.error("Fetch likers error:", err);
			} finally {
				setLoading(false);
			}
		};

		if (likesCount > 0) {
			fetchLikers();
		} else {
			setLoading(false);
		}
	}, [postId, likesCount]);

	const visibleLikers = likers.slice(0, 3);
	const extraCount = likesCount > 3 ? likesCount - 3 : 0;

	return (
		<div className="flex items-center justify-between px-6 mb-4">
			<div className="flex items-center gap-1">
				{likesCount > 0 && (
					<button
						onClick={onOpenLikers}
						className="flex items-center gap-2 hover:underline"
					>
						<div className="flex items-center -space-x-2">
							{!loading &&
								visibleLikers.map((liker) => (
									<div
										key={liker._id}
										className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-white bg-gray-200"
									>
										{liker.avatar ? (
											<Image
												src={liker.avatar}
												alt={liker.name}
												fill
												className="object-cover"
											/>
										) : (
											<div className="w-full h-full flex items-center justify-center text-[10px] font-medium text-gray-600">
												{liker.name.charAt(0).toUpperCase()}
											</div>
										)}
									</div>
								))}

							{extraCount > 0 && (
								<div className="w-6 h-6 rounded-full border-2 border-white bg-bg flex items-center justify-center text-[10px] font-medium text-gray">
									+{extraCount}
								</div>
							)}
						</div>

						<span className="text-[13px] text-gray">
							{likesCount}
						</span>
					</button>
				)}
			</div>

			<div className="flex items-center gap-3">
				<button
					onClick={onToggleComments}
					className="text-[13px] text-gray hover:text-primary hover:underline"
				>
					<span className="font-medium">{commentsCount}</span> Comment
				</button>

				<span className="text-[13px] text-gray">
					<span className="font-medium">122</span> Share
				</span>
			</div>
		</div>
	);
}
