import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownStyle({ input }: { input: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ ...props }) => (
          <a {...props} className="font-bold text-lime-600" />
        ),
        table: ({ ...props }) => (
          <table
            {...props}
            className="my-2 w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400"
          />
        ),
        thead: ({ ...props }) => (
          <thead
            {...props}
            className="rounded-lg bg-gray-200 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400"
          />
        ),
        th: ({ ...props }) => <th {...props} className="px-3 py-1" />,
        td: ({ ...props }) => <td {...props} className="px-3 py-1" />,
        h1: ({ ...props }) => <h1 {...props} className="py-1 text-2xl" />,
        h2: ({ ...props }) => <h2 {...props} className="py-1 text-xl" />,
        h3: ({ ...props }) => <h3 {...props} className="py-1 text-lg" />,
        p: ({ ...props }) => <p {...props} className="py-1 text-sm" />,
        hr: ({ ...props }) => (
          <hr {...props} className="mx-auto my-4 w-3/4 border-gray-500" />
        ),
        ol: ({ ...props }) => (
          <ol {...props} className="list-inside list-decimal text-sm" />
        ),
        ul: ({ ...props }) => (
          <ul {...props} className="list-inside list-disc text-sm" />
        ),
        pre: ({ ...props }) => (
          <pre
            {...props}
            className="my-2 overflow-x-auto rounded bg-gray-100 p-2 text-sm"
          />
        ),
        code: ({ ...props }) => (
          <code {...props} className="rounded bg-gray-100 p-1 text-sm" />
        ),
        blockquote: ({ ...props }) => (
          <blockquote
            {...props}
            className="my-2 border-l-4 border-gray-300 bg-gray-50 p-2 text-sm italic"
          />
        ),
        img: ({ ...props }) => (
          <img {...props} className="mx-auto my-2 max-w-full" />
        ),
        strong: ({ ...props }) => <strong {...props} className="font-bold" />,
        em: ({ ...props }) => <em {...props} className="italic" />,
        del: ({ ...props }) => <del {...props} className="line-through" />,
        br: ({ ...props }) => <br {...props} className="my-2" />,
      }}
    >
      {input}
    </ReactMarkdown>
  );
}
