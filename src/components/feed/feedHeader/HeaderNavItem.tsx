import Link from "next/link";
import React from "react";
import { ActiveTab } from "./header.types";

type Props = {
	href: string;
	tab: ActiveTab;
	activeTab: ActiveTab;
	onClick: (tab: ActiveTab) => void;
	children: React.ReactNode;
	badge?: number;
};

export default function HeaderNavItem({
	href,
	tab,
	activeTab,
	onClick,
	children,
	badge,
}: Props) {
	const isActive = activeTab === tab;

	return (
		<Link
			href={href}
			onClick={() => onClick(tab)}
			className={`relative flex items-center justify-center p-3 transition-colors ${
				isActive ? "text-primary" : "text-gray-400 hover:text-primary"
			}`}
		>
			{children}

			{badge && badge > 0 && (
				<span className="absolute top-1 right-1 min-w-[4.5 h-[4.5 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
					{badge}
				</span>
			)}

			{isActive && (
				<span className="absolute -bottom-3.5 left-1/2 h-0.75 w-full -translate-x-1/2 rounded-full bg-primary" />
			)}
		</Link>
	);
}
