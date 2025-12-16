import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HTML to Image Converter",
  description: "Convert HTML and CSS code to PNG or JPG images",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
