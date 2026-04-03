import Image from "next/image";
import { BellRing } from "lucide-react";
import { NotificationItem, ActiveTab } from "./header.types";

type Props = {
	activeTab: ActiveTab;
	setActiveTab: (tab: ActiveTab) => void;
	showNotifications: boolean;
	setShowNotifications: (value: boolean) => void;
	showNotifyMenu: boolean;
	setShowNotifyMenu: (value: boolean) => void;
	notifyFilter: "all" | "unread";
	setNotifyFilter: (value: "all" | "unread") => void;
	notifications: NotificationItem[];
	setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
	unreadCount: number;
};

export default function NotificationsDropdown({
	activeTab,
	setActiveTab,
	showNotifications,
	setShowNotifications,
	showNotifyMenu,
	setShowNotifyMenu,
	notifyFilter,
	setNotifyFilter,
	notifications,
	setNotifications,
	unreadCount,
}: Props) {
	const filteredNotifications =
		notifyFilter === "unread"
			? notifications.filter((n) => !n.read)
			: notifications;

	const markAllRead = () => {
		setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
		setShowNotifyMenu(false);
	};

	return (
		<div className="relative">
			<button
				type="button"
				onClick={() => {
					setActiveTab("notifications");
					setShowNotifications(!showNotifications);
					setShowNotifyMenu(false);
				}}
				className={`relative flex items-center justify-center p-3 transition-colors ${
					activeTab === "notifications"
						? "text-primary"
						: "text-gray-400 hover:text-primary"
				}`}
			>
				<BellRing className="w-6 h-6" />
				{unreadCount > 0 && (
					<span className="absolute top-1 right-1 min-w-3.5 h-3.5 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
						{unreadCount}
					</span>
				)}
				{activeTab === "notifications" && (
					<span className="absolute -bottom-3.5 left-1/2 h-0.75 w-full -translate-x-1/2 rounded-full bg-primary" />
				)}
			</button>

			{showNotifications && (
				<div className="absolute top-[calc(100%+4px)] -right-12.5 w-95 bg-bg2 font-medium rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.15)] z-1000 max-h-125 overflow-hidden flex flex-col">
					<div className="flex items-center justify-between px-4 pt-4 pb-2">
						<h4 className="text-[18px] font-semibold text-dark2">
							Notifications
						</h4>

						<div className="relative">
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									setShowNotifyMenu(!showNotifyMenu);
								}}
								className="p-1 text-gray text-xl font-bold hover:bg-bg3 rounded"
							>
								⋮
							</button>

							{showNotifyMenu && (
								<div className="absolute top-full right-0 mt-1 w-50 bg-bg2 rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.15)] z-1001">
									<ul className="py-1">
										<li>
											<button
												type="button"
												onClick={markAllRead}
												className="w-full text-left px-4 py-2 text-[13px] text-dark4 hover:bg-bg3"
											>
												Mark as all read
											</button>
										</li>
										<li>
											<button
												type="button"
												className="w-full text-left px-4 py-2 text-[13px] text-dark4 hover:bg-bg3"
											>
												Notification settings
											</button>
										</li>
										<li>
											<button
												type="button"
												className="w-full text-left px-4 py-2 text-[13px] text-dark4 hover:bg-bg3"
											>
												Open Notifications
											</button>
										</li>
									</ul>
								</div>
							)}
						</div>
					</div>

					<div className="flex gap-2 px-4 pb-3">
						<button
							type="button"
							onClick={() => setNotifyFilter("all")}
							className={`px-4 py-1.5 rounded-lg text-[13px] border border-primary font-medium transition-colors ${
								notifyFilter === "all"
									? "text-primary"
									: "bg-bg3 text-gray hover:bg-bg4"
							}`}
						>
							All
						</button>
						<button
							type="button"
							onClick={() => setNotifyFilter("unread")}
							className={`px-4 py-1.5 rounded-lg text-[13px] border border-primary font-medium transition-colors ${
								notifyFilter === "unread"
									? "text-primary"
									: "bg-bg3 text-gray hover:bg-bg4"
							}`}
						>
							Unread
						</button>
					</div>

					<div className="overflow-y-auto flex-1 max-h-87.5">
						{filteredNotifications.map((notif) => (
							<div
								key={notif.id}
								className={`flex items-start gap-3 px-6 py-4.5 hover:bg-bg1 transition-colors cursor-pointer ${
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
										<span className="font-semibold text-dark2">
											{notif.user}
										</span>{" "}
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
			)}
		</div>
	);
}
