import { Search } from "lucide-react";

export default function HeaderSearch() {
	return (
		<div className="hidden lg:block mx-auto">
			<form className="relative">
				<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
				<input
					type="search"
					placeholder="input search text"
					className="bg-bg3 border border-bg3 rounded-full w-110 h-10 pl-12 pr-4 text-[16px] text-dark2 transition-all hover:border-primary focus:border-primary focus:outline-none placeholder:text-gray-400 placeholder:opacity-100 placeholder:font-medium placeholder:transition-opacity placeholder:duration-200 focus:placeholder:opacity-0"
				/>
			</form>
		</div>
	);
}
