// components/LinksTable.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Link as LinkType } from '@/types';
import { deleteLink } from '@/lib/api';
import SearchFilter from './SearchFilter';
import { Copy, Search, X, Trash2 } from 'lucide-react';


interface LinksTableProps {
  links: LinkType[];
  onDelete: () => void;
}

export default function LinksTable({ links, onDelete }: LinksTableProps) {
  const [deletingCode, setDeletingCode] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'createdAt' | 'clickCount'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');

  const handleDelete = async (code: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    setDeletingCode(code);
    try {
      await deleteLink(code);
      onDelete();
    } catch (error) {
      alert('Failed to delete link');
    } finally {
      setDeletingCode(null);
    }
  };



  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleString();
  };

  const truncateUrl = (url: string, maxLength = 50) => {
    return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
  };

  const handleSort = (field: 'createdAt' | 'clickCount') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const filteredLinks = links.filter(
    (link) =>
      link.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.longUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedLinks = [...filteredLinks].sort((a, b) => {
    if (sortBy === 'clickCount') {
      return sortOrder === 'asc' 
        ? a.clickCount - b.clickCount 
        : b.clickCount - a.clickCount;
    } else {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }
  });

  if (links.length === 0) {
    return (
      <div className="bg-white p-12 rounded-lg shadow-md text-center">
        <p className="text-gray-500 text-lg">No links yet. Create your first short link above!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-5">
      <SearchFilter onSearch={setSearchQuery} /> 
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50  border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs  text-neutral-700 uppercase tracking-wider font-semibold">
                Short Code
              </th>
              <th className="px-6 py-3 text-left text-neutral-700  text-xs  font-semibold uppercase tracking-wider">
                Target URL
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider  cursor-pointer hover:bg-neutral-100"
                onClick={() => handleSort('clickCount')}
              >
                Clicks {sortBy === 'clickCount' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                Last Clicked
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('createdAt')}
              >
                Created {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-10 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedLinks.map((link) => (
              <tr key={link.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <code className="text-md font-mono text-blue-600">
                      {link.shortCode}
                    </code>
                    <button
                      onClick={() => copyToClipboard(`${process.env.NEXT_PUBLIC_API_URL}/${link.shortCode}`)}
                      className="text-gray-400 hover:text-gray-600"
                     
                    >
                      <Copy className='w-4 h-4'/>
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <a
                    href={link.longUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-md text-gray-900 hover:text-blue-600"
                    title={link.longUrl}
                  >
                    {truncateUrl(link.longUrl)}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">
                  {link.clickCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-md text-gray-500">
                  {formatDate(link.lastClickedAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-md text-gray-500">
                  {formatDate(link.createdAt)}
                </td>
                <td className="flex items-center justify-center px-10 py-4 whitespace-nowrap text-md space-x-4">
                  <Link
                    href={`/code/${link.shortCode}`}
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Stats
                  </Link>
                  <button
                    onClick={() => handleDelete(link.shortCode)}
                    disabled={deletingCode === link.shortCode}
                    className="text-red-600 hover:text-red-800 disabled:text-gray-400"
                  >
                    {deletingCode === link.shortCode ? 'Deleting...' : <Trash2 className=''/>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}