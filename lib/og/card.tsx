import { ImageResponse } from "next/og";

/**
 * The share card, drawn from plain strings.
 *
 * Kept apart from the route so it can be rendered without the CMS: the route
 * reads the content and hands it over, and a script can hand over sample text
 * to look at the card in a viewer. Everything the renderer needs — the two
 * font faces and the buddy portrait — comes in as bytes, read by the caller.
 */

export const CARD_SIZE = { width: 1200, height: 630 };

/** Side padding, and the buddy's footprint in the header row. */
const PAD_X = 64;
const BUDDY = 112;
const GAP = 28;

export interface CardCopy {
  name: string;
  tagline: string;
  location: string;
  /** "portfolio shell", or its translation. */
  prefix: string;
  banner: string;
  placeholder: string;
  /** The site's host, shown bottom right. */
  host: string;
}

export interface CardAssets {
  regular: Buffer;
  bold: Buffer;
  /** The pixelated buddy, as PNG. */
  buddy: Buffer;
}

/** globals.css's :root, as the browser resolves it — the renderer reads sRGB only. */
const THEME = {
  bg: "#0c0c0c",
  fg: "#cfcdc7",
  dim: "#8a8880",
  faint: "#7c7b77",
  hair: "#242422",
  accent: "#82d399",
  warn: "#eccb61",
};

const FONT = "JetBrains Mono";

export function renderCard(copy: CardCopy, assets: CardAssets): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: `52px ${PAD_X}px 48px`,
          background: THEME.bg,
          color: THEME.fg,
          fontFamily: FONT,
          fontSize: 26,
          lineHeight: 1.5,
        }}
      >
        {/* The header row, as on the page. */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: GAP }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- the renderer draws a plain img */}
          <img
            src={`data:image/png;base64,${assets.buddy.toString("base64")}`}
            width={BUDDY}
            height={BUDDY}
            alt=""
          />
          {/* Sized, or the identity line runs off the edge rather than wrapping. */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: CARD_SIZE.width - 2 * PAD_X - BUDDY - GAP,
            }}
          >
            <div style={{ display: "flex" }}>
              <span style={{ fontWeight: 700 }}>kr</span>
              <span style={{ color: THEME.dim, marginLeft: 14 }}>v2.4.1</span>
            </div>
            <div style={{ color: THEME.dim }}>{`${copy.prefix} · ${copy.name} · ${copy.tagline}`}</div>
            <div style={{ color: THEME.dim }}>~/work/kevin-riou</div>
          </div>
        </div>
        <div style={{ height: 2, background: THEME.hair, marginTop: 20, marginBottom: 20 }} />
        <div style={{ display: "flex", color: THEME.warn }}>
          <span>{`▲ ${copy.banner}`}</span>
          <span style={{ color: THEME.dim, marginLeft: 14 }}>· /now</span>
        </div>

        {/* The name, at a size a feed can read. */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.15 }}>{copy.name}</div>
          <div style={{ fontSize: 30, color: THEME.accent, marginTop: 10 }}>{copy.tagline}</div>
          <div style={{ color: THEME.dim, marginTop: 6 }}>{copy.location}</div>
        </div>

        {/* The prompt, with the caret, and where this is. */}
        <div style={{ display: "flex", alignItems: "center", marginTop: 40 }}>
          <span style={{ color: THEME.accent }}>❯</span>
          <span style={{ marginLeft: 18 }}>{copy.placeholder}</span>
          <div style={{ width: 15, height: 30, background: THEME.accent, marginLeft: 8 }} />
          <span style={{ marginLeft: "auto", color: THEME.faint }}>{copy.host}</span>
        </div>
      </div>
    ),
    {
      ...CARD_SIZE,
      fonts: [
        { name: FONT, data: assets.regular, weight: 400, style: "normal" },
        { name: FONT, data: assets.bold, weight: 700, style: "normal" },
      ],
    },
  );
}
