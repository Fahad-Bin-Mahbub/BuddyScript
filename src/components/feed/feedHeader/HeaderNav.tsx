import { Home, MessageCircle, LucideUsers2 } from "lucide-react";
import HeaderNavItem from "./HeaderNavItem";
import NotificationsDropdown from "./NotificationsDropdown";
import { ActiveTab, NotificationItem } from "./header.types";

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
};

export default function HeaderNav(props: Props) {
	const unreadCount = props.notifications.filter((n) => !n.read).length;

	return (
		<div className="flex items-center gap-4 mr-8">
			<HeaderNavItem
				href="/feed"
				tab="home"
				activeTab={props.activeTab}
				onClick={props.setActiveTab}
			>
				<Home className="w-6 h-6" />
			</HeaderNavItem>

			<HeaderNavItem
				href="#"
				tab="friends"
				activeTab={props.activeTab}
				onClick={props.setActiveTab}
			>
				<LucideUsers2 className="w-6 h-6" />
			</HeaderNavItem>

			<NotificationsDropdown
				activeTab={props.activeTab}
				setActiveTab={props.setActiveTab}
				showNotifications={props.showNotifications}
				setShowNotifications={props.setShowNotifications}
				showNotifyMenu={props.showNotifyMenu}
				setShowNotifyMenu={props.setShowNotifyMenu}
				notifyFilter={props.notifyFilter}
				setNotifyFilter={props.setNotifyFilter}
				notifications={props.notifications}
				setNotifications={props.setNotifications}
				unreadCount={unreadCount}
			/>

			<HeaderNavItem
				href="#"
				tab="chat"
				activeTab={props.activeTab}
				onClick={props.setActiveTab}
				badge={2}
			>
				<MessageCircle className="w-6 h-6" />
			</HeaderNavItem>
		</div>
	);
}
