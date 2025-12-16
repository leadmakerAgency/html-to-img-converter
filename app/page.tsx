"use client";

import { useState } from "react";

export default function Home() {
  const [htmlCode, setHtmlCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async (format: "png" | "jpg") => {
    if (!htmlCode.trim()) {
      setError("Please paste your HTML/CSS code");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          html: htmlCode,
          format: format,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Conversion failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `converted-image.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            HTML to Image Converter
          </h1>
          <p className="text-gray-600">
            Paste your HTML and CSS code below to convert it to PNG or JPG images.
            Perfect for converting banners and designs for social media.
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <label
              htmlFor="html-code"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              HTML/CSS Code
            </label>
            <textarea
              id="html-code"
              value={htmlCode}
              onChange={(e) => setHtmlCode(e.target.value)}
              placeholder="Paste your HTML and CSS code here..."
              className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => handleConvert("png")}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Converting..." : "Export as PNG"}
            </button>
            <button
              onClick={() => handleConvert("jpg")}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Converting..." : "Export as JPG"}
            </button>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">
            How it works
          </h2>
          <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
            <li>Paste your complete HTML and CSS code (inline styles or &lt;style&gt; tags)</li>
            <li>Click "Export as PNG" or "Export as JPG" to convert</li>
            <li>Your image will download automatically</li>
            <li>Supports all modern CSS features including Flexbox, Grid, animations, and more</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
