'use client';

import React from 'react';
import { Search } from 'lucide-react';

const INPUT_CLASS =
  'w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all';

/**
 * Reusable admin search bar. Use wrapperClassName to control positioning in the layout.
 * @param {string} placeholder - Placeholder text for the input
 * @param {string} [wrapperClassName] - Optional class for the outer wrapper (e.g. "flex-1 max-w-md" or "relative flex-1 min-w-[220px] max-w-xl")
 * @param {string} [value] - Controlled value (optional)
 * @param {function} [onChange] - Change handler (optional)
 * @param {object} [inputProps] - Additional props for the input element
 */
export default function AdminSearchBar({
  placeholder = 'Search...',
  wrapperClassName = '',
  value,
  onChange,
  ...inputProps
}) {
  const isControlled = value !== undefined && onChange !== undefined;
  const input = (
    <>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <input
        type="text"
        placeholder={placeholder}
        className={INPUT_CLASS}
        value={isControlled ? value : undefined}
        onChange={isControlled ? onChange : undefined}
        {...inputProps}
      />
    </>
  );

  const inner = <div className="relative">{input}</div>;

  if (wrapperClassName) {
    return <div className={wrapperClassName}>{inner}</div>;
  }
  return inner;
}
