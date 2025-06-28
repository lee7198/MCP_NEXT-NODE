import React from 'react';
import Link from 'next/link';
import { LinkIcon } from '@phosphor-icons/react/dist/ssr';
import { McpLinkArticle } from '@/app/types';

const mcp_link: McpLinkArticle[] = [
  {
    title: '🧩 Get started with the Model Context Protocol (MCP)',
    link: 'https://modelcontextprotocol.io/introduction',
  },
  {
    title: '🧠 MCP는 AI 업계의 표준이 될까요?',
    link: 'https://channel.io/ko/blog/articles/what-is-mcp-52c77e72',
  },
  { title: '🌟 Awesome MCP Servers', link: 'https://mcpservers.org/' },
  {
    title:
      '🤗 20 Awesome MCP Servers List I Have Collected (You Should Try Too)',
    link: 'https://huggingface.co/blog/lynn-mikami/awesome-mcp-servers',
  },
  {
    title: '🚀 MCP: 웹 검색부터 파일 관리까지, AI의 한계를 확장하는 표준 기술',
    link: 'https://fornewchallenge.tistory.com/entry/%F0%9F%9A%80-MCP-%EC%9B%B9-%EA%B2%80%EC%83%89%EB%B6%80%ED%84%B0-%ED%8C%8C%EC%9D%BC-%EA%B4%80%EB%A6%AC%EA%B9%8C%EC%A7%80-AI%EC%9D%98-%ED%95%9C%EA%B3%84%EB%A5%BC-%ED%99%95%EC%9E%A5%ED%95%98%EB%8A%94-%ED%91%9C%EC%A4%80-%EA%B8%B0%EC%88%A0',
  },
];

export default function McpLinksSection() {
  return (
    <div className="col-span-12 row-start-6 rounded-lg border bg-white p-4 shadow dark:border-zinc-700 dark:bg-zinc-800">
      <h2 className="text-lg font-bold">MCP 관련 DOC & POST</h2>
      <ul className="mt-4 mb-2 list-inside list-decimal">
        {mcp_link.map((item) => (
          <li key={item.title}>
            <Link
              href={item.link}
              target="_blank"
              className="hover:font-bold hover:underline"
            >
              {item.title}
            </Link>
            <LinkIcon className="ml-2 inline-block" />
          </li>
        ))}
      </ul>
    </div>
  );
}
