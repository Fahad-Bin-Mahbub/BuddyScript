"use client";

import React, { useState, useEffect } from "react";

export default function ThemeSwitcher() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("buddyscript-theme");
    if (saved === "dark") {
      setIsDark(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("buddyscript-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("buddyscript-theme", "light");
    }
  };

  if (!mounted) return null;

  return (
		<div className="fixed right-1 top-1/2 -translate-y-1/2 z-99999 flex flex-col items-center gap-1.5">
			<button
				type="button"
				onClick={toggleTheme}
				className="flex flex-col items-center gap-1 cursor-pointer p-0 bg-transparent border-none"
			>
				{/* Toggle track */}
				<div
					className={`w-8.5 h-16 ${
						isDark ? "border border-[#377dff]" : "bg-[#377dff]"
					}  rounded-[14px] relative shadow-[0_2px_8px_rgba(55,125,255,0.4)] flex flex-col justify-between items-center py-1 transition-colors duration-300`}
				>
					{/* Sun icon (top) */}
					<div className="z-10 mt-1">
						<svg width="18" height="20" viewBox="0 0 24 24" fill="none">
							<circle
								cx="12"
								cy="12"
								r="4.389"
								stroke={isDark ? "#fff" : "#377dff"}
							/>
							<path
								stroke={isDark ? "#fff" : "#377dff"}
								strokeLinecap="round"
								d="M3.444 12H1M23 12h-2.444M5.95 5.95L4.222 4.22M19.778 19.779L18.05 18.05M12 3.444V1M12 23v-2.445M18.05 5.95l1.728-1.729M4.222 19.779L5.95 18.05"
							/>
						</svg>
					</div>

					{/* Moon icon (bottom) */}
					<div className="z-10 mb-1">
						<svg width="11" height="16" viewBox="0 0 11 16" fill="none">
							<path
								fill={isDark ? "" : "#fff"}
								d="M2.727 14.977l.04-.498-.04.498zm-1.72-.49l.489-.11-.489.11zM3.232 1.212L3.514.8l-.282.413zM9.792 8a6.5 6.5 0 00-6.5-6.5v-1a7.5 7.5 0 017.5 7.5h-1zm-6.5 6.5a6.5 6.5 0 006.5-6.5h1a7.5 7.5 0 01-7.5 7.5v-1zm-.525-.02c.173.013.348.02.525.02v1c-.204 0-.405-.008-.605-.024l.08-.997zm-.261-1.83A6.498 6.498 0 005.792 7h1a7.498 7.498 0 01-3.791 6.52l-.495-.87zM5.792 7a6.493 6.493 0 00-2.841-5.374L3.514.8A7.493 7.493 0 016.792 7h-1zm-3.105 8.476c-.528-.042-.985-.077-1.314-.155-.316-.075-.746-.242-.854-.726l.977-.217c-.028-.124-.145-.09.106-.03.237.056.6.086 1.165.131l-.08.997zm.314-1.956c-.622.354-1.045.596-1.31.792a.967.967 0 00-.204.185c-.01.013.027-.038.009-.12l-.977.218a.836.836 0 01.144-.666c.112-.162.27-.3.433-.42.324-.24.814-.519 1.41-.858L3 13.52zM3.292 1.5a.391.391 0 00.374-.285A.382.382 0 003.514.8l-.563.826A.618.618 0 012.702.95a.609.609 0 01.59-.45v1z"
							/>
						</svg>
					</div>

					{/* Toggle knob */}
					<div
						className={`absolute left-1.75 w-4.5 h-4.5 rounded-full shadow-md transition-all duration-300 z-20 ${
							isDark ? "top-9.5 bg-[#377dff]" : "top-1.5 bg-white"
						}`}
					/>
				</div>
			</button>
		</div>
	);
}
