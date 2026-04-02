import { RefObject, useEffect } from "react";

export function useClickOutside<T extends HTMLElement>(
	ref: RefObject<T | null>,
	onOutside: () => void
) {
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				onOutside();
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [ref, onOutside]);
}
