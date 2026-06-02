"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import LeagueFilter from "./LeagueFilter";

interface HeaderProps {
  selectedLeague: string;
  onLeagueChange: (league: string) => void;
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-8 h-8" />;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
      aria-label="Đổi giao diện"
    >
      {isDark ? (
        <svg className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm0 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm8-8a1 1 0 110 2h-1a1 1 0 110-2h1zM4 12a1 1 0 110 2H3a1 1 0 110-2h1zm13.657-6.343a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM7.05 16.95a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zm9.9 0a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zM5.636 5.636a1 1 0 011.414 0l.707.707A1 1 0 116.343 7.757l-.707-.707a1 1 0 010-1.414zM12 7a5 5 0 100 10A5 5 0 0012 7z" />
        </svg>
      ) : (
        <svg className="w-4 h-4 text-white/80" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
        </svg>
      )}
    </button>
  );
}

export default function Header({ selectedLeague, onLeagueChange }: HeaderProps) {
  return (
    <header className="bg-[#0f172a] text-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 py-3">
          <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
            <Image
              src="/logo.png"
              alt="ffSpace logo"
              width={32}
              height={32}
              className="object-cover"
              onError={() => {}}
            />
          </div>
          <span className="hidden sm:block text-white/70 text-sm whitespace-nowrap">Tin tức bóng đá</span>
          <div className="hidden sm:block text-white/40 text-sm">|</div>
          <div className="flex-1 min-w-0">
            <LeagueFilter selected={selectedLeague} onChange={onLeagueChange} />
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
