"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import HeaderSearch from "./feedHeader/HeaderSearch";
import HeaderNav from "./feedHeader/HeaderNav";
import ProfileDropdown from "./feedHeader/ProfileDropdown";
import { MOCK_NOTIFICATIONS } from "./feedHeader/header.data";
import { ActiveTab } from "./feedHeader/header.types";
import { useClickOutside } from "@/hooks/useClickOutside";

export default function FeedHeader() {
	const { user, logout } = useAuth();

	const [showProfileDrop, setShowProfileDrop] = useState(false);
	const [showNotifications, setShowNotifications] = useState(false);
	const [showNotifyMenu, setShowNotifyMenu] = useState(false);
	const [notifyFilter, setNotifyFilter] = useState<"all" | "unread">("all");
	const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
	const [activeTab, setActiveTab] = useState<ActiveTab>("home");

	const profileRef = useRef<HTMLDivElement>(null);
	const notifyRef = useRef<HTMLDivElement>(null);

	useClickOutside(profileRef, () => setShowProfileDrop(false));
	useClickOutside(notifyRef, () => {
		setShowNotifications(false);
		setShowNotifyMenu(false);
	});

	return (
		<nav className="bg-bg2 shadow-sm px-17 py-3.5 hidden lg:block sticky top-0 z-50">
			<div className="container mx-auto px-4 _custom_container">
				<div className="flex items-center justify-between">
					<div className="shrink-0">
						<Link href="/feed">
							<Image
								src="/images/logo.svg"
								alt="Buddy Script"
								width={150}
								height={35}
								className="w-37 h-auto"
							/>
						</Link>
					</div>

					<HeaderSearch />

					<div ref={notifyRef}>
						<HeaderNav
							activeTab={activeTab}
							setActiveTab={setActiveTab}
							showNotifications={showNotifications}
							setShowNotifications={setShowNotifications}
							showNotifyMenu={showNotifyMenu}
							setShowNotifyMenu={setShowNotifyMenu}
							notifyFilter={notifyFilter}
							setNotifyFilter={setNotifyFilter}
							notifications={notifications}
							setNotifications={setNotifications}
						/>
					</div>

					<div ref={profileRef}>
						<ProfileDropdown
							user={user}
							logout={logout}
							open={showProfileDrop}
							setOpen={setShowProfileDrop}
						/>
					</div>
				</div>
			</div>
		</nav>
	);
}