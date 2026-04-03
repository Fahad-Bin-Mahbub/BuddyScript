"use client";

import React, { useState, useEffect, useCallback } from "react";
import FeedHeader from "@/components/feed/FeedHeader";
import MobileHeader from "@/components/feed/MobileHeader";
import LeftSidebar from "@/components/feed/LeftSidebar";
import RightSidebar from "@/components/feed/RightSidebar";
import CreatePost from "@/components/feed/CreatePost";
import ThemeSwitcher from "@/components/feed/ThemeSwitcher";
import { useAuth } from "@/context/AuthContext";
import { IPost } from "@/types";
import { MOCK_NOTIFICATIONS } from "@/components/feed/feedHeader/header.data";
export default function FeedPage() {
	const { user, loading: authLoading } = useAuth();
	const [posts, setPosts] = useState<IPost[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [nextCursor, setNextCursor] = useState<string | undefined>();
	const [hasMore, setHasMore] = useState(true);
	const [showNotifications, setShowNotifications] = useState(false);
	const [showNotifyMenu, setShowNotifyMenu] = useState(false);
	const [notifyFilter, setNotifyFilter] = useState<"all" | "unread">("all");
	const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
	const fetchPosts = useCallback(async (cursor?: string) => {
		try {
			const url = cursor
				? `/api/posts?cursor=${encodeURIComponent(cursor)}`
				: "/api/posts";
			const res = await fetch(url, { credentials: "include" });
			const data = await res.json();

			if (data.success) {
				if (cursor) {
					setPosts((prev) => [...prev, ...data.data]);
				} else {
					setPosts(data.data);
				}
				setNextCursor(data.nextCursor);
				setHasMore(data.hasMore);
			}
		} catch (err) {
			console.error("Fetch posts error:", err);
		} finally {
			setLoading(false);
			setLoadingMore(false);
		}
	}, []);

	useEffect(() => {
		if (!authLoading && user) {
			fetchPosts();
		}
	}, [authLoading, user, fetchPosts]);

	const handleLoadMore = () => {
		if (!loadingMore && hasMore && nextCursor) {
			setLoadingMore(true);
			fetchPosts(nextCursor);
		}
	};

	const handlePostCreated = () => {
		setLoading(true);
		fetchPosts();
	};

	const handlePostDeleted = () => {
		fetchPosts();
	};

	useEffect(() => {
		const handleScroll = () => {
			if (
				window.innerHeight + document.documentElement.scrollTop >=
				document.documentElement.offsetHeight - 500
			) {
				if (hasMore && !loadingMore && nextCursor) {
					handleLoadMore();
				}
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [hasMore, loadingMore, nextCursor]);

	if (authLoading) {
		return (
			<div className="min-h-screen bg-bg1 flex items-center justify-center">
				<svg
					className="animate-spin h-10 w-10 text-primary"
					viewBox="0 0 24 24"
				>
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="4"
						fill="none"
					/>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
					/>
				</svg>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-bg1 flex flex-col">
			<ThemeSwitcher />

			<FeedHeader
				showNotifications={showNotifications}
				setShowNotifications={setShowNotifications}
				showNotifyMenu={showNotifyMenu}
				setShowNotifyMenu={setShowNotifyMenu}
				notifyFilter={notifyFilter}
				setNotifyFilter={setNotifyFilter}
				notifications={notifications}
				setNotifications={setNotifications}
			/>
			<MobileHeader
				showNotifications={showNotifications}
				setShowNotifications={setShowNotifications}
				showNotifyMenu={showNotifyMenu}
				setShowNotifyMenu={setShowNotifyMenu}
				notifyFilter={notifyFilter}
				setNotifyFilter={setNotifyFilter}
				notifications={notifications}
				setNotifications={setNotifications}
			/>

			<div className="container mx-auto px-4 lg:px-12 _custom_container py-5 flex-1">
				<div className="flex gap-7">
					<div className="hidden lg:block w-[23%] shrink-0">
						<div className="sticky top-24 h-[calc(100vh-70px)] overflow-hidden">
							<LeftSidebar />
						</div>
					</div>

					<div className="flex-1 min-w-0 lg:max-w-[54%]">
						
						<CreatePost onPostCreated={handlePostCreated} />

		
					</div>

					<div className="hidden lg:block w-[23%] shrink-0">
						<div className="sticky top-24 h-[calc(100vh-70px)] overflow-hidden">
							<RightSidebar />
						</div>
					</div>
				</div>
			</div>

			<div className="lg:hidden h-16" />
		</div>
	);
}
