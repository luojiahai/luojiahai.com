import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import { readFileSync } from "node:fs";

/**
 * Build-time OG image rendering (satori + resvg). This module is only used
 * by the prerendered /og/... endpoint, so it never ships to the worker.
 */

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

export interface OgImageOptions {
  title: string;
  description?: string;
  category?: string;
  date?: string;
  type?: "post" | "life" | "page";
  emoji?: string;
  subtitle?: string;
  brandName?: string;
  brandTagline?: string;
  showTitleAvatar?: boolean;
}

const COLORS = {
  body: "#F5F0E8",
  paper: "#FFFEF9",
  ink: "#2C2824",
  inkLight: "#8A8078",
  accent: "#FF6B35",
  border: "rgba(44, 40, 36, 0.1)",
  shadow: "rgba(0, 0, 0, 0.06)",
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
    props: { ...props, children: flat.length === 1 ? flat[0] : flat },
  };
}

// ---------------------------------------------------------------------------
// Fonts — JetBrains Mono is bundled; CJK glyphs are fetched as tiny subsets
// from Google Fonts at build time (cached per charset).
// ---------------------------------------------------------------------------

const fontRegular = readFileSync("src/lib/og/fonts/jetbrains-mono-400.ttf");
const fontBold = readFileSync("src/lib/og/fonts/jetbrains-mono-700.ttf");

const cjkFontCache = new Map<string, ArrayBuffer | null>();

async function loadCjkSubset(text: string): Promise<ArrayBuffer | null> {
  const chars = Array.from(new Set(Array.from(text)))
    .filter((char) => char.charCodeAt(0) > 127)
    .sort()
    .join("");
  if (!chars) return null;

  const cached = cjkFontCache.get(chars);
  if (cached !== undefined) return cached;

  let result: ArrayBuffer | null = null;
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&text=${encodeURIComponent(chars)}`,
      { headers: { "User-Agent": "curl/8" } },
    ).then((response) => response.text());

    const url = css.match(/src:\s*url\(([^)]+)\)/)?.[1];
    if (url) {
      result = await fetch(url).then((response) => response.arrayBuffer());
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

function toCodePoints(grapheme: string): string[] {
  return Array.from(grapheme).map(
    (char) => char.codePointAt(0)!.toString(16).padStart(4, "0").replace(/^0+(?=\d{4})/, ""),
  );
}

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

// ---------------------------------------------------------------------------
// Building blocks (ported from the previous next/og implementation)
// ---------------------------------------------------------------------------

const AVATAR_DATA_URI = `data:image/jpeg;base64,${readFileSync("src/lib/og/avatar.jpg").toString("base64")}`;

function avatar(size: number, circle?: boolean): Node {
  return h("img", {
    src: AVATAR_DATA_URI,
    width: size,
    height: size,
    style: {
      borderRadius: circle ? "50%" : "12px",
      border: `1px solid ${COLORS.border}`,
      boxShadow: `0 4px 12px ${COLORS.shadow}`,
    },
  });
}

function brandingFooter(options: OgImageOptions, large?: boolean): Node {
  const avatarSize = large ? 56 : 48;
  const nameSize = large ? 20 : 18;
  const taglineSize = large ? 16 : 14;

  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderTop: `1px dashed ${COLORS.border}`,
        paddingTop: "24px",
        width: "100%",
        marginTop: "auto",
      },
    },
    h(
      "div",
      { style: { display: "flex", alignItems: "center", gap: "16px" } },
      avatar(avatarSize),
      h(
        "div",
        { style: { display: "flex", flexDirection: "column" } },
        h(
          "div",
          {
            style: {
              fontSize: `${nameSize}px`,
              fontWeight: 700,
              color: COLORS.ink,
              letterSpacing: "0.05em",
              display: "flex",
            },
          },
          options.brandName || "LUOJIAHAI",
        ),
        h(
          "div",
          {
            style: {
              fontSize: `${taglineSize}px`,
              color: COLORS.inkLight,
              display: "flex",
            },
          },
          "luojiahai.com",
        ),
      ),
    ),
    h(
      "div",
      {
        style: {
          fontSize: `${taglineSize}px`,
          color: COLORS.inkLight,
          letterSpacing: "0.05em",
          display: "flex",
          opacity: 0.8,
        },
      },
      options.brandTagline || "Hello, World!",
    ),
  );
}

function dotPattern(): Node {
  return h("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.04,
      display: "flex",
      backgroundImage: `radial-gradient(circle at center, ${COLORS.ink} 1px, transparent 1px)`,
      backgroundSize: "30px 30px",
    },
  });
}

function articleLayout(options: OgImageOptions): Node {
  const { title, description, category, date, type } = options;
  const typeLabel = type === "life" ? "LIFE" : type === "post" ? "TECH" : "";

  return h(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        padding: "50px 60px",
      },
    },
    // Meta tags row
    h(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "32px",
        },
      },
      typeLabel
        ? h(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                padding: "6px 14px",
                backgroundColor: COLORS.accent,
                color: COLORS.paper,
                fontSize: "16px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                borderRadius: "4px",
                boxShadow: "0 4px 10px rgba(255, 107, 53, 0.2)",
              },
            },
            typeLabel,
          )
        : undefined,
      category
        ? h(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                padding: "6px 14px",
                border: `1px solid ${COLORS.border}`,
                color: COLORS.inkLight,
                fontSize: "16px",
                fontWeight: 400,
                letterSpacing: "0.05em",
                borderRadius: "4px",
                backgroundColor: "rgba(0,0,0,0.02)",
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
                display: "flex",
                color: COLORS.inkLight,
                fontSize: "16px",
                fontWeight: 400,
                marginLeft: "8px",
              },
            },
            date,
          )
        : undefined,
    ),
    // Main content
    h(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          maxWidth: "900px",
        },
      },
      h(
        "div",
        {
          style: {
            fontSize: title.length > 30 ? "42px" : "48px",
            fontWeight: 700,
            color: COLORS.ink,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            display: "flex",
          },
        },
        title,
      ),
      description
        ? h(
            "div",
            {
              style: {
                fontSize: "36px",
                color: COLORS.inkLight,
                lineHeight: 1.4,
                display: "flex",
                marginTop: "8px",
              },
            },
            description.length > 140
              ? description.slice(0, 140) + "..."
              : description,
          )
        : undefined,
    ),
    brandingFooter(options),
  );
}

function pageLayout(options: OgImageOptions): Node {
  const { title, description, emoji, subtitle, showTitleAvatar } = options;

  return h(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        padding: "50px 60px",
      },
    },
    h(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "32px",
          flex: 1,
          justifyContent: "center",
        },
      },
      showTitleAvatar
        ? h(
            "div",
            {
              style: {
                display: "flex",
                filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.1))",
              },
            },
            avatar(120, true),
          )
        : undefined,
      emoji
        ? h(
            "div",
            {
              style: {
                fontSize: "100px",
                display: "flex",
                lineHeight: 1,
                filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.1))",
              },
            },
            emoji,
          )
        : undefined,
      h(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          },
        },
        h(
          "div",
          {
            style: {
              fontSize: showTitleAvatar
                ? title.length > 20
                  ? "44px"
                  : "48px"
                : title.length > 20
                  ? "46px"
                  : "50px",
              fontWeight: 700,
              color: COLORS.ink,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              display: "flex",
              textAlign: "center",
            },
          },
          title,
        ),
        subtitle || description
          ? h(
              "div",
              {
                style: {
                  fontSize: "38px",
                  color: COLORS.inkLight,
                  lineHeight: 1.4,
                  display: "flex",
                  textAlign: "center",
                  maxWidth: "800px",
                },
              },
              subtitle || description,
            )
          : undefined,
      ),
    ),
    brandingFooter(options, true),
  );
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

export async function generateOgImage(
  options: OgImageOptions,
): Promise<Buffer> {
  const { type = "post" } = options;

  const allText = [
    options.title,
    options.description,
    options.subtitle,
    options.category,
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
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: COLORS.body,
        padding: "40px",
        position: "relative",
        fontFamily: '"JetBrains Mono", "Noto Sans SC", monospace',
      },
    },
    // The paper card
    h(
      "div",
      {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: COLORS.paper,
          borderRadius: "32px",
          boxShadow: `0 20px 50px ${COLORS.shadow}, 0 4px 12px rgba(0,0,0,0.04)`,
          border: `1px solid ${COLORS.border}`,
          position: "relative",
          overflow: "hidden",
        },
      },
      dotPattern(),
      // Top accent bar
      h("div", {
        style: {
          width: "100%",
          height: "8px",
          backgroundColor: COLORS.accent,
          display: "flex",
        },
      }),
      type === "page" ? pageLayout(options) : articleLayout(options),
    ),
  );

  const svg = await satori(tree as never, {
    ...OG_IMAGE_SIZE,
    fonts: [
      { name: "JetBrains Mono", data: fontRegular, weight: 400, style: "normal" },
      { name: "JetBrains Mono", data: fontBold, weight: 700, style: "normal" },
      ...(cjkFont
        ? [
            {
              name: "Noto Sans SC",
              data: cjkFont,
              weight: 400 as const,
              style: "normal" as const,
            },
            {
              name: "Noto Sans SC",
              data: cjkFont,
              weight: 700 as const,
              style: "normal" as const,
            },
          ]
        : []),
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
