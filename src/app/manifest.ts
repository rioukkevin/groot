import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Portfolio",
    short_name: "Portfolio",
    description: "Portfolio",
    start_url: "/",
    display: "standalone",
    background_color: "#262626",
    theme_color: "#262626",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    orientation: "portrait",
    lang: "en",
    categories: ["portfolio", "resume", "cv"],
  };
}
