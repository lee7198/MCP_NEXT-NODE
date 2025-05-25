import React from 'react';

export default function MultiToSpan({ input }: { input: string }) {
  const lines = (input ?? '').split('\n');

  return lines.map((line: string, idx: number) => (
    <span key={idx}>
      {line}
      {idx !== lines.length - 1 && <br />}
    </span>
  ));
}
