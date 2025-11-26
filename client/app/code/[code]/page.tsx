'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getLinkByCode } from '@/lib/api';
import { Link } from '@/types';
import { Copy, LoaderCircle } from 'lucide-react';

export default function StatsPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;

  const [link, setLink] = useState<Link | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLink = async () => {
      try {
        setLoading(true);
        const data = await getLinkByCode(code);
        setLink(data);
        setError('');
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('Link not found');
        } else {
          setError('Failed to load link stats');
        }
      } finally {
        setLoading(false);
      }
    };

    if (code) {
      fetchLink();
    }
  }, [code]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className=""><LoaderCircle className='w-16 h-16 font-semibold animate-spin text-orange-600'/></p>
        </div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const shortUrl = `${process.env.NEXT_PUBLIC_API_URL}/${link.shortCode}`;

  return (
    <div className="min-h-screen font-mono bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.push('/')}
            className="text-orange-600 hover:text-orange-700 mb-4"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-orange-700">Link Statistics</h1>
        </div>

        {/* Short Code Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-neutral-700">Short Code</h2>
            <code className="text-2xl font-mono text-blue-600 bg-blue-50 px-4 py-2 rounded">
              {link.shortCode}
            </code>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={shortUrl}
              readOnly
              className="flex-1 px-4 text-indigo-600 py-2 border border-indigo-300 rounded-md outline-none focus:outline-none focus:border focus:border-indigo-300"
            />
            <button
              onClick={() => copyToClipboard(shortUrl)}
             
            >
              <Copy className='w-8 h-8'/>
            </button>
          </div>
        </div>

        {/* Target URL Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-neutral-700 mb-4">Target URL</h2>
          <a
            href={link.longUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-blue-800 break-all"
          >
            {link.longUrl}
          </a>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Total Clicks */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm font-medium text-neutral-700 mb-2">Total Clicks</div>
            <div className="text-4xl font-bold text-indigo-600">{link.clickCount}</div>
          </div>

          {/* Created Date */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm font-medium text-neutral-700 mb-2">Created</div>
            <div className="text-md font-semibold text-indigo-600">
              {formatDate(link.createdAt)}
            </div>
          </div>

          {/* Last Clicked */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm font-medium text-neutral-700 mb-2">Last Clicked</div>
            <div className="text-md font-semibold text-indigo-600">
              {formatDate(link.lastClickedAt)}
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-indigo-300">
              <span className="text-gray-600">Link ID</span>
              <span className="font-mono text-gray-900">{link.id}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-indigo-300">
              <span className="text-gray-600">Short Code</span>
              <span className="font-mono text-gray-900">{link.shortCode}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-indigo-300">
              <span className="text-gray-600">Total Clicks</span>
              <span className="font-semibold text-gray-900">{link.clickCount}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-indigo-300">
              <span className="text-gray-600">Created At</span>
              <span className="text-gray-900">{formatDate(link.createdAt)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Last Clicked At</span>
              <span className="text-gray-900">{formatDate(link.lastClickedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}