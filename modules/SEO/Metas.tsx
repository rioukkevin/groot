import Head from "next/head";
import { MetaFavicons } from "./Favicon";

const DATAS = {
  title: "RIOU Kevin",
  description:
    "Je recherche une nouvelle aventure, si vous avez une mission, prenez contact !",
  url: "http://kevin.riou.pro",
  previewPath: "/preview.png",
};

export const Metas = () => {
  return (
    <Head>
      <MetaFavicons />
      {/* General */}
      <title>{DATAS.title}</title>
      <meta name="title" content={DATAS.title} />
      <meta name="description" content={DATAS.description} />
      {/* Facebook / Instagram / Pinterest / Discord / Slack / ... */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={DATAS.url} />
      <meta property="og:title" content={DATAS.title} />
      <meta property="og:description" content={DATAS.description} />
      <meta property="og:image" content={DATAS.previewPath} />
      <meta property="og:site_name" content={DATAS.title} />
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={DATAS.url} />
      <meta property="twitter:title" content={DATAS.title} />
      <meta property="twitter:description" content={DATAS.description} />
      <meta property="twitter:image" content={DATAS.previewPath} />
    </Head>
  );
};
