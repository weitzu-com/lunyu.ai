import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      // Root must never 404. Keep the redirect on the same host so apex and
      // www both reach the default language page without a domain hop.
      {
        source: "/",
        destination: "/en",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      // Serve the LLM discovery file from both common locations without
      // duplicating content.
      {
        source: "/.well-known/llms.txt",
        destination: "/llms.txt",
      },
    ];
  },
};

export default nextConfig;
