import { withPayload } from "@payloadcms/next/withPayload";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // The full-tier models carry a content hash in their name, so a file
        // never changes under its URL: the browser may keep it for good, and
        // a returning visitor pays for the 6.7 MB once.
        source: "/models/chat-:lang.:hash.bin",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default withPayload(nextConfig);
