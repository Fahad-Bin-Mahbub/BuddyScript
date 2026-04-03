import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

const FRIENDS = [
	{
		name: "Steve Jobs",
		role: "CEO of Apple",
		img: "/images/people1.png",
		online: false,
		lastSeen: "5 minute ago",
	},
	{
		name: "Ryan Roslansky",
		role: "CEO of Linkedin",
		img: "/images/people2.png",
		online: true,
	},
	{
		name: "Dylan Field",
		role: "CEO of Figma",
		img: "/images/people3.png",
		online: true,
	},
	{
		name: "Steve Jobs",
		role: "CEO of Apple",
		img: "/images/people1.png",
		online: false,
		lastSeen: "5 minute ago",
	},
	{
		name: "Ryan Roslansky",
		role: "CEO of Linkedin",
		img: "/images/people2.png",
		online: true,
	},
	{
		name: "Dylan Field",
		role: "CEO of Figma",
		img: "/images/people3.png",
		online: true,
	},
	{
		name: "Dylan Field",
		role: "CEO of Figma",
		img: "/images/people3.png",
		online: true,
	},
	{
		name: "Steve Jobs",
		role: "CEO of Apple",
		img: "/images/people1.png",
		online: false,
		lastSeen: "5 minute ago",
	},
];

export default function RightSidebar() {
	return (
		<div className="h-full overflow-y-auto pr-2 flex flex-col gap-4">
			{/* You Might Like */}
			<div className="bg-bg2 rounded-md p-6 shadow-sm">
				<div className="flex items-center justify-between mb-6">
					<h4 className="font-semibold text-xl text-dark5">
						You Might Like
					</h4>
					<span className="text-[13px] font-medium text-primary cursor-pointer">
						See All
					</span>
				</div>

				<hr className="border-border2 mb-4" />

				<div className="flex items-center gap-3 mb-4 p-2">
					<div className="rounded-full overflow-hidden shrink-0">
						<Image
							src="/images/Avatar.png"
							alt="Suggested"
							width={40}
							height={40}
							className="w-12 h-12 object-cover"
						/>
					</div>

					<div className="flex flex-col gap-1 min-w-0">
						<div className="text-md font-medium text-dark2">
							Radovan SkillArena
						</div>
						<div className="text-xs text-gray">
							Founder & CEO at Trophy
						</div>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<button className="flex-1 py-2.5 text-md border border-border2 rounded-md text-gray font-medium hover:bg-bg3 transition-colors">
						Ignore
					</button>
					<button className="flex-1 py-2.5 text-md bg-primary text-white rounded-md font-medium hover:opacity-90 transition-opacity">
						Follow
					</button>
				</div>
			</div>

			{/* Your Friends */}
			<div className="bg-bg2 rounded-md px-5 pt-6 pb-6 shadow-sm">
				<div className="flex items-center justify-between mb-6">
					<h4 className="font-semibold text-xl text-dark5">
						Your Friends
					</h4>
					<Link
						href="#"
						className="text-[13px] font-medium text-primary cursor-pointer"
					>
						See All
					</Link>
				</div>

				{/* Search */}
				<form className="relative mb-5">
					<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.25 h-4.25 text-gray" />
					<input
						type="search"
						placeholder="input search text"
						className="w-full h-10 rounded-full bg-bg3 border border-bg3 pl-11 pr-4 text-[14px] text-dark2 outline-none transition-all hover:border-primary focus:border-primary placeholder:text-gray-400 placeholder:transition-opacity placeholder:duration-200 focus:placeholder:opacity-0 placeholder:font-medium"
					/>
				</form>

				{/* Friends list */}
				<div className="flex flex-col gap-4 max-h-105 overflow-y-auto px-1 py-1">
					{FRIENDS.map((friend, index) => (
						<div
							key={`${friend.name}-${index}`}
							className="flex items-center justify-between"
						>
							<div className="flex items-center gap-4 min-w-0">
								<Link
									href="/profile"
									className="w-10 h-10 rounded-full overflow-hidden shrink-0"
								>
									<Image
										src={friend.img}
										alt={friend.name}
										width={40}
										height={40}
										className="w-full h-full object-cover"
									/>
								</Link>

								<div className="min-w-0 flex flex-col gap-2">
									<Link href="/profile">
										<h4 className="text-md font-medium text-dark2 truncate">
											{friend.name}
										</h4>
									</Link>
									<div className="text-[10px] text-gray truncate">
										{friend.role}
									</div>
								</div>
							</div>

							<div className="shrink-0">
								{friend.online ? (
									<span className="relative flex h-3.5 w-3.5">
										<span className="inline-flex h-3.5 w-3.5 rounded-full bg-[#0ACF83] ring-2 ring-white" />
									</span>
								) : (
									<span className="text-[10px] text-gray whitespace-nowrap">
										{friend.lastSeen}
									</span>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
