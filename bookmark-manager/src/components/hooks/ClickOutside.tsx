import { useEffect } from "react";

export default function useClickOutside(ref: React.RefObject<HTMLElement | null>, onClickOutside: () => void) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside();
      }
    }

    // Only add event listener if ref.current is not null
    if (ref.current) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, onClickOutside]);
}

