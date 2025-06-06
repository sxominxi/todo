"use client";

import React from "react";
import { Todo } from "@/types/todo";
import Link from "next/link";
import TodoToggle from "@/components/TodoToggle";

interface CheckListProps {
  doingTodos: Todo[];
  doneTodos: Todo[];
  tenantId: string;
  onToggle: (e: React.MouseEvent, todoId: string) => void;
}

export default function CheckList({ doingTodos, doneTodos, tenantId, onToggle }: CheckListProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-8">
      {/* 진행 중 할 일 */}
      <section className="flex-1">
        <img
          src="/todo.png"
          alt="TO DO"
          className="h-auto w-20 object-contain mb-3"
        />
        {doingTodos.length === 0 ? (
          <div className="flex flex-col justify-center items-center w-full text-slate-400 text-base">
            {/* 모바일용 이미지 */}
            <img
              src="/Type=todo, Size=Small.png"
              alt="할 일 없음"
              className="w-24 h-auto opacity-60 mb-4 block sm:hidden"
            />
            {/* 태블릿 이상 사이즈용 이미지 */}
            <img
              src="/Type=Todo, Size=Large.png"
              alt="할 일 없음"
              className="w-32 h-auto opacity-60 mb-4 hidden sm:block"
            />
            <p>할 일이 없어요.</p>
            <p>TODO를 새롭게 추가해주세요!</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {doingTodos.map((todo) => (
              <li
                key={todo.id}
                className="w-full h-10 flex items-center border-2 border-black bg-[var(--color-header)] px-3 rounded-full mb-3 text-base text-[var(--color-slate800)]"
              >
                <div className="flex items-center w-full gap-2">
                  <TodoToggle
                    isCompleted={todo.isCompleted}
                    onToggle={(e) => onToggle(e, todo.id)}
                  />
                  <Link href={`/${tenantId}/items/${todo.id}`} className="flex-1">
                    {todo.name}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 완료된 할 일 */}
      <section className="flex-1">
        <img
          src="/done.png"
          alt="DONE"
          className="h-auto w-20 object-contain mb-3"
        />
        {doneTodos.length === 0 ? (
          <div className="flex flex-col justify-center items-center w-full text-slate-400 text-base">
            {/* 모바일용 이미지 */}
            <img
              src="/Type=Done, Size=Small.png"
              alt="할 일 없음"
              className="w-24 h-auto opacity-60 mb-6 block sm:hidden"
            />
            {/* 태블릿 이상 사이즈용 이미지 */}
            <img
              src="/Type=Done, Size=Large.png"
              alt="할 일 없음"
              className="w-32 h-auto opacity-60 mb-7 hidden sm:block"
            />
            <p>아직 다 한 일이 없어요.</p>
            <p>해야 할 일을 체크해보세요!</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {doneTodos.map((todo) => (
              <li
                key={todo.id}
                className="w-full h-10 flex items-center border-2 border-black bg-[var(--color-violet100)] px-3 rounded-full mb-3 text-base text-[var(--color-slate800)]"
              >
                <div className="flex items-center w-full gap-2">
                  <TodoToggle
                    isCompleted={todo.isCompleted}
                    onToggle={(e) => onToggle(e, todo.id)}
                  />
                  <Link
                    href={`/${tenantId}/items/${todo.id}`}
                    className="flex-1 line-through"
                  >
                    {todo.name}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
