"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface Story {
	id: string;
	name: string;
	image: string;
	miniAvatar: string;
	isOwn?: boolean;
}

const STORIES: Story[] = [
	{
		id: "own",
		name: "Your Story",
		image: "/images/card_ppl1.png",
		miniAvatar: "/images/profile.png",
		isOwn: true,
	},
	{
		id: "1",
		name: "Ryan Roslansky",
		image: "/images/card_ppl2.png",
		miniAvatar: "/images/mini_pic.png",
	},
	{
		id: "2",
		name: "Dylan Field",
		image: "/images/card_ppl3.png",
		miniAvatar: "/images/mini_pic.png",
	},
	{
		id: "3",
		name: "Steve Jobs",
		image: "/images/card_ppl4.png",
		miniAvatar: "/images/mini_pic.png",
	},
];

function StoryViewerModal({
	story,
	onClose,
	stories,
}: {
	story: Story;
	onClose: () => void;
	stories: Story[];
}) {
	const [currentIndex, setCurrentIndex] = useState(
		stories.findIndex((s) => s.id === story.id)
	);
	const [progress, setProgress] = useState(0);
	const current = stories[currentIndex];

	const goNext = useCallback(() => {
		if (currentIndex < stories.length - 1) {
			setCurrentIndex((i) => i + 1);
			setProgress(0);
		} else {
			onClose();
		}
	}, [currentIndex, stories.length, onClose]);

	const goPrev = () => {
		if (currentIndex > 0) {
			setCurrentIndex((i) => i - 1);
			setProgress(0);
		}
	};

	useEffect(() => {
		const duration = 5000;
		const interval = 50;
		const step = (interval / duration) * 100;

		const timer = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 100) {
					goNext();
					return 0;
				}
				return prev + step;
			});
		}, interval);

		return () => clearInterval(timer);
	}, [currentIndex, goNext]);

	useEffect(() => {
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
			if (e.key === "ArrowRight") goNext();
			if (e.key === "ArrowLeft") goPrev();
		};
		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, [currentIndex]);

	return (
		<div
			onClick={onClose}
			className="fixed inset-0 bg-black/90 z-100000 flex items-center justify-center"
		>
			<button
				onClick={onClose}
				className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center cursor-pointer z-10"
			>
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
					<path
						stroke="#fff"
						strokeLinecap="round"
						strokeWidth="2"
						d="M6 6l12 12M18 6L6 18"
					/>
				</svg>
			</button>

			{currentIndex > 0 && (
				<button
					onClick={(e) => {
						e.stopPropagation();
						goPrev();
					}}
					className="absolute left-[max(20px,calc(50%-230px))] top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 flex items-center justify-center cursor-pointer z-10"
				>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
						<path
							stroke="#fff"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</button>
			)}

			{currentIndex < stories.length - 1 && (
				<button
					onClick={(e) => {
						e.stopPropagation();
						goNext();
					}}
					className="absolute right-[max(20px,calc(50%-230px))] top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 flex items-center justify-center cursor-pointer z-10"
				>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
						<path
							stroke="#fff"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</button>
			)}

			<div
				onClick={(e) => e.stopPropagation()}
				className="w-full max-w-100 h-[85vh] max-h-175 rounded-2xl overflow-hidden relative bg-[#1a1a2e] shadow-[0_25px_50px_rgba(0,0,0,0.5)]"
			>
				<div className="absolute top-2 left-3 right-3 flex gap-1 z-5">
					{stories.map((_, idx) => (
						<div
							key={idx}
							className="flex-1 h-0.75 bg-white/30 rounded overflow-hidden"
						>
							<div
								className={`h-full bg-white rounded ${
									idx === currentIndex ? "" : "transition-all duration-300"
								}`}
								style={{
									width:
										idx < currentIndex
											? "100%"
											: idx === currentIndex
											? `${progress}%`
											: "0%",
								}}
							/>
						</div>
					))}
				</div>

				<div className="absolute top-0 left-0 right-0 pt-6 pb-4 px-4 bg-linear-to-b from-black/60 to-transparent flex items-center gap-2.5 z-4">
					<div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shrink-0">
						<Image
							src={current.isOwn ? "/images/profile.png" : current.miniAvatar}
							alt={current.name}
							width={36}
							height={36}
							className="w-full h-full object-cover"
						/>
					</div>
					<div>
						<div className="text-white text-sm font-semibold m-0">
							{current.name}
						</div>
						<div className="text-white/60 text-[11px] m-0">2h ago</div>
					</div>
				</div>

				<Image
					src={current.image}
					alt={current.name}
					width={400}
					height={700}
					className="w-full h-full object-cover"
					priority
				/>

				<div
					onClick={(e) => {
						e.stopPropagation();
						goPrev();
					}}
					className="absolute top-0 left-0 w-[30%] h-full z-3 cursor-pointer"
				/>
				<div
					onClick={(e) => {
						e.stopPropagation();
						goNext();
					}}
					className="absolute top-0 right-0 w-[30%] h-full z-3 cursor-pointer"
				/>
			</div>
		</div>
	);
}

export default function StoriesSection() {
	const [viewingStory, setViewingStory] = useState<Story | null>(null);

	return (
		<>
			<div className="hidden lg:block mb-4">
				<div className=" rounded-md p-4 shadow-sm relative">
					<button
						type="button"
						className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-md hover:opacity-90 transition-opacity"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="9"
							height="8"
							fill="none"
							viewBox="0 0 9 8"
						>
							<path
								fill="#fff"
								d="M8 4l.366-.341.318.341-.318.341L8 4zm-7 .5a.5.5 0 010-1v1zM5.566.659l2.8 3-.732.682-2.8-3L5.566.66zm2.8 3.682l-2.8 3-.732-.682 2.8-3 .732.682zM8 4.5H1v-1h7v1z"
							/>
						</svg>
					</button>

					<div className="grid grid-cols-4 gap-5">
						{STORIES.map((story) => (
							<div
								key={story.id}
								className="relative rounded-xl overflow-hidden h-40 cursor-pointer group"
								onClick={() => setViewingStory(story)}
							>
								<div className="relative group">
									<Image
										src={story.image}
										alt={story.name}
										width={200}
										height={200}
										className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
									/>

									<div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 group-hover:via-black/60 transition-all duration-300" />
								</div>
								{story.isOwn ? (
									<div className="absolute bottom-0 left-0 right-0">
										<div className="relative bg-slate-900 backdrop-blur-sm pt-6 pb-3 flex flex-col items-center rounded-t-3xl">
											<button className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md border-2 z-10">
												<svg
													width="12"
													height="12"
													viewBox="0 0 10 10"
													fill="none"
												>
													<path
														stroke="#fff"
														strokeLinecap="round"
														strokeWidth="1.5"
														d="M.5 4.884h9M4.884 9.5v-9"
													/>
												</svg>
											</button>

											<div className="text-white text-xs font-medium mt-3">
												Your Story
											</div>
										</div>
									</div>
								) : (
									<>
										<div className="absolute top-2.5 right-2.5">
											<Image
												src={story.miniAvatar}
												alt={story.name}
												width={32}
												height={32}
												className="w-8 h-8 rounded-full border-2 border-white object-cover"
											/>
										</div>
										<div
											className="absolute bottom-0 left-0 right-0 p-2.5"
											style={{
												background:
													"linear-gradient(transparent, rgba(0,0,0,0.6))",
											}}
										>
											<div className="text-white text-[12px] font-medium text-center">
												{story.name}
											</div>
										</div>
									</>
								)}
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="lg:hidden mb-4">
				<div className="overflow-x-auto no-scrollbar px-3">
					<ul className="flex gap-3 snap-x snap-mandatory pb-2">
						{STORIES.map((story) => (
							<li
								key={story.id}
								className="shrink-0 snap-start cursor-pointer"
								onClick={() => setViewingStory(story)}
							>
								<div className="relative w-20 h-30 rounded-2xl overflow-hidden shadow-sm">
									<Image
										src={
											story.isOwn
												? "/images/mobile_story_img.png"
												: story.image || "/images/mobile_story_img1.png"
										}
										alt={story.name}
										width={104}
										height={164}
										className="w-full h-full object-cover"
									/>

									<div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/10" />

									{story.isOwn ? (
										<>
											<div className="absolute top-3 left-3">
												<button
													type="button"
													className="w-5 h-5 bg-primary rounded-full flex items-center justify-center border-2 border-white shadow-md"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="12"
														height="12"
														fill="none"
														viewBox="0 0 12 12"
													>
														<path
															stroke="#fff"
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth="1.5"
															d="M6 2.5v7M2.5 6h7"
														/>
													</svg>
												</button>
											</div>

											<div className="absolute bottom-3 left-3 right-3">
												<div className="text-white text-xs font-semibold leading-tight">
													Your story
												</div>
											</div>
										</>
									) : (
										<>
											<div className="absolute top-3 left-3">
												<div className="p-0.5 rounded-full bg-primary">
													<Image
														src={story.miniAvatar}
														alt={story.name}
														width={30}
														height={30}
														className="w-5 h-5 rounded-full border-2 border-white object-cover"
													/>
												</div>
											</div>

											<div className="absolute bottom-3 left-3 right-3">
												<div className="text-white text-[9px] font-medium leading-tight line-clamp-2">
													{story.name}
												</div>
											</div>
										</>
									)}
								</div>
							</li>
						))}
					</ul>
				</div>
			</div>

			{viewingStory && (
				<StoryViewerModal
					story={viewingStory}
					stories={STORIES}
					onClose={() => setViewingStory(null)}
				/>
			)}
		</>
	);
}
