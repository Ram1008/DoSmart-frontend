'use client';

import React from 'react';

interface QuickTaskProps {
  quickTask: string;
  setQuickTask: (val: string) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  onQuickSubmit: (textInput: string) => void; // callback for parent
}

const QuickTask: React.FC<QuickTaskProps> = ({
  quickTask,
  setQuickTask,
  isModalOpen,
  setIsModalOpen,
  onQuickSubmit,
}) => {
  return (
    <div className="relative w-full mb-4">
      <textarea
        value={quickTask}
        onChange={(e) => setQuickTask(e.target.value)}
        placeholder="Start typing your task here..."
        className="w-full border border-gray-300 h-[100px] rounded-lg p-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
      {/* Toggle for opening custom modal */}
      <div className="absolute top-4 right-3">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isModalOpen}
            onChange={() => setIsModalOpen(!isModalOpen)}
            className="sr-only peer"
          />
          <div className="relative w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 transition-colors">
            <span className="absolute left-[2px] top-[2px] bg-white border border-gray-300 rounded-full h-4 w-4 peer-checked:translate-x-[100%] transition-transform"></span>
          </div>
        </label>
      </div>
      {/* Mic icon (decorative) */}
      <button className="absolute bottom-2 right-3 focus:outline-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 1v11m0 0a3 3 0 01-3-3V8a3 3 0 016 0v1a3 3 0 01-3 3zm-3 2v2a3 3 0 006 0v-2"
          />
        </svg>
      </button>
      <button
        onClick={() => {
          if (quickTask.trim()) {
            onQuickSubmit(quickTask.trim());
            setQuickTask('');
          }
        }}
        className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-700 to-red-500 hover:from-blue-600 hover:to-red-600 text-white rounded-md transition-all duration-300"
      >
        Add Quick Task
      </button>
    </div>
  );
};

export default QuickTask;
