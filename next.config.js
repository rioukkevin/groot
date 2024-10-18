/** @type {import('next').NextConfig} */
const nextConfig = {
  // Config options here
};

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withVercelToolbar = require("@vercel/toolbar/plugins/next")();
// Instead of module.exports = nextConfig, do this:
module.exports = withVercelToolbar(nextConfig);
