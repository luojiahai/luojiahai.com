import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import { readFileSync } from "node:fs";

/**
 * Build-time OG image rendering (satori + resvg). This module is only used
 * by the prerendered /og/... endpoint, so it never ships to the worker.
 */

const OG_IMAGE_SIZE = { width: 1200, height: 630 };

export interface OgImageOptions {
  title: string;
  description?: string;
  category?: string;
  date?: string;
  type?: "post" | "page";
  emoji?: string;
  subtitle?: string;
  brandName: string;
  brandTagline: string;
}

/** The BRT panel lighting from app.css; a shared image has no DIM. */
const PANEL = {
  face: "#4c5b68",
  hi: "#677783",
  lo: "#34404a",
  seam: "#1c2328",
};

const ECAM = {
  screen: "#000000",
  white: "#f4f6f6",
  text: "#d5dbdb",
  green: "#3fe23f",
  cyan: "#33d6ef",
};

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
    props: { ...props, children: flat.length > 1 ? flat : flat[0] },
  };
}

// ---------------------------------------------------------------------------
// Fonts — B612 is bundled; CJK glyphs are fetched as tiny subsets from
// Google Fonts at build time (cached per charset).
// ---------------------------------------------------------------------------

const fontRegular = readFileSync("src/lib/og/fonts/b612-400.ttf");
const fontBold = readFileSync("src/lib/og/fonts/b612-700.ttf");
const fontMono = readFileSync("src/lib/og/fonts/b612-mono-400.ttf");

type CjkWeight = 400 | 700;
type CjkSubset = Partial<Record<CjkWeight, ArrayBuffer>>;

const cjkFontCache = new Map<string, CjkSubset>();

async function loadCjkSubset(text: string): Promise<CjkSubset> {
  const chars = Array.from(new Set(Array.from(text)))
    .filter((char) => char.charCodeAt(0) > 127)
    .sort()
    .join("");
  if (!chars) return {};

  const cached = cjkFontCache.get(chars);
  if (cached !== undefined) return cached;

  const result: CjkSubset = {};
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&text=${encodeURIComponent(chars)}`,
      { headers: { "User-Agent": "curl/8" } },
    ).then((response) => response.text());

    for (const face of css.split("@font-face").slice(1)) {
      const weight = Number(face.match(/font-weight:\s*(\d+)/)?.[1]);
      const url = face.match(/src:\s*url\(([^)]+)\)/)?.[1];
      if ((weight === 400 || weight === 700) && url) {
        result[weight] = await fetch(url).then((response) =>
          response.arrayBuffer(),
        );
      }
    }
  } catch (error) {
    console.warn("[og] failed to load CJK font subset:", error);
  }

  cjkFontCache.set(chars, result);
  return result;
}

// ---------------------------------------------------------------------------
// Emoji — resolved to Twemoji data URIs at build time (cached per grapheme).
// ---------------------------------------------------------------------------

const emojiCache = new Map<string, string | null>();

async function loadEmoji(grapheme: string): Promise<string | null> {
  const cached = emojiCache.get(grapheme);
  if (cached !== undefined) return cached;

  const codePoints = Array.from(grapheme).map((char) =>
    char.codePointAt(0)!.toString(16),
  );
  const candidates = [
    codePoints.join("-"),
    codePoints.filter((cp) => cp !== "fe0f").join("-"),
  ];

  let result: string | null = null;
  for (const name of new Set(candidates)) {
    try {
      const response = await fetch(
        `https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg/${name}.svg`,
      );
      if (response.ok) {
        const svg = await response.text();
        result = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
        break;
      }
    } catch {
      // try the next candidate / give up gracefully
    }
  }

  if (!result) console.warn(`[og] failed to load emoji ${grapheme}`);
  emojiCache.set(grapheme, result);
  return result;
}

const SCREWS = [
  { top: 14, left: 14, rotate: 35 },
  { top: 14, right: 14, rotate: -20 },
  { bottom: 14, left: 14, rotate: 80 },
  { bottom: 14, right: 14, rotate: 10 },
];

function screw({ rotate, ...position }: (typeof SCREWS)[number]): Node {
  return h(
    "div",
    {
      style: {
        position: "absolute",
        ...position,
        width: 16,
        height: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        backgroundImage:
          "radial-gradient(circle at 35% 30%, #d2d8dc, #7b858c 55%, #3d454b)",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
      },
    },
    h("div", {
      style: {
        width: 13,
        height: 3,
        borderRadius: 2,
        backgroundColor: "#2b3237",
        transform: `rotate(${rotate}deg)`,
      },
    }),
  );
}

function rivet(position: Record<string, number>): Node {
  return h("div", {
    style: {
      position: "absolute",
      ...position,
      width: 6,
      height: 6,
      borderRadius: "50%",
      backgroundColor: "#79838a",
      boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.6)",
    },
  });
}

function placard({ brandName, brandTagline }: OgImageOptions): Node {
  return h(
    "div",
    {
      style: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        padding: "10px 30px",
        borderRadius: 6,
        backgroundImage:
          "linear-gradient(160deg, #e3e7ea, #a9b2b8 55%, #c9d0d4)",
        boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.8), inset 0 -1px 0 rgba(0, 0, 0, 0.25), 0 2px 0 ${PANEL.seam}`,
      },
    },
    h(
      "div",
      { style: { display: "flex", flexDirection: "column", gap: 7 } },
      h(
        "div",
        {
          style: {
            fontSize: 22,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "0.14em",
            color: "#1b2125",
            textShadow: "0 1px 0 rgba(255, 255, 255, 0.6)",
          },
        },
        brandName,
      ),
      h(
        "div",
        {
          style: {
            fontSize: 13,
            lineHeight: 1,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "#3a444b",
          },
        },
        brandTagline,
      ),
    ),
    rivet({ top: 6, right: 7 }),
    rivet({ bottom: 6, right: 7 }),
    rivet({ top: 6, left: 7 }),
    rivet({ bottom: 6, left: 7 }),
  );
}

/** Width in Latin-letter units: a CJK glyph is about two letters wide. */
function visualLength(text: string): number {
  return Array.from(text).reduce(
    (length, char) => length + (char.charCodeAt(0) > 0x2e7f ? 2 : 1),
    0,
  );
}

function annunciator(legend: string): Node {
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 84,
        height: 34,
        borderRadius: 3,
        backgroundColor: "#0d0f0e",
        boxShadow: "inset 0 1px 4px rgba(0, 0, 0, 0.9), 0 0 0 2px #15191c",
      },
    },
    // satori paints a textShadow onto the element's box as well, so the glow
    // sits on its own element inside the lamp.
    h(
      "div",
      {
        style: {
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: "0.1em",
          color: "#5dff66",
          textShadow: "0 0 8px rgba(70, 255, 80, 0.85)",
        },
      },
      legend,
    ),
  );
}

function screenTitle(title: string, fontSize: number, page: boolean): Node {
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignSelf: "flex-start",
        paddingBottom: 4,
        borderBottom: `3px solid ${ECAM.white}`,
        fontSize,
        fontWeight: 700,
        lineHeight: 1.25,
        letterSpacing: page ? "0.05em" : "0.02em",
        textTransform: page ? "uppercase" : "none",
        // satori shrinks a balanced box with no break opportunity to its
        // narrowest guess, so the underline stops short of a one-word title.
        textWrap: title.includes(" ") ? "balance" : "wrap",
        color: ECAM.white,
      },
    },
    title,
  );
}

function screenText(text: string, lines: number): Node {
  return h(
    "div",
    {
      style: {
        display: "block",
        lineClamp: lines,
        fontSize: 28,
        lineHeight: 1.4,
        color: ECAM.text,
      },
    },
    text,
  );
}

function postScreen({ title, description, category, date }: OgImageOptions) {
  const length = visualLength(title);
  return h(
    "div",
    { style: { display: "flex", flexDirection: "column", gap: 28 } },
    category || date
      ? h(
          "div",
          {
            style: { display: "flex", alignItems: "center" },
          },
          category
            ? h(
                "div",
                {
                  style: {
                    display: "flex",
                    padding: "8px 14px",
                    border: `2px solid ${ECAM.cyan}`,
                    fontSize: 20,
                    fontWeight: 700,
                    lineHeight: 1,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: ECAM.cyan,
                  },
                },
                category,
              )
            : undefined,
          date
            ? h(
                "div",
                {
                  style: {
                    marginLeft: "auto",
                    fontFamily: '"B612 Mono", "Noto Sans SC"',
                    fontSize: 24,
                    color: ECAM.green,
                  },
                },
                date,
              )
            : undefined,
        )
      : undefined,
    screenTitle(
      title,
      length > 72 ? 40 : length > 48 ? 46 : length > 24 ? 54 : 62,
      false,
    ),
    description ? screenText(description, length > 48 ? 2 : 3) : undefined,
  );
}

function pageScreen({ title, subtitle, description, emoji }: OgImageOptions) {
  const text = subtitle || description;
  return h(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        flex: 1,
        gap: 28,
      },
    },
    emoji
      ? h("div", { style: { display: "flex", fontSize: 96, lineHeight: 1 } }, emoji)
      : undefined,
    screenTitle(title, visualLength(title) > 20 ? 54 : 64, true),
    text ? screenText(text, 2) : undefined,
  );
}

function displayUnit(options: OgImageOptions): Node {
  return h(
    "div",
    {
      style: {
        display: "flex",
        flex: 1,
        padding: 18,
        borderRadius: 14,
        backgroundImage: "linear-gradient(#2d3439, #22282c)",
        boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 0 0 2px ${PANEL.seam}, 0 14px 30px -14px rgba(0, 0, 0, 0.8)`,
      },
    },
    h(
      "div",
      {
        style: {
          position: "relative",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: "40px 52px",
          borderRadius: 6,
          backgroundColor: ECAM.screen,
          boxShadow: "inset 0 0 0 1px #050505",
          overflow: "hidden",
        },
      },
      options.type === "page" ? pageScreen(options) : postScreen(options),
      h("div", {
        style: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            "linear-gradient(125deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0) 32%)",
        },
      }),
    ),
  );
}

export async function generateOgImage(
  options: OgImageOptions,
): Promise<Buffer> {
  const allText = [
    options.title,
    options.description,
    options.subtitle,
    options.category,
    options.date,
    options.brandName,
    options.brandTagline,
  ]
    .filter(Boolean)
    .join("");
  const cjkFont = await loadCjkSubset(allText);

  const tree = h(
    "div",
    {
      style: {
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 22,
        padding: "36px 40px 30px",
        backgroundColor: PANEL.face,
        boxShadow: `inset 0 2px 0 ${PANEL.hi}, inset 0 -2px 0 ${PANEL.lo}`,
        fontFamily: '"B612", "Noto Sans SC", sans-serif',
      },
    },
    ...SCREWS.map(screw),
    displayUnit(options),
    h(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        },
      },
      placard(options),
      annunciator("NORM"),
    ),
  );

  const svg = await satori(tree as never, {
    ...OG_IMAGE_SIZE,
    fonts: [
      { name: "B612", data: fontRegular, weight: 400, style: "normal" },
      { name: "B612", data: fontBold, weight: 700, style: "normal" },
      { name: "B612 Mono", data: fontMono, weight: 400, style: "normal" },
      ...Object.entries(cjkFont).map(([weight, data]) => ({
        name: "Noto Sans SC",
        data,
        weight: Number(weight) as CjkWeight,
        style: "normal" as const,
      })),
    ],
    loadAdditionalAsset: async (code, segment) => {
      if (code === "emoji") {
        const uri = await loadEmoji(segment);
        if (uri) return uri;
      }
      return segment;
    },
  });

  return new Resvg(svg, {
    fitTo: { mode: "width", value: OG_IMAGE_SIZE.width },
  })
    .render()
    .asPng();
}
