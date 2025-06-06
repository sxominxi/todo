"use client";

import React, { useEffect, useState } from "react";
import { fetchTodoList, updateTodoItem } from "@/utils/api";
import { getTenantId } from "@/utils/tenant";
import { Todo } from "@/types/todo";
import Search from "@/components/Search";
import CheckList from "@/components/CheckList";

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
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

  const handleTodoAdded = (newTodo: Todo) => {
    setTodos([newTodo, ...todos]);
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

  const doingTodos = todos.filter(todo => !todo.isCompleted);
  const doneTodos = todos.filter(todo => todo.isCompleted);

  return (
    <main className="max-w-4xl mx-auto p-2 pt-[56px]">
      {/* 할일 추가 */}
      <Search onTodoAdded={handleTodoAdded} />
      {/* 할일 목록 */}
      <CheckList
        doingTodos={doingTodos}
        doneTodos={doneTodos}
        tenantId={tenantId}
        onToggle={handleToggle}
      />
    </main>
  );
}
