"use client";

import React, { useEffect, useState } from "react";
import { fetchTodoList, createTodoItem, updateTodoItem } from "@/utils/api";
import { getTenantId } from "@/utils/tenant";
import { Todo } from "@/types/todo";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import TodoToggle from "@/components/TodoToggle";

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tenantId, setTenantId] = useState<string>("");

  useEffect(() => {
    fetchTodoList()
      .then(data => {
        setTodos(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const id = getTenantId();
    setTenantId(id);
  }, []);

  // 훅을 모두 호출한 후 조건문으로 분기 처리
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!tenantId) return <div>Loading tenant...</div>;

  const handleAddTodo = async () => {
    if (input.trim() === "") return;

    try {
      const newTodo = await createTodoItem(input.trim());
      setTodos([newTodo, ...todos]);
      setInput("");
    } catch (err) {
      console.error("할일 생성 실패:", err);
      setError("할일 생성에 실패했습니다.");
    }
  };

  async function handleToggle(e: React.MouseEvent, todoId: string) {
    e.preventDefault();
    const todo = todos.find((t) => t.id === todoId);
    if (!todo) return;

    try {
      const updatedTodo = await updateTodoItem(tenantId, todoId, {
        isCompleted: !todo.isCompleted,
      });

      setTodos((prevTodos) =>
        prevTodos.map((t) => (t.id === todoId ? updatedTodo : t))
      );
    } catch (err) {
      console.error("❌ 상태 업데이트 실패:", err);
      setError("상태 업데이트에 실패했습니다.");
    }
  }

  const handleDelete = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const doingTodos = todos.filter(todo => !todo.isCompleted);
  const doneTodos = todos.filter(todo => todo.isCompleted);


  return (
    <main className="max-w-4xl mx-auto p-2 pt-[56px]">
      {/* 할 일 추가 영역 */}
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
          {todos.length === 0 ? (
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
      </section>

      <div className="flex flex-col sm:flex-row justify-between gap-8">
        {/* 진행 중 할 일 */}
        <section className="flex-1">
          <img
            src="/todo.png"
            alt="TO DO"
            className="h-auto w-20 object-contain mb-3"
          />
          {doingTodos.length === 0 ? (
            <div className="flex justify-center items-center w-full">
              <img
                src="/Type=Todo, Size=Large.png"
                alt="할 일 없음"
                className="w-32 h-auto opacity-60"
              />
            </div>
          ) : (
            <ul className="space-y-2">
              {doingTodos.map((todo) => (
                <li
                  key={todo.id}
                  className="w-full border-2 border-black bg-[var(--color-header)] px-3 py-2 rounded-full mb-3 text-base [var(--color-slate800)] h-10"
                >
                  <div className="flex items-center w-full px-6 gap-2">
                    <TodoToggle
                      isCompleted={todo.isCompleted}
                      onToggle={(e) => handleToggle(e, todo.id)}
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
            <div className="flex justify-center items-center w-full">
              <img
                src="/Type=Done, Size=Large.png"
                alt="완료된 일 없음"
                className="w-32 h-auto opacity-60"
              />
            </div>
          ) : (
            <ul className="space-y-2">
              {doneTodos.map((todo) => (
                <li
                  key={todo.id}
                  className="w-full border-2 border-black bg-[var(--color-violet100)] px-3 py-2 rounded-full mb-3 text-base [var(--color-slate800)] h-10"
                >
                  <div className="flex items-center w-full px-6 gap-2">
                    <TodoToggle
                      isCompleted={todo.isCompleted}
                      onToggle={(e) => handleToggle(e, todo.id)}
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
    </main>
  );
}
