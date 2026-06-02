"use client";

import Image from "next/image";
import { Article } from "@/types/article";
import { LEAGUE_NAMES, getLeagueBadgeColor } from "@/lib/leagues";

interface NewsCardProps {
  article: Article;
  onClick: (article: Article) => void;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
}

export default function NewsCard({ article, onClick }: NewsCardProps) {
  const badgeColor = getLeagueBadgeColor(article.league);
  const leagueName = LEAGUE_NAMES[article.league] ?? article.league;

  return (
    <article
      onClick={() => onClick(article)}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
        {article.imageUrl ? (
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1755C0]/10 to-[#1755C0]/20">
            <span className="text-3xl font-bold text-[#1755C0]/30">ffS</span>
          </div>
        )}
        <span
          className={`absolute top-2 left-2 ${badgeColor} text-white text-xs font-semibold px-2 py-0.5 rounded`}
        >
          {leagueName}
        </span>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug line-clamp-2 mb-1.5">
          {article.title}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed line-clamp-2 flex-1">
          {article.summary}
        </p>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50 dark:border-gray-700">
          <span className="text-xs font-medium text-[#1755C0]">{article.source}</span>
          <span className="text-xs text-gray-400">{timeAgo(article.publishedAt)}</span>
        </div>
      </div>
    </article>
  );
}
