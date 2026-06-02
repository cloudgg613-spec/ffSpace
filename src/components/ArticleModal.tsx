"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Article } from "@/types/article";
import { LEAGUE_NAMES, getLeagueBadgeColor } from "@/lib/leagues";

interface ArticleModalProps {
  article: Article;
  onClose: () => void;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ArticleModal({ article, onClose }: ArticleModalProps) {
  const badgeColor = getLeagueBadgeColor(article.league);
  const leagueName = LEAGUE_NAMES[article.league] ?? article.league;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        {article.imageUrl && (
          <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Badge + Close */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <span className={`${badgeColor} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
              {leagueName}
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Đóng"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-snug mb-3">
            {article.title}
          </h1>

          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
            <span className="font-medium text-[#1755C0]">{article.source}</span>
            <span>•</span>
            <span>{formatDate(article.publishedAt)}</span>
          </div>

          <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap mb-6">
            {article.content}
          </div>

          {article.sourceUrl && (
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-white bg-[#1755C0] hover:bg-[#1244a0] px-4 py-2 rounded-lg transition-colors"
            >
              Xem bài gốc
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
