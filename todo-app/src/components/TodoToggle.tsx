import React from 'react';

interface TodoToggleProps {
  isCompleted: boolean;
  onToggle: (e: React.MouseEvent) => void;
  className?: string;
}

export default function TodoToggle({ isCompleted, onToggle, className = '' }: TodoToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`focus:outline-none w-6 h-6 flex-shrink-0 flex items-center justify-center cursor-pointer z-10 relative ${className}`}
      title={isCompleted ? "진행 중으로 변경" : "완료로 표시"}
    >
      <img
        src={isCompleted ? "/Property 1=Frame.png" : "/Property 1=Default.png"}
        alt={isCompleted ? "DONE" : "TODO"}
        className="w-6 h-6 object-contain pointer-events-none"
      />
    </button>
  );
} 