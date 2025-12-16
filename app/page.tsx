"use client";

import { useState, useRef } from "react";
import html2canvas from "html2canvas";

export default function Home() {
  const [htmlCode, setHtmlCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleConvert = async (format: "png" | "jpg") => {
    if (!htmlCode.trim()) {
      setError("Please paste your HTML/CSS code");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create a temporary container to render the HTML
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "0";
      container.style.width = "1080px";
      container.style.height = "1350px";
      container.style.overflow = "hidden";
      document.body.appendChild(container);

      // Set the HTML content
      container.innerHTML = htmlCode;

      // Wait for images and fonts to load
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Convert to canvas using html2canvas
      const canvas = await html2canvas(container, {
        width: 1080,
        height: 1350,
        scale: 2, // For higher quality
        useCORS: true,
        allowTaint: false,
        backgroundColor: format === "jpg" ? "#ffffff" : null,
      });

      // Remove temporary container
      document.body.removeChild(container);

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to create blob"));
            }
          },
          format === "png" ? "image/png" : "image/jpeg",
          format === "png" ? 1.0 : 0.95 // Quality: 1.0 for PNG, 0.95 for JPEG (high quality)
        );
      });

      // Download the image
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview (1080 × 1350px)
            </label>
            <div className="border border-gray-300 rounded-lg overflow-auto bg-white" style={{ maxHeight: "600px" }}>
              {htmlCode ? (
                <div
                  ref={previewRef}
                  className="mx-auto"
                  style={{
                    width: "1080px",
                    minHeight: "1350px",
                    transform: "scale(0.3)",
                    transformOrigin: "top center",
                  }}
                  dangerouslySetInnerHTML={{ __html: htmlCode }}
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center text-gray-400">
                  Preview will appear here
                </div>
              )}
            </div>
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
