"use client";

import React, { useEffect, useState } from "react";
import { fetchTodoList, createTodoItem } from "../utils/api";
import { getTenantId } from "@/utils/tenant";
import { Todo } from "@/types/todo";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";

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
      const newTodo = await createTodoItem({ name: input.trim() });

      setTodos([newTodo, ...todos]); // 새로 받은 todo를 목록에 추가
      setInput(""); // 입력창 비우기
    } catch (err) {
      console.error("할 일 생성 실패:", err);
      alert("할 일 생성에 실패했습니다.");
    }
  };

  const handleToggle = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDelete = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const doingTodos = todos.filter(todo => !todo.completed);
  const doneTodos = todos.filter(todo => todo.completed);


  return (
    <main className="max-w-xl mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-blue-600">할 일 목록</h1>
      </header>

      {/* 할 일 추가 영역 */}
      <section className="mb-6">
        <input
          type="text"
          placeholder="새 할 일을 입력하세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
          className="w-full border px-3 py-2 rounded mb-2"
        />
        <button
          onClick={handleAddTodo}
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          추가하기
        </button>
      </section>

      {/* 진행 중 할 일 */}
      <section className="mb-6">
        <h2 className="font-semibold mb-2">🕐 진행 중</h2>
        <ul className="space-y-2">
          {doingTodos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between border p-2 rounded"
            >
              <button
                onClick={() => handleToggle(todo.id)}
                className="mr-2 w-5 h-5 border rounded-full"
                title="완료로 표시"
              />
              <Link href={`/${tenantId}/items/${todo.id}`}>
                {todo.name}
              </Link>
              <button
                onClick={() => handleDelete(todo.id)}
                className="ml-2 text-red-500"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* 완료된 할 일 */}
      <section>
        <h2 className="font-semibold mb-2">✅ 완료된 일</h2>
        <ul className="space-y-2">
          {doneTodos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between border p-2 rounded opacity-60"
            >
              <button
                onClick={() => handleToggle(todo.id)}
                className="mr-2 w-5 h-5 border rounded-full bg-green-500"
                title="진행 중으로 변경"
              />
              <Link href={`/${tenantId}/items/${todo.id}`}>
                {todo.name}
              </Link>
              <button
                onClick={() => handleDelete(todo.id)}
                className="ml-2 text-red-500"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
