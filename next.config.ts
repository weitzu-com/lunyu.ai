import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      // www is the single canonical host. Preserve the complete path and
      // query string while making the apex host converge in one hop.
      {
        source: "/:path*",
        has: [{ type: "host", value: "lunyu.ai" }],
        destination: "https://www.lunyu.ai/:path*",
        permanent: true,
      },
    ];
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  async rewrites() {
    return [
      // Keep the default-language home at "/" without a redirect hop.
      {
        source: "/",
        destination: "/en",
      },
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
