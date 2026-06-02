"use client";

import { useState, useEffect } from "react";
import { Article } from "@/types/article";
import { LEAGUES, LEAGUE_NAMES, getLeagueBadgeColor } from "@/lib/leagues";

interface RssFeed {
  id: string;
  name: string;
  url: string;
  league: string;
  isActive: boolean;
  createdAt: string;
}

type Tab = "add" | "rss" | "articles";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  return `${Math.floor(hours / 24)} ngày trước`;
}

// ─── Tab 1: Thêm tin ──────────────────────────────────────────────────────────

function AddArticleTab() {
  const empty = { title: "", summary: "", content: "", imageUrl: "", source: "", league: "premier-league", sourceUrl: "" };
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Lỗi không xác định");
      }
      setStatus("ok");
      setForm(empty);
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Lỗi không xác định");
      setStatus("error");
    }
  }

  const inputCls = "w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#1755C0]";
  const labelCls = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      <div>
        <label className={labelCls}>Tiêu đề *</label>
        <input className={inputCls} value={form.title} onChange={set("title")} required placeholder="Tiêu đề bài viết" />
      </div>
      <div>
        <label className={labelCls}>Tóm tắt *</label>
        <textarea className={`${inputCls} h-20 resize-none`} value={form.summary} onChange={set("summary")} required placeholder="Mô tả ngắn..." />
      </div>
      <div>
        <label className={labelCls}>Nội dung *</label>
        <textarea className={`${inputCls} h-40 resize-y`} value={form.content} onChange={set("content")} required placeholder="Nội dung đầy đủ..." />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Nguồn *</label>
          <input className={inputCls} value={form.source} onChange={set("source")} required placeholder="BBC Sport, Goal.com..." />
        </div>
        <div>
          <label className={labelCls}>Giải đấu *</label>
          <select className={inputCls} value={form.league} onChange={set("league")}>
            {LEAGUES.filter((l) => l.id !== "all").map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className={labelCls}>URL ảnh</label>
        <input className={inputCls} value={form.imageUrl} onChange={set("imageUrl")} placeholder="https://..." />
      </div>
      <div>
        <label className={labelCls}>URL bài gốc</label>
        <input className={inputCls} value={form.sourceUrl} onChange={set("sourceUrl")} placeholder="https://..." />
      </div>

      {status === "ok" && (
        <p className="text-sm text-emerald-600 font-medium">Đăng tin thành công!</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-500 font-medium">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="px-5 py-2 rounded-lg bg-[#1755C0] hover:bg-[#1244a0] text-white text-sm font-medium transition-colors disabled:opacity-50"
      >
        {status === "loading" ? "Đang đăng..." : "Đăng tin"}
      </button>
    </form>
  );
}

// ─── Tab 2: Quản lý RSS ───────────────────────────────────────────────────────

function RssTab() {
  const [feeds, setFeeds] = useState<RssFeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [league, setLeague] = useState("all");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [fetchStatus, setFetchStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [fetchResult, setFetchResult] = useState("");

  useEffect(() => {
    fetch("/api/feeds")
      .then((r) => r.json())
      .then((data) => { setFeeds(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    setAddError("");
    try {
      const res = await fetch("/api/feeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, url, league }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFeeds((f) => [...f, data]);
      setName(""); setUrl(""); setLeague("all");
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Lỗi");
    } finally {
      setAdding(false);
    }
  }

  async function toggleFeed(id: string) {
    const res = await fetch(`/api/feeds/${id}`, { method: "PATCH" });
    if (res.ok) {
      const updated = await res.json();
      setFeeds((f) => f.map((feed) => feed.id === id ? updated : feed));
    }
  }

  async function deleteFeed(id: string) {
    if (!confirm("Xoá feed này?")) return;
    const res = await fetch(`/api/feeds/${id}`, { method: "DELETE" });
    if (res.ok) setFeeds((f) => f.filter((feed) => feed.id !== id));
  }

  async function handleFetchAll() {
    setFetchStatus("loading");
    setFetchResult("");
    try {
      const res = await fetch(`/api/admin/fetch`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const summary = data.results
        .map((r: { name: string; saved: number; error?: string }) =>
          r.error ? `${r.name}: lỗi` : `${r.name}: +${r.saved} bài`
        )
        .join(", ");
      setFetchResult(`Hoàn thành — ${summary}`);
      setFetchStatus("ok");
    } catch (err) {
      setFetchResult(err instanceof Error ? err.message : "Lỗi");
      setFetchStatus("error");
    }
  }

  const inputCls = "px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#1755C0]";

  return (
    <div className="max-w-3xl space-y-6">
      {/* Manual fetch */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 flex items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Fetch thủ công</p>
          <p className="text-xs text-gray-400">Kéo bài từ tất cả feeds đang bật ngay lập tức</p>
          {fetchResult && (
            <p className={`text-xs mt-1 ${fetchStatus === "ok" ? "text-emerald-600" : "text-red-500"}`}>
              {fetchResult}
            </p>
          )}
        </div>
        <button
          onClick={handleFetchAll}
          disabled={fetchStatus === "loading"}
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {fetchStatus === "loading" ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Đang fetch...
            </>
          ) : "Fetch ngay"}
        </button>
      </div>

      {/* Add form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Thêm feed mới</h3>
        <form onSubmit={handleAdd} className="space-y-2">
          <div className="flex gap-2 flex-wrap">
            <input
              className={`${inputCls} flex-1 min-w-32`}
              placeholder="Tên feed"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className={`${inputCls} flex-[2] min-w-48`}
              placeholder="URL RSS"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-2 items-center">
            <select className={`${inputCls} flex-1`} value={league} onChange={(e) => setLeague(e.target.value)}>
              {LEAGUES.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
            <p className="text-xs text-gray-400 flex-1">"Tất cả" = tự phát hiện giải theo nội dung</p>
            <button
              type="submit"
              disabled={adding}
              className="px-4 py-2 rounded-lg bg-[#1755C0] hover:bg-[#1244a0] text-white text-sm font-medium transition-colors disabled:opacity-50"
            >
              Thêm
            </button>
          </div>
        </form>
        {addError && <p className="text-xs text-red-500 mt-2">{addError}</p>}
      </div>

      {/* Feed list */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Danh sách feeds ({feeds.length})
          </h3>
        </div>
        {loading ? (
          <div className="p-6 text-center text-gray-400 text-sm">Đang tải...</div>
        ) : feeds.length === 0 ? (
          <div className="p-6 text-center text-gray-400 text-sm">Chưa có feed nào</div>
        ) : (
          <ul className="divide-y divide-gray-50 dark:divide-gray-700">
            {feeds.map((feed) => (
              <li key={feed.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{feed.name}</p>
                    <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                      {LEAGUE_NAMES[feed.league] ?? feed.league}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{feed.url}</p>
                </div>
                <button
                  onClick={() => toggleFeed(feed.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    feed.isActive
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-200"
                      : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200"
                  }`}
                >
                  {feed.isActive ? "Bật" : "Tắt"}
                </button>
                <button
                  onClick={() => deleteFeed(feed.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  aria-label="Xoá"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ─── Tab 3: Danh sách tin ─────────────────────────────────────────────────────

function ArticlesTab() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch("/api/articles?includeHidden=1")
      .then((r) => r.json())
      .then((data) => { setArticles(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function toggleHide(article: Article) {
    const res = await fetch(`/api/articles/${article.id}`, { method: "PATCH" });
    if (res.ok) {
      const updated = await res.json();
      setArticles((a) => a.map((x) => x.id === article.id ? updated : x));
    }
  }

  async function deleteArticle(id: string) {
    if (!confirm("Xoá bài này?")) return;
    const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
    if (res.ok) setArticles((a) => a.filter((x) => x.id !== id));
  }

  async function deleteAll() {
    if (!confirm(`Xoá tất cả ${articles.length} bài? Hành động này không thể hoàn tác.`)) return;
    setDeleting(true);
    const res = await fetch("/api/articles", { method: "DELETE" });
    if (res.ok) setArticles([]);
    setDeleting(false);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Hiển thị bài trong 72 giờ gần nhất ({articles.length} bài)
        </p>
        {articles.length > 0 && (
          <button
            onClick={deleteAll}
            disabled={deleting}
            className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 text-xs font-medium transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {deleting ? "Đang xoá..." : "Xoá tất cả"}
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400 text-sm">Đang tải...</div>
      ) : articles.length === 0 ? (
        <div className="text-center py-10 text-gray-400 text-sm">Chưa có bài nào</div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <ul className="divide-y divide-gray-50 dark:divide-gray-700">
            {articles.map((article) => {
              const badgeColor = getLeagueBadgeColor(article.league);
              const leagueName = LEAGUE_NAMES[article.league] ?? article.league;
              return (
                <li key={article.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className={`${badgeColor} text-white text-xs font-semibold px-2 py-0.5 rounded`}>
                        {leagueName}
                      </span>
                      {article.isHidden && (
                        <span className="text-xs text-gray-400 dark:text-gray-500 italic">ẩn</span>
                      )}
                      {article.isManual && (
                        <span className="text-xs text-blue-500 font-medium">thủ công</span>
                      )}
                    </div>
                    <p className={`text-sm font-medium line-clamp-1 ${article.isHidden ? "text-gray-400 dark:text-gray-500" : "text-gray-800 dark:text-gray-200"}`}>
                      {article.title}
                    </p>
                    <p className="text-xs text-gray-400">{article.source} · {timeAgo(article.publishedAt)}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => toggleHide(article)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        article.isHidden
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                          : "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100"
                      }`}
                    >
                      {article.isHidden ? "Hiện" : "Ẩn"}
                    </button>
                    <button
                      onClick={() => deleteArticle(article.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      aria-label="Xoá"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string }[] = [
  { id: "add", label: "Thêm tin" },
  { id: "rss", label: "Quản lý RSS" },
  { id: "articles", label: "Danh sách tin" },
];

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("add");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-[#0f172a] text-white shadow-md">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <span className="font-bold text-lg">ffSpace</span>
          <span className="text-white/40">|</span>
          <span className="text-white/70 text-sm">Admin Panel</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white dark:bg-gray-800 rounded-xl p-1 border border-gray-100 dark:border-gray-700 w-full sm:w-fit shadow-sm overflow-x-auto scrollbar-hide">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t.id
                  ? "bg-[#1755C0] text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "add" && <AddArticleTab />}
        {tab === "rss" && <RssTab />}
        {tab === "articles" && <ArticlesTab />}
      </div>
    </div>
  );
}
