import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl font-bold text-[#1755C0] mb-4">404</p>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Không tìm thấy trang
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          Trang bạn tìm không tồn tại hoặc đã bị xoá.
        </p>
        <Link
          href="/"
          className="px-5 py-2 rounded-lg bg-[#1755C0] hover:bg-[#1244a0] text-white text-sm font-medium transition-colors"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
