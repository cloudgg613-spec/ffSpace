"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-5xl font-bold text-[#1755C0] mb-4">!</p>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Đã xảy ra lỗi
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          {error.message || "Lỗi không xác định"}
        </p>
        <button
          onClick={reset}
          className="px-5 py-2 rounded-lg bg-[#1755C0] hover:bg-[#1244a0] text-white text-sm font-medium transition-colors"
        >
          Thử lại
        </button>
      </div>
    </div>
  );
}
