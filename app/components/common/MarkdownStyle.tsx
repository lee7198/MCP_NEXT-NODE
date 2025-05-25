import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownStyle({ input }: { input: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ node, ...props }) => (
          <a {...props} className="font-bold text-lime-600" />
        ),
        table: ({ node, ...props }) => (
          <table
            {...props}
            className="my-2 w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400"
          />
        ),
        thead: ({ node, ...props }) => (
          <thead
            {...props}
            className="rounded-lg bg-gray-200 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400"
          />
        ),
        th: ({ node, ...props }) => <th {...props} className="px-3 py-1" />,
        td: ({ node, ...props }) => <td {...props} className="px-3 py-1" />,
        h1: ({ node, ...props }) => <h1 {...props} className="py-1 text-2xl" />,
        h2: ({ node, ...props }) => <h2 {...props} className="py-1 text-xl" />,
        h3: ({ node, ...props }) => <h3 {...props} className="py-1 text-lg" />,
        p: ({ node, ...props }) => <p {...props} className="py-1 text-sm" />,
        hr: ({ node, ...props }) => (
          <hr {...props} className="mx-auto my-4 w-3/4 border-gray-500" />
        ),
        ol: ({ node, ...props }) => (
          <ol {...props} className="list-inside list-decimal text-sm" />
        ),
        ul: ({ node, ...props }) => (
          <ul {...props} className="list-inside list-disc text-sm" />
        ),
        pre: ({ node, ...props }) => (
          <pre
            {...props}
            className="my-2 overflow-x-auto rounded bg-gray-100 p-2 text-sm"
          />
        ),
        code: ({ node, ...props }) => (
          <code {...props} className="rounded bg-gray-100 p-1 text-sm" />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote
            {...props}
            className="my-2 border-l-4 border-gray-300 bg-gray-50 p-2 text-sm italic"
          />
        ),
        img: ({ node, ...props }) => (
          <img {...props} className="mx-auto my-2 max-w-full" />
        ),
        strong: ({ node, ...props }) => (
          <strong {...props} className="font-bold" />
        ),
        em: ({ node, ...props }) => <em {...props} className="italic" />,
        del: ({ node, ...props }) => (
          <del {...props} className="line-through" />
        ),
        br: ({ node, ...props }) => <br {...props} className="my-2" />,
      }}
    >
      {input}
    </ReactMarkdown>
  );
}
