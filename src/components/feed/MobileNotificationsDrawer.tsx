"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { X, MoreVertical } from "lucide-react";
import { NotificationItem } from "./feedHeader/header.types";

type Props = {
	open: boolean;
	onClose: () => void;
	showNotifyMenu: boolean;
	setShowNotifyMenu: (value: boolean) => void;
	notifyFilter: "all" | "unread";
	setNotifyFilter: (value: "all" | "unread") => void;
	notifications: NotificationItem[];
	setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
};

export default function MobileNotificationsDrawer({
	open,
	onClose,
	showNotifyMenu,
	setShowNotifyMenu,
	notifyFilter,
	setNotifyFilter,
	notifications,
	setNotifications,
}: Props) {
	const filteredNotifications =
		notifyFilter === "unread"
			? notifications.filter((n) => !n.read)
			: notifications;

	const markAllRead = () => {
		setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
		setShowNotifyMenu(false);
	};

	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
			setShowNotifyMenu(false);
		}

		return () => {
			document.body.style.overflow = "";
		};
	}, [open, setShowNotifyMenu]);

	if (!open) return null;

	return (
		<>

			<div
				className="lg:hidden fixed inset-0 bg-black/40 z-1000"
				onClick={onClose}
			/>


			<div
				className="lg:hidden fixed inset-x-0 bottom-0 z-1001 rounded-t-2xl bg-bg2 shadow-[0_-8px_30px_rgba(0,0,0,0.15)] max-h-[40vh] flex flex-col"
				onClick={(e) => e.stopPropagation()}
			>
				

				<div className="flex justify-center pt-3 pb-2">
					<div className="w-12 h-1.5 rounded-full bg-gray-300" />
				</div>

				<div className="flex items-center justify-between px-4 pb-2">
					<h4 className="text-[18px] font-semibold text-dark2">
						Notifications
					</h4>

					<div className="flex items-center gap-2">
						<div className="relative">
							<button
								type="button"
								onClick={() => setShowNotifyMenu(!showNotifyMenu)}
								className="p-2 rounded-full hover:bg-bg3"
							>
								<MoreVertical className="w-5 h-5 text-gray" />
							</button>

							{showNotifyMenu && (
								<div className="absolute top-full right-0 mt-1 w-48 bg-bg2 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] overflow-hidden">
									<button
										type="button"
										onClick={markAllRead}
										className="w-full text-left px-4 py-3 text-sm text-dark4 hover:bg-bg3"
									>
										Mark all as read
									</button>
									<button
										type="button"
										className="w-full text-left px-4 py-3 text-sm text-dark4 hover:bg-bg3"
									>
										Notification settings
									</button>
									<button
										type="button"
										className="w-full text-left px-4 py-3 text-sm text-dark4 hover:bg-bg3"
									>
										Open Notifications
									</button>
								</div>
							)}
						</div>

						<button
							type="button"
							onClick={onClose}
							className="p-2 rounded-full hover:bg-bg3"
						>
							<X className="w-5 h-5 text-gray" />
						</button>
					</div>
				</div>

				<div className="flex gap-2 px-4 pb-3">
					<button
						type="button"
						onClick={() => setNotifyFilter("all")}
						className={`px-4 py-2 rounded-lg text-[13px] border border-primary font-medium transition-colors ${
							notifyFilter === "all"
								? "text-primary"
								: "bg-bg3 text-gray"
						}`}
					>
						All
					</button>

					<button
						type="button"
						onClick={() => setNotifyFilter("unread")}
						className={`px-4 py-2 rounded-lg text-[13px] border border-primary font-medium transition-colors ${
							notifyFilter === "unread"
								? "text-primary"
								: "bg-bg3 text-gray"
						}`}
					>
						Unread
					</button>
				</div>

				<div className="flex-1 overflow-y-auto">
					{filteredNotifications.map((notif) => (
						<div
							key={notif.id}
							className={`flex items-start gap-3 px-4 py-4 border-b border-black/5 ${
								!notif.read ? "bg-bg3" : ""
							}`}
							onClick={() => {
								setNotifications((prev) =>
									prev.map((n) =>
										n.id === notif.id ? { ...n, read: true } : n
									)
								);
							}}
						>
							<div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
								<Image
									src={notif.avatar}
									alt={notif.user}
									width={40}
									height={40}
									className="object-cover"
								/>
							</div>

							<div className="flex-1 min-w-0">
								<div className="text-[13px] text-dark4 leading-tight">
									<span className="font-semibold text-dark2">{notif.user}</span>{" "}
									{notif.text}
								</div>
								<div className="text-[11px] text-primary mt-1">
									{notif.time}
								</div>
							</div>

							{!notif.read && (
								<div className="w-2.5 h-2.5 bg-primary rounded-full shrink-0 mt-1.5" />
							)}
						</div>
					))}

					{filteredNotifications.length === 0 && (
						<p className="text-center text-[13px] text-gray py-8">
							No notifications
						</p>
					)}
				</div>
			</div>
		</>
	);
}
