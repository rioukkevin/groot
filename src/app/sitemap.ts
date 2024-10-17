import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://kevin.riou.pro",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          en: "https://kevin.riou.pro/en",
          fr: "https://kevin.riou.pro/fr",
        },
      },
    },
  ];
}
