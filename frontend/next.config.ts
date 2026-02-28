import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ADR-004: env-conditional standalone output for Electron desktop builds.
  // Web deploys (Vercel) leave this undefined = default SSR behavior.
  // Desktop builds set ELECTRON_BUILD=true to produce .next/standalone/.
  output: process.env.ELECTRON_BUILD ? 'standalone' : undefined,

  // Ensure sql.js WASM binary is included in standalone output file tracing.
  // Without this, Next.js tree-shaking may exclude the .wasm file.
  outputFileTracingIncludes: process.env.ELECTRON_BUILD ? {
    '/api/desktop-db': ['./node_modules/sql.js/dist/sql-wasm.wasm'],
  } : undefined,

  // Explicitly forward NEXT_PUBLIC_DESKTOP_MODE to the client bundle.
  // Turbopack may not auto-inline NEXT_PUBLIC_* env vars from CLI in all cases.
  env: {
    NEXT_PUBLIC_DESKTOP_MODE: process.env.NEXT_PUBLIC_DESKTOP_MODE || '',
  },
};

export default nextConfig;
