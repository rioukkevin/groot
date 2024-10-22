/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/talk",
        destination: "/",
        permanent: true,
      },
      {
        source: "/cv/resume.pdf",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withVercelToolbar = require("@vercel/toolbar/plugins/next")();
module.exports = withVercelToolbar(nextConfig);
