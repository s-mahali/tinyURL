"use client";

import { createLink } from "@/lib/api";
import { useState } from "react";

interface AddLinkFormProps {
  onSuccess: () => void;
}

export default function AddLinkForm({ onSuccess }: AddLinkFormProps) {
  const [longUrl, setLongUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      await createLink({
        longUrl,
        customCode: customCode || undefined,
      });
      setSuccess(true);
      setLongUrl("");
      setCustomCode("");
      setTimeout(() => setSuccess(false), 3000);
      onSuccess();
    } catch (error: any) {
        setError(error.response?.data?.error || 'Failed to create short link')
    } finally{
        setIsLoading(false);
    }
  };

  return (
    <div className="bg-white-200 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-orange-700 font-semibold mb-5">Create Short Link</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label htmlFor="longUrl" className="text-sm font-medium text-gray-700 mb-1">
            Long URL *
          </label>
          <input
            type="text"
            id="longUrl"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="https://example.com/very/long/url"
            className="w-full px-4 py-3 border border-orange-300 rounded-md outline-none focus:outline-none focus:border-2 focus:border-orange-500"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="customCode" className="text-sm font-medium text-gray-700 mb-1">
            Custom Code (optional)
          </label>
          <input
            type="text"
            id="customCode"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            placeholder="mycode (6-8 characters, alphanumeric)"
            pattern="[A-Za-z0-9]{6,8}"
            className="w-full px-4 py-3 border border-orange-300 rounded-md outline-none focus:outline-none focus:border-2 focus:border-orange-500"
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-1">
            6-8 characters, letters and numbers only
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            ✅ Short link created successfully!
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 disabled:bg-orange-400 disabled:cursor-not-allowed transition duration-200 cursor-pointer"
        >
          {isLoading ? 'Creating...' : <span className="text-xl">Create Short Link</span>}
        </button>
      </form>
    </div>
  )
}
