// app/[code]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function RedirectPage() {
  const params = useParams();
  const code = params.code as string;
  const [error, setError] = useState(false);

  useEffect(() => {
    const redirect = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        // Call backend redirect endpoint
        const response = await fetch(`${apiUrl}/${code}`, {
          method: "GET",
          redirect: "manual",
        });

        if (response.status === 302) {
          // Get the redirect location from response headers
          const location = response.headers.get("Location");
          if (location) {
            window.location.href = location;
          } else {
            window.location.href = `${apiUrl}/${code}`;
          }
        } else if (response.status === 404) {
          setError(true);
        } else {
          window.location.href = `${apiUrl}/${code}`;
        }
      } catch (err) {
        setError(true);
      }
    };

    if (code) {
      redirect();
    }
  }, [code]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-6">Link not found</p>
          <p className="text-gray-500 mb-8">
            The short link{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">{code}</code> does
            not exist or has been deleted.
          </p>
          <a
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 inline-block"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-xl text-gray-600">Redirecting...</p>
        <p className="text-sm text-gray-500 mt-2">
          Please wait while we redirect you
        </p>
      </div>
    </div>
  );
}
