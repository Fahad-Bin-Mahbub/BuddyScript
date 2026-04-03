import React from "react";
import Image from "next/image";
import {
	GraduationCap,
	ChartColumn,
	UserRoundSearch,
	Bookmark,
	Users,
	Gamepad2,
	Settings,
	Save,
} from "lucide-react";

const exploreItems = [
	{ icon: GraduationCap, label: "Learning", badge: "New" },
	{ icon: ChartColumn, label: "Insights" },
	{ icon: UserRoundSearch, label: "Find friends" },
	{ icon: Bookmark, label: "Bookmarks" },
	{ icon: Users, label: "Group" },
	{ icon: Gamepad2, label: "Gaming", badge: "New" },
	{ icon: Settings, label: "Settings" },
	{ icon: Save, label: "Save post" },
];

export default function LeftSidebar() {
	return (
		<div className="h-full overflow-y-auto pr-2 flex flex-col gap-4">
			{/* Explore */}
			<div className="bg-bg2 rounded-md p-5 shadow-sm">
				<h4 className="font-semibold text-xl text-dark5 mb-6 px-2">Explore</h4>

				<ul className="flex flex-col gap-1">
					{exploreItems.map((item) => {
						const Icon = item.icon;

						return (
							<li key={item.label}>
								<button className="w-full flex items-center gap-3 py-3 px-2 rounded-md text-md text-gray font-medium hover:text-primary transition-colors">
									<Icon className="w-6 h-6 text-gray shrink-0" />
									<span>{item.label}</span>

									{item.badge && (
										<span className="ml-auto text-[14px] bg-green-500 text-white px-2 py-0.5 rounded-full">
											{item.badge}
										</span>
									)}
								</button>
							</li>
						);
					})}
				</ul>
			</div>

			{/* Suggested People */}
			<div className="bg-bg2 rounded-md p-5 shadow-sm">
				<div className="flex items-center justify-between mb-6">
					<h4 className="font-medium text-[20px] text-dark5">
						Suggested People
					</h4>
					<span className="text-xs text-primary font-medium cursor-pointer">
						See All
					</span>
				</div>

				{[
					{
						name: "Steve Jobs",
						role: "CEO of Apple",
						img: "/images/people1.png",
					},
					{
						name: "Ryan Roslansky",
						role: "CEO of Linkedin",
						img: "/images/people2.png",
					},
					{
						name: "Dylan Field",
						role: "CEO of Figma",
						img: "/images/people3.png",
					},
				].map((person) => (
					<div
						key={person.name}
						className="flex items-center justify-between py-4 last:mb-0"
					>
						<div className="flex items-center gap-4">
							<div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
								<Image
									src={person.img}
									alt={person.name}
									width={40}
									height={40}
									className="object-cover"
								/>
							</div>

							<div>
								<h4 className="text-sm font-medium text-dark2">
									{person.name}
								</h4>
								<div className="text-xs text-gray">{person.role}</div>
							</div>
						</div>

						<button className="text-[12px] text-gray-400 font-medium hover:bg-primary hover:text-white border p-1 rounded-md">
							Connect
						</button>
					</div>
				))}
			</div>

			{/* Events */}
			<div className="bg-bg2 rounded-md p-6 shadow-sm">
				<div className="flex items-center justify-between mb-4">
					<h4 className="font-medium text-xl text-dark5">Events</h4>
					<span className="text-xs font-medium text-primary cursor-pointer">
						See all
					</span>
				</div>

				<div className="rounded-md overflow-hidden mb-3">
					<Image
						src="/images/feed_event1.png"
						alt="Event"
						width={300}
						height={150}
						className="w-full h-30 object-cover"
					/>

					<div className="flex items-center gap-3 pt-3">
						<div className="text-center shrink-0 bg-green-500 text-white p-1 rounded-sm">
							<div className="text-xl font-semibold">10</div>
							<div className="text-lg">Jul</div>
						</div>

						<h4 className="text-lg font-medium text-dark2">
							No more terrorism no more cry
						</h4>
					</div>

					<hr className="my-3 border-border2" />

					<div className="flex items-center justify-between">
						<div className="text-sm text-gray">17 People Going</div>
						<span className="text-sm text-primary font-medium cursor-pointer border py-1 px-3 rounded-md bg-blue-50">
							Going
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
