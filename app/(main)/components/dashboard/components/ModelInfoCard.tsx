import React from 'react';

export default function ModelInfoCard() {
  return (
    <div className="col-span-4 flex items-center rounded-lg border bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/20">
      <b className="text-gray-900 dark:text-gray-100">AI Model :</b>&nbsp;
      <span className="text-gray-700 dark:text-gray-300">qwen3:8b</span>
    </div>
  );
}
