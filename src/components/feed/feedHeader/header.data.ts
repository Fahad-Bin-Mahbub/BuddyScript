import { NotificationItem } from "./header.types";

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
	{
		id: "1",
		user: "Steve Jobs",
		avatar: "/images/friend-req.png",
		text: "posted a link in your timeline.",
		time: "42 minutes ago",
		read: false,
	},
	{
		id: "2",
		user: "Freelacer usa",
		avatar: "/images/profile-1.png",
		text: "An admin changed the name of the group.",
		time: "42 minutes ago",
		read: false,
	},
	{
		id: "3",
		user: "Steve Jobs",
		avatar: "/images/friend-req.png",
		text: "posted a link in your timeline.",
		time: "1 hour ago",
		read: true,
	},
	{
		id: "4",
		user: "Dylan Field",
		avatar: "/images/profile-1.png",
		text: "liked your post.",
		time: "2 hours ago",
		read: true,
	},
	{
		id: "5",
		user: "Steve Jobs",
		avatar: "/images/friend-req.png",
		text: "commented on your photo.",
		time: "3 hours ago",
		read: true,
	},
	{
		id: "6",
		user: "Ryan Roslansky",
		avatar: "/images/profile-1.png",
		text: "sent you a friend request.",
		time: "5 hours ago",
		read: true,
	},
];
