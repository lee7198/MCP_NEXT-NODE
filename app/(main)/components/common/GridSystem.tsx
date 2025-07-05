import React, { ReactElement } from 'react';

export function GridSystem({
  headerList,
  data,
}: {
  headerList: Record<string, string>;
  data: Array<Array<ReactElement>>;
}) {
  return (
    <table className="w-full">
      <thead>
        <tr>
          {Object.keys(headerList).map((key, idx) => (
            <th
              className="border-b-gray-600 bg-gray-200 py-2 text-sm"
              key={idx}
            >
              {key}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIdx) => (
          <tr key={rowIdx}>{row.map((col) => col)}</tr>
        ))}
      </tbody>
    </table>
  );
}
