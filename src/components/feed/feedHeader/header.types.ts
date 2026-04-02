export type ActiveTab = "home" | "friends" | "notifications" | "chat";

export type NotificationItem = {
	id: string;
	user: string;
	avatar: string;
	text: string;
	time: string;
	read: boolean;
};
