"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BellRing, House, Users, MessageCircle, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import MobileNotificationsDrawer from "./MobileNotificationsDrawer";
import { NotificationItem } from "./feedHeader/header.types";

type Props = {
	showNotifications: boolean;
	setShowNotifications: (value: boolean) => void;
	showNotifyMenu: boolean;
	setShowNotifyMenu: (value: boolean) => void;
	notifyFilter: "all" | "unread";
	setNotifyFilter: (value: "all" | "unread") => void;
	notifications: NotificationItem[];
	setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
};

export default function MobileHeader({
	showNotifications,
	setShowNotifications,
	showNotifyMenu,
	setShowNotifyMenu,
	notifyFilter,
	setNotifyFilter,
	notifications,
	setNotifications,
}: Props) {
	const { user, logout } = useAuth();

	const unreadCount = notifications.filter((n) => !n.read).length;

	return (
		<>

			<div className="lg:hidden bg-bg2 shadow-sm sticky top-0 z-50">
				<div className="container mx-auto px-4">
					<div className="flex items-center justify-between py-3">
						<Link href="/feed">
							<Image
								src="/images/logo.svg"
								alt="Buddy Script"
								width={120}
								height={30}
								className="w-30 h-auto"
							/>
						</Link>

						<div className="flex items-center gap-3">
							<button className="p-2" onClick={logout}>
								<LogOut className="w-6 h-6 text-gray"/>
							</button>

							<div className="w-8 h-8 rounded-full overflow-hidden">
								<Image
									src={user?.avatar || "/images/profile.png"}
									alt="Profile"
									width={32}
									height={32}
									className="object-cover"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>


			<div className="lg:hidden fixed bottom-0 left-0 right-0 z-999 bg-bg2 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] py-2">
				<div className="flex items-center justify-around">
					<Link
						href="/feed"
						className="flex flex-col items-center gap-1 text-primary"
					>
						<House className="w-6 h-6" />
					</Link>

					<button
						type="button"
						className="relative flex flex-col items-center gap-1 text-gray"
						onClick={() => {
							setShowNotifications(true);
							setShowNotifyMenu(false);
						}}
					>
						<BellRing className="w-6 h-6" />
						{unreadCount > 0 && (
							<span className="absolute -top-1 right-0 min-w-4 h-4 px-1 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
								{unreadCount}
							</span>
						)}
					</button>

					<button
						type="button"
						className="flex flex-col items-center gap-1 text-gray opacity-50"
					>
						<Users className="w-6 h-6" />
					</button>

					<button
						type="button"
						className="flex flex-col items-center gap-1 text-gray opacity-50"
					>
						<MessageCircle className="w-6 h-6" />
					</button>
				</div>
			</div>

			<MobileNotificationsDrawer
				open={showNotifications}
				onClose={() => setShowNotifications(false)}
				showNotifyMenu={showNotifyMenu}
				setShowNotifyMenu={setShowNotifyMenu}
				notifyFilter={notifyFilter}
				setNotifyFilter={setNotifyFilter}
				notifications={notifications}
				setNotifications={setNotifications}
			/>
		</>
	);
}
