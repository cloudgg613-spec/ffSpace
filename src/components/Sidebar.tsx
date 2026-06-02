import { Article } from "@/types/article";

interface SidebarProps {
  articles: Article[];
  onArticleClick: (article: Article) => void;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  return `${Math.floor(hours / 24)} ngày trước`;
}

export default function Sidebar({ articles, onArticleClick }: SidebarProps) {
  return (
    <aside className="w-72 flex-shrink-0">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden sticky top-[113px]">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-emerald-600 to-emerald-500">
          <h3 className="text-white font-bold text-sm">Chuyển nhượng nóng</h3>
        </div>

        {articles.length === 0 ? (
          <div className="px-4 py-6 text-center text-gray-400 dark:text-gray-500 text-sm">
            Chưa có tin chuyển nhượng
          </div>
        ) : (
          <ul className="divide-y divide-gray-50 dark:divide-gray-700">
            {articles.map((article) => (
              <li key={article.id}>
                <button
                  onClick={() => onArticleClick(article)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2 leading-snug mb-1">
                    {article.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#1755C0] font-medium">
                      {article.source}
                    </span>
                    <span className="text-xs text-gray-400">
                      {timeAgo(article.publishedAt)}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
