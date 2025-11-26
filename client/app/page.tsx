// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { getAllLinks } from '@/lib/api';
import { Link } from '@/types';
import AddLinkForm from '@/components/AddLinkForm';
import LinksTable from '@/components/LinksTable';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const data = await getAllLinks();
      setLinks(data);
      setError('');
    } catch (err) {
      setError('Failed to load links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-mono">
      <div className="flex flex-col max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-orange-700 font-mono">TinyUrl</h1>
          <p className="text-neutral-700 text-xl mt-2">Create and manage your short links</p>
        </header>

        <AddLinkForm onSuccess={fetchLinks} />

        <div className="mb-4">
          <h2 className="text-2xl font-bold text-orange-700">Your Links</h2>
        </div>

        {loading && (
          <div className="flex items-center justify-center bg-white p-12 rounded-lg shadow-md text-center">
             <Loader2 size={20} className='animate-spin'/>
             <span>Loading Links</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && !error && (
          <LinksTable links={links} onDelete={fetchLinks} />
        )}
      </div>
    </div>
  );
}