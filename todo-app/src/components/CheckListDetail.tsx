"use client";

import React from "react";
import TodoToggle from "@/components/TodoToggle";

interface CheckListDetailProps {
  name: string;
  isCompleted: boolean;
  onChange: (value: string) => void;
  onToggle: (e: React.MouseEvent) => void;
}

const placeholder = "제목을 입력하세요";

export default function CheckListDetail({
  name,
  isCompleted,
  onChange,
  onToggle,
}: CheckListDetailProps) {
  return (
    <div className="flex justify-center mb-6">
      <div
        className={`flex justify-center w-full border-2 border-black ${
          isCompleted ? "bg-[var(--color-violet100)]" : "bg-[var(--color-header)]"
        } h-10 rounded-[15px]`}
      >
        <div className="flex items-center justify-center gap-3">
          <TodoToggle isCompleted={isCompleted} onToggle={onToggle} />
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => onChange(e.target.value)}
              className={`border-0 inline-block`}
              placeholder = {placeholder}
              size = {name.length > 0 ? name.length+1 : placeholder.length+5}
              style={{ textDecoration: "underline" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
