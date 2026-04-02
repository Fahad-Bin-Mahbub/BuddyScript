import Image from "next/image";
import {
	ChevronDown,
	Settings,
	ChevronRight,
	CircleQuestionMark,
	LogOut,
} from "lucide-react";

type Props = {
	user: {
		firstName?: string;
		lastName?: string;
		avatar?: string;
	} | null;
	logout: () => void;
	open: boolean;
	setOpen: (value: boolean) => void;
};

export default function ProfileDropdown({
	user,
	logout,
	open,
	setOpen,
}: Props) {
	const fullName = user ? `${user.firstName} ${user.lastName}` : "User";

	return (
		<div className="relative">
			<div
				className="flex items-center gap-2 cursor-pointer"
				onClick={() => setOpen(!open)}
			>
				<div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
					<Image
						src={user?.avatar || "/images/profile.png"}
						alt="Profile"
						width={36}
						height={36}
						className="object-cover"
					/>
				</div>

				<div className="hidden xl:block">
					<p className="text-[14px] font-medium text-dark2 leading-tight">
						{fullName}
					</p>
				</div>

				<button type="button" className="p-1">
					<ChevronDown className="w-4 h-4 text-gray-400" />
				</button>
			</div>

			{open && (
				<div className="absolute top-[calc(100%+18px)] right-0 w-80 bg-bg2 rounded-[6px] shadow-[0_4px_20px_rgba(0,0,0,0.15)] z-[1000]">
					<div className="p-4 flex items-center gap-3 border-b border-border2">
						<div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
							<Image
								src={user?.avatar || "/images/profile.png"}
								alt="Profile"
								width={50}
								height={50}
								className="object-cover"
							/>
						</div>
						<div>
							<h4 className="text-[17px] font-semibold text-dark2">
								{fullName}
							</h4>
							<span className="text-[12px] text-primary">View Profile</span>
						</div>
					</div>

					<ul className="py-2">
						<li>
							<button className="w-full flex items-center justify-between px-4 py-2.5 text-[14px] text-dark4 hover:bg-bg3 transition-colors">
								<div className="flex items-center gap-3 text-[17px] font-medium">
									<div className="inline-flex items-center justify-center p-2.5 bg-bg3 rounded-full">
										<Settings className="w-5 h-5 text-primary" />
									</div>
									Settings
								</div>
								<ChevronRight className="w-4 h-4 text-gray-400" />
							</button>
						</li>

						<li>
							<button className="w-full flex items-center justify-between px-4 py-2.5 text-[14px] text-dark4 hover:bg-bg3 transition-colors">
								<div className="flex items-center gap-3 text-[17px] font-medium">
									<div className="inline-flex items-center justify-center p-2.5 bg-bg3 rounded-full">
										<CircleQuestionMark className="w-5 h-5 text-primary" />
									</div>
									Help &amp; Support
								</div>
								<ChevronRight className="w-4 h-4 text-gray-400" />
							</button>
						</li>

						<li>
							<button
								onClick={logout}
								className="w-full flex items-center justify-between px-4 py-2.5 text-[14px] text-dark4 hover:bg-bg3 transition-colors"
							>
								<div className="flex items-center gap-3 text-[17px] font-medium">
									<div className="inline-flex items-center justify-center p-2.5 bg-bg3 rounded-full">
										<LogOut className="w-5 h-5 text-primary" />
									</div>
									Log Out
								</div>
								<ChevronRight className="w-4 h-4 text-gray-400" />
							</button>
						</li>
					</ul>
				</div>
			)}
		</div>
	);
}
