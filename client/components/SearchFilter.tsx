'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchFilterProps {
  onSearch: (query: string) => void;
}

export default function SearchFilter({ onSearch }: SearchFilterProps) {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="mb-4">
      <div className="flex  items-center justify-center gap-2 p-2">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search by code or URL..."
          className="w-80 flex-1 px-4 py-3 border border-orange-300 rounded-md outline-none focus:outline-none focus:border focus:border-orange-500"
        />
        <span className="text-blue-600 pr-2 cursor-pointer">
          <Search size={32}/>
        </span>
        {query && (
          <button
            onClick={handleClear}
            className=" text-red-400 pr-2 cursor-pointer"
          >
            <X size={32}/>
          </button>
        )}
      </div>
    </div>
  );
}