import { Resvg } from "@resvg/resvg-js";
import satori, { type Font } from "satori";
import { render } from "svelte/server";
import { readFileSync } from "node:fs";
import { icons } from "$lib/icons";
import { SITE_URL } from "$lib/site-config";

/**
 * Build-time OG image rendering (satori + resvg). This module is only used
 * by the prerendered /og/... endpoint, so it never ships to the worker.
 */

const OG_IMAGE_SIZE = { width: 1200, height: 630 };

export type OgIcon = keyof typeof icons;

export type OgMarker =
  | { kind: "post"; category?: string; date: string }
  | { kind: "icon"; icon: OgIcon };

export interface OgCard {
  title: string;
  description?: string;
  /** The row above the title; the home card has none. */
  marker?: OgMarker;
  brandName: string;
  brandTagline: string;
}

const COLORS = {
  bench: "#D1CFC5",
  paper: "#FAF9F5",
  ink: "#141413",
  inkLight: "#5E5D59",
  accent: "#D97757",
};

const SANS = '"B612", "Noto Sans SC"';
const MONO = '"B612 Mono", "Noto Sans SC"';

const SLIP_WIDTH = 1060;

const DOMAIN = new URL(SITE_URL).host;

// ---------------------------------------------------------------------------
// Minimal element helper — satori consumes React-element-shaped objects.
// ---------------------------------------------------------------------------

interface Node {
  type: string;
  props: Record<string, unknown>;
}

type Child = Node | string | false | undefined | null;

function h(
  type: string,
  props: Record<string, unknown>,
  ...children: Child[]
): Node {
  const flat = children.flat().filter(Boolean);
  return {
    type,
    props: { ...props, children: flat.length === 1 ? flat[0] : flat },
  };
}

function svgDataUri(svg: string): string {
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

// ---------------------------------------------------------------------------
// Fonts — B612 and B612 Mono are bundled; CJK glyphs are fetched as tiny
// subsets from Google Fonts at build time (cached per charset).
// ---------------------------------------------------------------------------

const fonts = (
  [
    { name: "B612", file: "b612-400.ttf", weight: 400 },
    { name: "B612", file: "b612-700.ttf", weight: 700 },
    { name: "B612 Mono", file: "b612-mono-400.ttf", weight: 400 },
    { name: "B612 Mono", file: "b612-mono-700.ttf", weight: 700 },
  ] as const
).map(({ name, file, weight }) => ({
  name,
  data: readFileSync(`src/lib/og/fonts/${file}`),
  weight,
  style: "normal" as const,
}));

const cjkFontCache = new Map<string, Font[]>();

async function loadCjkSubset(text: string): Promise<Font[]> {
  const chars = Array.from(new Set(Array.from(text)))
    .filter((char) => char.charCodeAt(0) > 127)
    .sort()
    .join("");
  if (!chars) return [];

  const cached = cjkFontCache.get(chars);
  if (cached !== undefined) return cached;

  let result: Font[] = [];
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&text=${encodeURIComponent(chars)}`,
      { headers: { "User-Agent": "curl/8" } },
    ).then((response) => response.text());

    const faces = css.matchAll(
      /font-weight:\s*(400|700);\s*src:\s*url\(([^)]+)\)/g,
    );
    result = await Promise.all(
      Array.from(faces, async ([, weight, url]) => ({
        name: "Noto Sans SC",
        data: await fetch(url).then((response) => response.arrayBuffer()),
        weight: Number(weight) as 400 | 700,
        style: "normal" as const,
      })),
    );
  } catch (error) {
    console.warn("[og] failed to load CJK font subset:", error);
  }

  cjkFontCache.set(chars, result);
  return result;
}

// ---------------------------------------------------------------------------
// Building blocks
// ---------------------------------------------------------------------------

const AVATAR_DATA_URI = `data:image/jpeg;base64,${readFileSync("src/lib/og/avatar.jpg").toString("base64")}`;

const ICON_SIZE = 32;

function icon(name: OgIcon): Node {
  const { body } = render(icons[name], {
    props: { size: ICON_SIZE, color: COLORS.accent, strokeWidth: 2 },
  });
  return h("img", {
    src: svgDataUri(body),
    width: ICON_SIZE,
    height: ICON_SIZE,
  });
}

function chip(text: string): Node {
  return h(
    "div",
    {
      style: {
        display: "flex",
        fontSize: "15px",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        padding: "5px 10px 4px",
        border: "1.5px solid rgba(217, 119, 87, 0.4)",
        borderRadius: "2px",
        color: COLORS.accent,
        backgroundColor: "rgba(217, 119, 87, 0.06)",
      },
    },
    text,
  );
}

function markerRow(marker: OgMarker): Node {
  switch (marker.kind) {
    case "post":
      return h(
        "div",
        { style: { display: "flex", alignItems: "center", gap: "18px" } },
        marker.category && chip(marker.category),
        h(
          "div",
          {
            style: {
              display: "flex",
              fontSize: "15px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: COLORS.inkLight,
            },
          },
          marker.date,
        ),
      );
    case "icon":
      return icon(marker.icon);
  }
}

/** Steps down so a title at the 99-char cap still fits in three lines. */
function titleSize(title: string): number {
  if (title.length <= 34) return 60;
  if (title.length <= 64) return 52;
  return 44;
}

function content(card: OgCard): Node {
  return h(
    "div",
    { style: { display: "flex", flexDirection: "column", gap: "20px" } },
    card.marker && markerRow(card.marker),
    h(
      "div",
      {
        style: {
          display: "block",
          lineClamp: 3,
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: `${titleSize(card.title)}px`,
          lineHeight: 1.12,
          color: COLORS.ink,
        },
      },
      card.title,
    ),
    card.description &&
      h(
        "div",
        {
          style: {
            display: "block",
            lineClamp: 2,
            fontFamily: SANS,
            fontSize: "26px",
            lineHeight: 1.45,
            color: COLORS.inkLight,
          },
        },
        card.description,
      ),
  );
}

function footer(card: OgCard): Node {
  return h(
    "div",
    {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "auto",
        paddingTop: "26px",
        borderTop: "1.5px dashed rgba(20, 20, 19, 0.14)",
      },
    },
    h(
      "div",
      { style: { display: "flex", alignItems: "center", gap: "20px" } },
      h(
        "div",
        {
          style: {
            display: "flex",
            padding: "6px",
            borderRadius: "999px",
            backgroundColor: "rgba(0, 0, 0, 0.05)",
          },
        },
        h("img", {
          src: AVATAR_DATA_URI,
          width: 40,
          height: 40,
          style: {
            borderRadius: "999px",
            border: "1px solid rgba(0, 0, 0, 0.1)",
          },
        }),
      ),
      h(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "6px" } },
        h(
          "div",
          {
            style: {
              display: "flex",
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "0.28em",
              color: COLORS.ink,
            },
          },
          card.brandName,
        ),
        h(
          "div",
          {
            style: {
              display: "flex",
              fontSize: "11px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: COLORS.inkLight,
            },
          },
          card.brandTagline,
        ),
      ),
    ),
    h(
      "div",
      {
        style: {
          display: "flex",
          fontSize: "14px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: COLORS.inkLight,
        },
      },
      DOMAIN,
    ),
  );
}

function perforations(side: "left" | "right"): Node {
  return h(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "32px",
        position: "absolute",
        [side]: 0,
        top: "22px",
        width: "22px",
        opacity: 0.3,
      },
    },
    ...Array.from({ length: 14 }, () =>
      h("div", {
        style: {
          display: "flex",
          width: "8px",
          height: "8px",
          borderRadius: "8px",
          border: `1.5px solid ${COLORS.ink}`,
        },
      }),
    ),
  );
}

const TEAR_DEPTH = 8;

const TEAR_DATA_URI = (() => {
  const tooth = 16;
  let path = `M0 0 L${SLIP_WIDTH} 0 `;
  for (let x = SLIP_WIDTH; x > 0; x -= tooth) {
    path += `L${x - tooth / 2} ${TEAR_DEPTH} L${x - tooth} 0 `;
  }
  return svgDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${SLIP_WIDTH}" height="${TEAR_DEPTH}"><path d="${path}Z" fill="${COLORS.paper}"/></svg>`,
  );
})();

function slip(card: OgCard): Node {
  return h(
    "div",
    { style: { display: "flex", flexDirection: "column" } },
    h(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          position: "relative",
          width: `${SLIP_WIDTH}px`,
          height: "560px",
          padding: "54px 76px 40px",
          backgroundColor: COLORS.paper,
          backgroundImage:
            "radial-gradient(circle, rgba(0, 0, 0, 0.05) 1px, transparent 1px)",
          backgroundSize: "7px 7px",
          boxShadow:
            "0 18px 36px rgba(75, 57, 43, 0.14), 0 3px 8px rgba(75, 57, 43, 0.12)",
        },
      },
      // The shadow of the printer slot the slip just fed out of.
      h("div", {
        style: {
          display: "flex",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "52px",
          backgroundImage:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0))",
        },
      }),
      perforations("left"),
      perforations("right"),
      content(card),
      footer(card),
    ),
    h("img", { src: TEAR_DATA_URI, width: SLIP_WIDTH, height: TEAR_DEPTH }),
  );
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

function cardText(card: OgCard): string {
  const { marker } = card;
  return [
    card.title,
    card.description,
    marker?.kind === "post" && marker.category,
    marker?.kind === "post" && marker.date,
    card.brandName,
    card.brandTagline,
  ]
    .filter(Boolean)
    .join("");
}

export async function generateOgImage(card: OgCard): Promise<Buffer> {
  const cjkFonts = await loadCjkSubset(cardText(card));

  const tree = h(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: COLORS.bench,
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.045) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        backgroundPosition: "13px 13px",
        fontFamily: MONO,
      },
    },
    slip(card),
  );

  const svg = await satori(tree as never, {
    ...OG_IMAGE_SIZE,
    fonts: [...fonts, ...cjkFonts],
  });

  return new Resvg(svg, {
    fitTo: { mode: "width", value: OG_IMAGE_SIZE.width },
  })
    .render()
    .asPng();
}
