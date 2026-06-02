"use client";

import { LEAGUES } from "@/lib/leagues";

interface LeagueFilterProps {
  selected: string;
  onChange: (league: string) => void;
}

export default function LeagueFilter({ selected, onChange }: LeagueFilterProps) {
  return (
    <div className="relative">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 pr-6">
        {LEAGUES.map((league) => (
          <button
            key={league.id}
            onClick={() => onChange(league.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selected === league.id
                ? "bg-white text-[#1755C0] font-semibold shadow-sm"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            {league.name}
          </button>
        ))}
      </div>
      {/* Fade gradient báo hiệu còn tab ở bên phải */}
      <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[#0f172a] to-transparent pointer-events-none" />
    </div>
  );
}
