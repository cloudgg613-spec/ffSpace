export const LEAGUES = [
  { id: "all", name: "Tất cả" },
  { id: "premier-league", name: "Premier League" },
  { id: "champions-league", name: "Champions League" },
  { id: "la-liga", name: "La Liga" },
  { id: "serie-a", name: "Serie A" },
  { id: "bundesliga", name: "Bundesliga" },
  { id: "v-league", name: "V.League" },
  { id: "transfer", name: "Chuyển nhượng" },
] as const;

export const LEAGUE_NAMES: Record<string, string> = Object.fromEntries(
  LEAGUES.map((l) => [l.id, l.name])
);

export const LEAGUE_BADGE_COLORS: Record<string, string> = {
  "premier-league": "bg-purple-700",
  "champions-league": "bg-blue-900",
  "la-liga": "bg-red-600",
  "serie-a": "bg-blue-600",
  "bundesliga": "bg-red-700",
  "v-league": "bg-green-700",
  "transfer": "bg-emerald-600",
};

export function getLeagueBadgeColor(league: string): string {
  return LEAGUE_BADGE_COLORS[league] ?? "bg-gray-500";
}
