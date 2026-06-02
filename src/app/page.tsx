"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import NewsCard from "@/components/NewsCard";
import Sidebar from "@/components/Sidebar";
import ArticleModal from "@/components/ArticleModal";
import { Article } from "@/types/article";

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    fetch("/api/articles")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data: Article[]) => {
        setArticles(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const filtered =
    selectedLeague === "all"
      ? articles.filter((a) => !a.isHidden)
      : articles.filter((a) => !a.isHidden && a.league === selectedLeague);

  const transferArticles = articles.filter(
    (a) => !a.isHidden && a.league === "transfer"
  );

  const closeModal = useCallback(() => setSelectedArticle(null), []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header selectedLeague={selectedLeague} onLeagueChange={setSelectedLeague} />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6 items-start">
          {/* Main content */}
          <main className="flex-1 min-w-0">
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden animate-pulse">
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700" />
                    <div className="p-3 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
                      <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded w-3/5 mt-3" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="text-center py-20 text-gray-400 dark:text-gray-500">
                <p className="text-4xl mb-3">⚠️</p>
                <p className="text-lg font-medium mb-1">Không thể tải tin tức</p>
                <p className="text-sm">Vui lòng thử lại sau.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Tải lại
                </button>
              </div>
            )}

            {!loading && !error && filtered.length === 0 && (
              <div className="text-center py-20 text-gray-400 dark:text-gray-500">
                <p className="text-4xl mb-3">⚽</p>
                <p className="text-lg font-medium mb-1">Chưa có tin tức</p>
                <p className="text-sm">Chưa có bài trong 72 giờ qua cho mục này.</p>
              </div>
            )}

            {!loading && !error && filtered.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((article) => (
                  <NewsCard
                    key={article.id}
                    article={article}
                    onClick={setSelectedArticle}
                  />
                ))}
              </div>
            )}
          </main>

          {/* Sidebar — desktop only */}
          <div className="hidden lg:block">
            <Sidebar
              articles={transferArticles}
              onArticleClick={setSelectedArticle}
            />
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-200 dark:border-gray-800 py-4 mt-auto">
        <p className="text-center text-xs text-gray-400 dark:text-gray-600">
          ffSpace — Tin tức bóng đá 72 giờ gần nhất
        </p>
      </footer>

      {selectedArticle && (
        <ArticleModal article={selectedArticle} onClose={closeModal} />
      )}
    </div>
  );
}
