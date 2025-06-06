"use client";

import React, { useState } from "react";
import { createTodoItem } from "@/utils/api";
import { Todo } from "@/types/todo";

interface SearchProps {
  onTodoAdded: (newTodo: Todo) => void;
}

export default function Search({ onTodoAdded }: SearchProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleAddTodo = async () => {
    if (input.trim() === "") return;

    try {
      const newTodo = await createTodoItem(input.trim());
      onTodoAdded(newTodo);
      setInput("");
      setError(null);
    } catch (err) {
      console.error("할일 생성 실패:", err);
      setError("할일 생성에 실패했습니다.");
    }
  };

  return (
    <section className="mb-6">
      <div className="flex items-center justify-center gap-2 mt-3">
        <input
          type="text"
          placeholder="할 일을 입력해주세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
          className="w-full border-2 border-black bg-[var(--color-slate100)] px-3 py-2 rounded-full mb-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-base [var(--color-slate500)] h-12 pl-6"
        />
        <button onClick={handleAddTodo} className="flex items-center justify-center">
          {input.trim().length > 0 ? (
            <>
              {/* 모바일용 아이콘 */}
              <div className="block sm:hidden h-12 w-auto">
                <img
                  src="/Type=Add, Size=Small, State=Active.png"
                  alt="추가"
                  className="h-full w-full object-contain"
                />
              </div>
              {/* 태블릿 이상용 아이콘 */}
              <div className="hidden sm:block h-14 w-auto">
                <img
                  src="/Type=Add, Size=Large, State=Active.png"
                  alt="추가"
                  className="h-full w-full object-contain"
                />
              </div>
            </>
          ) : (
            <>
              {/* 모바일용 아이콘 */}
              <div className="block sm:hidden h-12 w-auto">
                <img
                  src="/Type=Add, Size=Small, State=Default.png"
                  alt="추가"
                  className="h-full w-full object-contain"
                />
              </div>
              {/* 태블릿 이상용 아이콘 */}
              <div className="hidden sm:block h-14 w-auto">
                <img
                  src="/Type=Add, Size=Large, State=Default.png"
                  alt="추가"
                  className="h-full w-full object-contain"
                />
              </div>
            </>
          )}
        </button>
      </div>
      {error && <p className="text-red-600 text-center">{error}</p>}
    </section>
  );
} 