import React from 'react';
import { SkeletonTableRow } from './LoadingSkeleton';
import { EmptyState } from './EmptyState';

export function Table({
  columns = [],
  data = [],
  loading = false,
  emptyTitle = 'No data available',
  emptyDescription = 'There are no records matching the specified criteria.',
  emptyAction,
  className = '',
  rowKey = 'id',
  onRowClick,
}) {
  return (
    <div className={`w-full overflow-hidden border border-sand-300 rounded-sm bg-white ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-sand-100 border-b border-sand-300 text-obsidian-700 uppercase tracking-wider font-semibold">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={col.key || idx}
                  className={`py-3.5 px-4 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-sand-200">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <SkeletonTableRow key={i} columns={columns.length} />
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-0">
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    action={emptyAction}
                    className="border-0 bg-transparent py-12"
                  />
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={row[rowKey] || rowIdx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`transition-colors ${
                    onRowClick ? 'cursor-pointer hover:bg-sand-50/90' : 'hover:bg-sand-50/50'
                  }`}
                >
                  {columns.map((col, colIdx) => {
                    const value = col.accessor
                      ? typeof col.accessor === 'function'
                        ? col.accessor(row)
                        : row[col.accessor]
                      : row[col.key];

                    return (
                      <td
                        key={col.key || colIdx}
                        className={`py-3.5 px-4 text-obsidian-800 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.cellClassName || ''}`}
                      >
                        {col.render ? col.render(value, row) : value}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
