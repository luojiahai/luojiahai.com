// Regenerates every flight companion payload. For each aircraft registered in
// src/params/aircraft.ts it reads the markdown notes in src/lib/fly/<slug>/
// and writes src/lib/fly/<slug>.json. A sheet the aircraft's directory does
// not carry is read from src/lib/fly/shared/.
// Run with: pnpm fly
//
// The markdown stays the source of truth: edit the notes, re-run the script,
// and the interactive checklist follows.
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const FLY = resolve(ROOT, "src/lib/fly");

// Read as text rather than imported, so the script runs on plain Node.
const SLUGS = [...readFileSync(resolve(ROOT, "src/params/aircraft.ts"), "utf8")
  .matchAll(/\bslug:\s*"([^"]+)"/g)].map(m => m[1]);
if (!SLUGS.length) throw new Error("found no aircraft slugs in src/params/aircraft.ts");

const AIRCRAFT = {
  "fbw-a32nx": {
    // These titles wrap to three lines in the phase rail without a shorter label.
    railTitles: {
      "6-descent-planning-and-descent": "Descent",
      "7-approach-and-ils-landing": "Approach and Landing",
    },
    phaseLightColumns: {
      "2-starting-the-aircraft": ["Prep"],
      "4-engine-start-and-taxi": ["Start and Taxi"],
      "5-takeoff-climb-and-cruise": ["Takeoff", "Initial Climb", "Above 10,000 ft"],
      "6-descent-planning-and-descent": ["Descent 10,000 ft"],
      "7-approach-and-ils-landing": ["Final (G/S green)"],
      "8-after-landing-and-taxi-to-gate": ["After Landing"],
      "9-powering-down": ["Shutdown"],
    },
    aliases: { PERF: "APPROACH" },
  },
  "fbw-a380x": {
    railTitles: {},
    phaseLightColumns: {
      "2-cockpit-preparation": ["Prep"],
      "4-engine-start-and-taxi": ["Start and Taxi"],
      "5-takeoff-climb-and-cruise": ["Takeoff", "Initial Climb", "Above 10,000 ft"],
      "6-descent": ["Descent 10,000 ft"],
      "7-landing": ["Final (G/S green)"],
      "8-after-landing-and-taxi-to-gate": ["After Landing"],
      "9-powering-down": ["Shutdown"],
    },
    aliases: {},
  },
};

// Per-aircraft state, reset at the start of each buildAircraft run so one
// aircraft's names, links and item ids never carry into the next.
let NOTES, CONFIG, NAMES, CONTROL_LABELS, lookupControl;
let duplicateNames, unresolved, nameless, idSeen, unknownVerbs;

const read = p => {
  const own = resolve(NOTES, p);
  return readFileSync(existsSync(own) ? own : resolve(FLY, "shared", p), "utf8");
};

const VERIFY_VERBS = new Set([
  "verify", "check", "checked", "confirm", "crosscheck", "scan", "look", "identify", "read", "note",
  "monitor", "review",
]);
const ACT_VERBS = new Set([
  "set", "select", "press", "enter", "adjust", "type", "dial", "push", "reset", "pull", "leave",
  "have", "load", "wait", "obtain", "deflect", "reinsert", "roll", "retract", "request", "be",
  "report", "match", "generate", "display", "link", "hold", "repeat", "scroll", "copy", "double",
  "arm", "advance", "perform", "steer", "preset", "revise", "compute", "draw", "descend", "keep",
  "fly", "aim", "out", "brake", "slow", "connect", "call", "run", "advise", "release",
]);

/* ------------------------------------------------------------------ *
 * inline markdown -> fragment nodes the template can render safely
 * ------------------------------------------------------------------ */

function parseInline(md, resolveHref = () => null) {
  const out = [];
  let rest = String(md).replace(/\[\^[^\]]+\]/g, ""); // drop footnote markers
  const push = (t, v, href) => {
    if (v === "") return;
    const tip = t === "b" ? nameOf(v) : null;
    out.push(href ? { t, v, href } : tip ? { t, v, tip } : { t, v });
  };

  // New branches go on the end: the dispatch below is positional, so inserting
  // a group in the middle silently shifts every branch after it.
  const re = /(\[([^\]]*)\]\(([^)]+)\))|(\*\*([^*]+)\*\*)|(<sub>([^<]*)<\/sub>)|(`([^`]*)`)|(\*([^*]+)\*)|(~([^~\s]+)~)/;
  let m;
  while ((m = re.exec(rest))) {
    push("text", rest.slice(0, m.index));
    if (m[1]) {
      const text = m[2];
      const href = resolveHref(text, m[3]) ?? (/^https?:/.test(m[3]) ? m[3] : null);
      if (href) push("link", text, href); else push("text", text);
    } else if (m[4]) push("b", m[5]);
    else if (m[6]) push("sub", m[7]);
    else if (m[8]) push("b", m[9]);
    else if (m[10]) push("i", m[11]);
    else if (m[12]) push("sub", m[13]); // V~2~, the FlyByWire subscript spelling
    rest = rest.slice(m.index + m[0].length);
  }
  push("text", rest);
  return out;
}

const stripMd = md =>
  md.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/<\/?sub>/g, "")
    .replace(/<br\s*\/?>\s*-\s*<\/br>/gi, " — ") // the vendored V1 cell's "or" separator
    .replace(/<br\s*\/?>|<\/br>/gi, " ")
    .replace(/~([^~\s]+)~/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

/* ------------------------------------------------------------------ *
 * names.md -> LABEL -> full name
 *
 * The one name source: it fills the line under each checklist control and the
 * tooltip on a bolded setting. Deliberately standalone, and deliberately not
 * resolved out of abbreviations.md — that page is a verbatim copy of an
 * airline-wide glossary, so a re-download must not be able to drop a name
 * here, and it reads RET as "RETurn" where a speed brake lever means
 * "RETracted".
 *
 * A "–" value means the label reads plainly on its own, on purpose.
 * ------------------------------------------------------------------ */

const nameKey = s => String(s).trim().toUpperCase().replace(/\s+/g, " ");

function buildNames() {
  const names = {};
  for (const line of read("names.md").split("\n")) {
    if (!line.startsWith("|")) continue;
    const cells = line.split("|").slice(1, -1).map(c => c.trim());
    if (cells.length !== 2) continue;
    const name = stripMd(cells[0]);
    const full = stripMd(cells[1]);
    if (!name || /^-+$/.test(name) || name === "Name") continue;
    const key = nameKey(name);
    const value = !full || /^[-–—]$/.test(full) ? null : full;
    if (key in names && names[key] !== value) duplicateNames.push(key);
    names[key] = value;
  }
  return names;
}

const nameOf = s => NAMES[nameKey(s)] ?? null;

/* ------------------------------------------------------------------ *
 * controls.md -> docs URL, resolved within the linked section
 *
 * Procedure links carry the section as an anchor (controls.md#performance),
 * which disambiguates names that appear on more than one panel — "FLAPS"
 * under #performance is the MCDU field, under #flaps-and-speed-brake it is
 * the pedestal lever.
 * ------------------------------------------------------------------ */

const slugify = s =>
  s.toLowerCase().replace(/[`*_~]/g, "").replace(/[^\w\- ]/g, "").replace(/ /g, "-");

function buildControlIndex() {
  const md = read("controls.md");
  const sections = new Map(); // slug -> Map(NAME -> url)
  const global = new Map();
  const labels = [];
  let slug = "";

  for (const line of md.split("\n")) {
    const h = line.match(/^#{2,3}\s+(.*)$/);
    if (h) { slug = slugify(stripMd(h[1])); sections.set(slug, new Map()); continue; }
    if (!line.startsWith("|")) continue;
    const cells = line.split("|").slice(1, -1).map(c => c.trim());
    if (cells.length !== 3) continue;
    const name = stripMd(cells[0]);
    const url = (cells[2].match(/\((https?:\/\/[^)]+)\)/) || [])[1];
    if (!name || !url || /^(Control|Page \/ field|Indication|Panel)$/.test(name)) continue;
    labels.push(name);
    sections.get(slug)?.set(name.toUpperCase(), url);
    if (!global.has(name.toUpperCase())) global.set(name.toUpperCase(), url);
  }

  const norm = s => s.toUpperCase().replace(/\s+/g, " ").trim();

  function within(map, q) {
    if (map.has(q)) return map.get(q);
    const keys = [...map.keys()];
    // "ENG MASTER 1" -> "ENG MASTER 1 & 2"
    const pre = keys.filter(k => k.startsWith(q)).sort((a, b) => a.length - b.length)[0];
    if (pre) return map.get(pre);
    // "ECAM UPPER" -> "ECAM UPPER / LOWER BRIGHTNESS"
    const sub = keys.filter(k => q.startsWith(k)).sort((a, b) => b.length - a.length)[0];
    if (sub) return map.get(sub);
    // "V1" -> "TAKEOFF (FLAPS, FLEX TO TEMP, V1, VR, V2)"
    const inList = keys.find(k => {
      const inner = (k.match(/\(([^)]*)\)/) || [])[1];
      return inner && inner.split(",").map(norm).includes(q);
    });
    if (inList) return map.get(inList);
    // alternations: "ECAM LOWER" -> "ECAM UPPER / LOWER BRIGHTNESS",
    //               "ENG MASTER 2" -> "ENG MASTER 1 & 2"
    const qt = q.split(" ");
    const subseq = keys
      .filter(k => {
        const kt = k.split(" ").filter(t => t !== "/" && t !== "&");
        let j = 0;
        for (const t of kt) if (t === qt[j]) j++;
        return j === qt.length;
      })
      .sort((a, b) => a.length - b.length)[0];
    return subseq ? map.get(subseq) : null;
  }

  const lookup = (label, anchor) => {
    const map = (anchor && sections.get(anchor)) || global;
    const tries = [];
    const q = norm(label);
    tries.push(q);
    if (CONFIG.aliases[q]) tries.push(norm(CONFIG.aliases[q]));
    // "MCDU MENU / ATSU / AOC MENU" -> "AOC MENU"
    if (q.includes(" / ")) {
      const last = norm(q.split(" / ").pop());
      tries.push(last);
      if (CONFIG.aliases[last]) tries.push(norm(CONFIG.aliases[last]));
    }
    for (const t of tries) {
      const hit = within(map, t) ?? (map !== global ? within(global, t) : null);
      if (hit) return hit;
    }
    return null;
  };

  return { labels, lookup };
}

function controlHref(text, target) {
  if (/^https?:/.test(target)) return target;
  // cross-page navigation inside the notes has no docs equivalent — render as text
  if (!/^controls\.md/.test(target)) return null;
  const anchor = (target.split("#")[1] || "").trim();
  if (!anchor) return null; // prose link to the reference page as a whole
  const url = lookupControl(text, anchor);
  if (!url) unresolved.add(`${text} (#${anchor})`);
  return url;
}

/* ------------------------------------------------------------------ *
 * full name for a control cell
 *
 * "[EXT PWR](controls.md#electrical) pushbutton" -> "EXTernal PoWeR".
 * names.md is the only source: no derivation, no fuzzy fallback. A label the
 * map does not carry has no name, and the run prints it.
 * ------------------------------------------------------------------ */

function controlFull(cell) {
  const m = String(cell).match(/\[([^\]]+)\]\(controls\.md#[^)]+\)/);
  const label = m ? m[1] : stripMd(cell);
  if (!(nameKey(label) in NAMES)) nameless.add(label);
  return nameOf(label);
}

/* ------------------------------------------------------------------ *
 * generic block parser: headings, tables, ordered lists, notes, paras
 * ------------------------------------------------------------------ */

function tableRows(lines) {
  const rows = lines.map(l => l.split("|").slice(1, -1).map(c => c.trim()));
  const head = rows[0];
  const body = rows.slice(2); // skip separator
  return { head, body };
}

function parseSections(md) {
  const lines = md.split("\n");
  const groups = [];
  let g = null;
  let i = 0;

  const ensure = () => {
    if (!g) { g = { title: "", blocks: [] }; groups.push(g); }
    return g;
  };

  while (i < lines.length) {
    const line = lines[i];

    const h = line.match(/^#{2,3}\s+(.*)$/);
    if (h) {
      g = { title: stripMd(h[1]), blocks: [] };
      groups.push(g);
      i++;
      continue;
    }
    if (/^#\s/.test(line)) { i++; continue; }
    if (/^---\s*$/.test(line)) break; // nav footer

    if (line.startsWith("|")) {
      const buf = [];
      while (i < lines.length && lines[i].startsWith("|")) buf.push(lines[i++]);
      ensure().blocks.push({ kind: "table", ...tableRows(buf) });
      continue;
    }

    if (/^>\s*\[!NOTE\]/.test(line)) {
      i++;
      const buf = [];
      while (i < lines.length && lines[i].startsWith(">")) buf.push(lines[i++].replace(/^>\s?/, ""));
      ensure().blocks.push({ type: "note", frag: parseInline(buf.join(" ").trim(), controlHref) });
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length) {
        const m = lines[i].match(/^\d+\.\s+(.*)$/);
        if (m) { items.push(m[1]); i++; }
        else if (/^\s{2,}\S/.test(lines[i]) && items.length) { items[items.length - 1] += " " + lines[i].trim(); i++; }
        else break;
      }
      ensure().blocks.push({ type: "steps", items: items.map(t => parseInline(t, controlHref)) });
      continue;
    }

    // Bullets are a list of separate remarks, not a sequence, so they stay
    // unordered. Without this they fall through to the paragraph collector
    // below and arrive as one run-on block with literal "-" markers in it.
    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length) {
        const m = lines[i].match(/^[-*]\s+(.*)$/);
        if (m) { items.push(m[1]); i++; }
        else if (/^\s{2,}\S/.test(lines[i]) && items.length) { items[items.length - 1] += " " + lines[i].trim(); i++; }
        else break;
      }
      ensure().blocks.push({ type: "bullets", items: items.map(t => parseInline(t, controlHref)) });
      continue;
    }

    if (/^\[\^/.test(line)) { // footnote definition — fold into a note
      const buf = [line.replace(/^\[\^[^\]]+\]:\s*/, "")];
      i++;
      while (i < lines.length && lines[i].trim() && !/^(#|\||>|\d+\.|\[\^)/.test(lines[i])) buf.push(lines[i++].trim());
      ensure().blocks.push({ type: "note", frag: parseInline(buf.join(" ").trim(), controlHref) });
      continue;
    }

    if (line.trim()) {
      const buf = [line];
      i++;
      while (i < lines.length && lines[i].trim() && !/^(#|\||>|\d+\.|\[\^|---|[-*]\s)/.test(lines[i])) buf.push(lines[i++]);
      const text = buf.join(" ").replace(/\[\^[^\]]+\]/g, "").trim();
      if (text) ensure().blocks.push({ type: "para", frag: parseInline(text, controlHref) });
      continue;
    }
    i++;
  }
  return groups;
}

/* ------------------------------------------------------------------ *
 * procedures
 * ------------------------------------------------------------------ */

// Ticks live in localStorage keyed by item id, so ids are derived from the row
// itself rather than a running counter: inserting a row would otherwise renumber
// every id below it and wipe a saved flight. The group title is deliberately not
// part of the id — renaming a heading should not untick everything under it.
const idPart = (s, max) => stripMd(s).slice(0, max).replace(/\s+/g, "_");

function itemId(phase, control, action) {
  const base = `${phase}:${idPart(control, 24)}:${idPart(action, 16)}`;
  const n = (idSeen.get(base) ?? 0) + 1;
  idSeen.set(base, n);
  return n === 1 ? base : `${base}#${n}`;
}

function itemKind(action) {
  const verb = (stripMd(action).split(" ")[0] || "").toLowerCase().replace(/[.,;:!?]+$/, "");
  if (VERIFY_VERBS.has(verb)) return "verify";
  if (!ACT_VERBS.has(verb)) unknownVerbs.add(verb || "(empty)");
  return "act";
}

function buildProcedure(slug, num) {
  const md = read(`${slug}.md`);
  const title = stripMd((md.match(/^#\s+(.*)$/m) || [])[1] || slug);
  const groups = parseSections(md).map(g => ({
    title: g.title,
    blocks: g.blocks.map(b => {
      if (b.kind !== "table") return b;
      const head = b.head.map(h => h.toLowerCase());
      const isChecklist = /control|page \/ field|field|page|step|indication/.test(head[0]);
      if (!isChecklist) return { type: "para", frag: parseInline(b.head.join(" · "), controlHref) };
      return {
        type: "items",
        conditionLabel: b.head[2] || null,
        items: b.body.map(r => ({
          id: itemId(slug, r[0], r[1] || ""),
          kind: itemKind(r[1] || ""),
          control: parseInline(r[0], controlHref),
          full: controlFull(r[0]),
          action: parseInline(r[1] || "", controlHref),
          condition: r[2] && r[2] !== "–" && r[2] !== "-" ? parseInline(r[2], controlHref) : null,
        })),
      };
    }),
  }));

  // drop the "lede" paragraph out of the first group into the page header
  let lede = null;
  const first = groups[0];
  if (first && !first.title && first.blocks[0]?.type === "para") {
    lede = first.blocks.shift().frag.map(n => n.v).join("");
    if (!first.blocks.length) groups.shift();
  }

  return {
    id: slug,
    num: String(num),
    title: title.replace(/^\d+\s+·\s+/, num + " · "),
    short: CONFIG.railTitles[slug] ?? title.replace(/^\d+\s+·\s+/, ""),
    lede,
    groups,
  };
}

/* ------------------------------------------------------------------ *
 * lights matrix
 * ------------------------------------------------------------------ */

function matrixGroups(md, withFulls = true) {
  return parseSections(md).map(g => ({
    title: g.title,
    blocks: g.blocks.map(b => {
      if (b.kind !== "table") return b;
      return {
        type: "matrix",
        head: b.head.map(stripMd),
        rows: b.body.map(r => r.map(stripMd)),
        // plain-English name for each row label, shown under it
        fulls: withFulls ? b.body.map(r => controlFull(r[0])) : null,
      };
    }),
  }));
}

function buildLights() {
  return {
    title: "Lights by Phase", short: "Lights",
    groups: matrixGroups(read("lights.md")),
  };
}

function phaseLights(slug, sheet) {
  const matrices = sheet.groups.flatMap(g => g.blocks.filter(b => b.type === "matrix"));
  return (CONFIG.phaseLightColumns[slug] ?? []).map(when => {
    const columns = matrices.map(m => ({ m, col: m.head.indexOf(when) })).filter(c => c.col > 0);
    if (!columns.length) throw new Error(`lights.md has no "${when}" column, which phaseLightColumns maps to ${slug}`);
    const set = columns.flatMap(({ m, col }) => m.rows.flatMap((r, ri) =>
      /^[-–]?$/.test(r[col]) ? [] : [{ light: r[0], state: r[col], full: m.fulls?.[ri] ?? null }]));
    return { when, set };
  }).filter(entry => entry.set.length);
}

/* ------------------------------------------------------------------ *
 * abbreviations — FlyByWire's Airbus Terms and Abbreviations page,
 * vendored verbatim and rendered as a lookup sheet only
 * ------------------------------------------------------------------ */

function buildAbbreviations() {
  return {
    title: "Airbus Terms and Abbreviations", short: "Abbreviations",
    groups: matrixGroups(read("abbreviations.md"), false),
  };
}

/* ------------------------------------------------------------------ *
 * ATC call-and-response
 * ------------------------------------------------------------------ */

function buildATC() {
  const md = read("atc-communications.md");
  const lines = md.split("\n");

  // worksheet tokens and their friendly labels
  const tokens = [];
  const seen = new Set();
  for (const line of lines) {
    const m = line.match(/^\|\s*`\{([A-Z0-9 _+]+)\}`\s*\|\s*([^|]+)\|/);
    if (m && !seen.has(m[1])) { seen.add(m[1]); tokens.push({ key: m[1], label: m[2].trim() }); }
  }

  const groups = [];
  let g = null, ex = null;
  let chain = null;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    const h2 = line.match(/^##\s+(.*)$/);
    if (h2) {
      const title = stripMd(h2[1]);
      // skip the reference material that the app renders differently
      if (/handoff chain/i.test(title)) {
        // collect the chain from the mermaid block
        const buf = [];
        i++;
        while (i < lines.length && !/^##\s/.test(lines[i])) buf.push(lines[i++]);
        const fence = (buf.join("\n").match(/```mermaid\n([\s\S]*?)```/) || [])[1] || "";
        const names = [...fence.matchAll(/\[([A-Za-z ]+)\]/g)].map(m => m[1]);
        chain = [...new Set(names)];
        continue;
      }
      if (/^(flight worksheet|phonetic alphabet|numbers)$/i.test(title)) {
        i++;
        while (i < lines.length && !/^##\s/.test(lines[i])) i++;
        continue;
      }
      g = { title: title.replace(/^\d+\s+·\s+/, ""), blocks: [] };
      groups.push(g); ex = null; i++;
      continue;
    }

    const h3 = line.match(/^###\s+(.*)$/);
    if (h3 && g) { ex = { type: "exchange", title: stripMd(h3[1]), turns: [] }; g.blocks.push(ex); i++; continue; }

    // speaker line: **You** / **ATC** / **You** — readback
    const sp = line.match(/^\*\*(You|ATC)\*\*(?:\s*—\s*(.*))?$/);
    if (sp && g) {
      if (!ex) { ex = { type: "exchange", title: "", turns: [] }; g.blocks.push(ex); }
      i++;
      const buf = [];
      while (i < lines.length && /^>/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ""));
      ex.turns.push({ who: sp[1], tag: sp[2] ? sp[2].trim() : null, text: buf.join(" ").replace(/\s+/g, " ").trim() });
      continue;
    }

    if (/^>\s*\[!NOTE\]/.test(line) && g) {
      i++;
      const buf = [];
      while (i < lines.length && lines[i].startsWith(">")) buf.push(lines[i++].replace(/^>\s?/, ""));
      g.blocks.push({ type: "note", frag: parseInline(buf.join(" ").trim()) });
      continue;
    }

    if (line.trim() && !line.startsWith("#") && !line.startsWith("|") && !/^---/.test(line) && g) {
      const buf = [line]; i++;
      while (i < lines.length && lines[i].trim() && !/^(#|\||>|\*\*(You|ATC)\*\*|---)/.test(lines[i])) buf.push(lines[i++]);
      g.blocks.push({ type: "para", frag: parseInline(buf.join(" ").trim()) });
      continue;
    }
    i++;
  }

  // any token used in dialogue but absent from the worksheet table
  const used = new Set();
  groups.forEach(gr => gr.blocks.forEach(b =>
    (b.turns || []).forEach(t => [...t.text.matchAll(/\{([A-Z0-9 _+]+)\}/g)].forEach(m => used.add(m[1])))));
  for (const k of used) if (!seen.has(k)) tokens.push({ key: k, label: k.toLowerCase() });

  return {
    sheet: { title: "ATC Communications", short: "Radio", chain, groups },
    tokens,
  };
}

/* ------------------------------------------------------------------ *
 * emit
 * ------------------------------------------------------------------ */

function buildAircraft(slug) {
  CONFIG = AIRCRAFT[slug];
  if (!CONFIG) throw new Error(`${slug} is registered in src/params/aircraft.ts but has no AIRCRAFT entry`);
  NOTES = resolve(FLY, slug);
  duplicateNames = [];
  unresolved = new Set();
  nameless = new Set();
  idSeen = new Map();
  unknownVerbs = new Set();
  NAMES = buildNames();
  ({ labels: CONTROL_LABELS, lookup: lookupControl } = buildControlIndex());

  // The numeric filename prefix orders the procedures and picks the digit that
  // opens each one.
  const procedures = readdirSync(NOTES)
    .map(file => file.match(/^(\d+)-.+\.md$/))
    .filter(Boolean)
    .map(m => ({ file: m[0], slug: m[0].slice(0, -3), num: Number(m[1]) }))
    .sort((a, b) => a.num - b.num);

  if (procedures.some((p, i) => p.num !== i + 1)) {
    const files = procedures.map(p => p.file).join(", ");
    throw new Error(`procedure notes must be numbered 1-${procedures.length} with no gaps or repeats: ${files}`);
  }
  // The companion binds the digits 1-9 to phases, so a tenth would be unreachable.
  if (procedures.length > 9) {
    throw new Error(`${procedures.length} procedures: the companion only binds digits 1-9 to phases`);
  }
  const strayLights = Object.keys(CONFIG.phaseLightColumns).filter(note => !procedures.some(p => p.slug === note));
  if (strayLights.length) throw new Error(`${slug} phaseLightColumns names notes that do not exist: ${strayLights.join(", ")}`);

  const abbreviations = buildAbbreviations();
  const atc = buildATC();
  const phases = procedures.map(p => buildProcedure(p.slug, p.num));
  const lights = buildLights();
  const data = {
    phases: phases.map(p => ({ ...p, lights: phaseLights(p.id, lights) })),
    refs: { lights, abbreviations, atc: atc.sheet },
    tokens: atc.tokens,
  };

  const items = data.phases.flatMap(p => (p.groups || []).flatMap(g => (g.blocks || []).filter(b => b.type === "items").flatMap(b => b.items)));
  const ids = items.map(i => i.id);
  if (new Set(ids).size !== ids.length) {
    const dupes = ids.filter((id, n) => ids.indexOf(id) !== n);
    throw new Error(`duplicate item ids: ${[...new Set(dupes)].join(", ")}`);
  }

  const outPath = resolve(FLY, `${slug}.json`);

  // The endpoint escapes "</" when it inlines this into a <script> block; escaping
  // it here too would double up and render a literal backslash on the page.
  const json = JSON.stringify(data);
  writeFileSync(outPath, json + "\n");

  const turns = atc.sheet.groups.flatMap(g => g.blocks.filter(b => b.type === "exchange").flatMap(b => b.turns));
  const absRows = abbreviations.groups.flatMap(g => g.blocks.filter(b => b.type === "matrix").flatMap(b => b.rows)).length;

  console.log(`wrote ${outPath.replace(ROOT + "/", "")}`);
  console.log(`  ${data.phases.length} phases · ${Object.keys(data.refs).length} reference sheets · ${items.length} checklist items · ${turns.length} radio calls · ${data.tokens.length} worksheet fields`);
  const linked = items.filter(i => i.control.some(n => n.t === "link")).length;
  console.log(`  ${linked}/${items.length} items linked to FlyByWire docs`);
  const named = items.filter(i => i.full).length;
  console.log(`  ${named}/${items.length} items carry a full control name`);
  console.log(`  ${(json.length / 1024).toFixed(1)} kB payload · ${Object.values(NAMES).filter(Boolean).length} names · ${absRows} abbreviation rows`);
  if (nameless.size) console.log(`  no full name: ${[...nameless].join(", ")}`);
  if (unresolved.size) console.log(`  unresolved control links: ${[...unresolved].join(", ")}`);
  if (unknownVerbs.size) console.log(`  action verbs in neither VERIFY_VERBS nor ACT_VERBS: ${[...unknownVerbs].join(", ")}`);
  if (duplicateNames.length) console.log(`  conflicting names.md keys: ${[...new Set(duplicateNames)].join(", ")}`);
  // names.md is meant to cover the whole control inventory, not just what the
  // procedures happen to link today
  const uncovered = [...new Set(CONTROL_LABELS)].filter(l => !(nameKey(l) in NAMES));
  if (uncovered.length) console.log(`  controls.md labels missing from names.md: ${uncovered.join(", ")}`);
}

for (const slug of SLUGS) buildAircraft(slug);
