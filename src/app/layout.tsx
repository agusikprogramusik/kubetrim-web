import React from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KubeTrim Web // Tactile FinOps & Attribution Control Plane",
  description:
    "Avant-Garde Tactile Editorial & Precision UI Executive FinOps Dashboard for Kubernetes (October 2026)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="obsidian">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen selection:bg-[#D4FF00] selection:text-[#0B0C0E]">
        {/* Fixed Analog SVG fractalNoise Overlay (opacity: 0.035, pointer-events: none) */}
        <svg
          className="fixed inset-0 w-full h-full pointer-events-none z-50"
          style={{ opacity: 0.035 }}
          aria-hidden="true"
        >
          <filter id="tactile-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.82"
              numOctaves={4}
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#tactile-noise)" />
        </svg>
        {children}
      </body>
    </html>
  );
}
