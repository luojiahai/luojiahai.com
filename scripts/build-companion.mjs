// Regenerates the A32NX flight companion payload in src/lib/fly/ from the
// markdown notes in src/lib/fly/fbw-a32nx/.
// Run with: pnpm fly
//
// The markdown stays the source of truth: edit the procedure notes, re-run the
// script, and the interactive checklist follows. The notes themselves follow
// FlyByWire's A32NX beginner guide.
//
// Usage: node scripts/build-companion.mjs [--out src/lib/fly/fbw-a32nx.json]
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const NOTES = resolve(ROOT, "src/lib/fly/fbw-a32nx");
const read = p => readFileSync(resolve(NOTES, p), "utf8");

const PROCEDURES = [
  "1-preflight",
  "2-starting-the-aircraft",
  "3-preparing-the-mcdu",
  "4-engine-start-and-taxi",
  "5-takeoff-climb-and-cruise",
  "6-descent-planning-and-descent",
  "7-approach-and-ils-landing",
  "8-after-landing-and-taxi-to-gate",
  "9-powering-down",
];

// The rail is 208px wide (--rail); these titles wrap to three lines without help.
const SHORT = {
  "6-descent-planning-and-descent": "Descent",
  "7-approach-and-ils-landing": "Approach and Landing",
};

const REF_IDS = new Set(["lights", "glossary", "atc"]);

/* ------------------------------------------------------------------ *
 * inline markdown -> fragment nodes the template can render safely
 * ------------------------------------------------------------------ */

function parseInline(md, resolveHref = () => null) {
  const out = [];
  let rest = String(md).replace(/\[\^[^\]]+\]/g, ""); // drop footnote markers
  const push = (t, v, href) => { if (v !== "") out.push(href ? { t, v, href } : { t, v }); };

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
 * terms.md -> TERM -> full name
 *
 * This is the tooltip map, deliberately not the abbreviations sheet: the
 * FlyByWire abbreviations page is an airline-wide glossary where RET is
 * "RETurn", which is the wrong reading for a speed brake lever.
 * ------------------------------------------------------------------ */

const duplicateTerms = [];

function buildGlossary() {
  const terms = {};
  for (const line of read("terms.md").split("\n")) {
    if (!line.startsWith("|")) continue;
    const cells = line.split("|").slice(1, -1).map(c => c.trim());
    if (cells.length !== 2) continue;
    const term = stripMd(cells[0]);
    const full = stripMd(cells[1]);
    if (!term || !full || /^-+$/.test(term) || term === "Term") continue;
    const key = term.toUpperCase();
    if (key in terms && terms[key] !== full) duplicateTerms.push(key);
    terms[key] = full;
  }
  return terms;
}

const GLOSSARY = buildGlossary();
const glossOf = s => GLOSSARY[String(s).trim().toUpperCase()] ?? null;

/* ------------------------------------------------------------------ *
 * controls.md -> docs URL and plain-English name, resolved within the
 * linked section
 *
 * Procedure links carry the section as an anchor (controls.md#performance),
 * which disambiguates names that appear on more than one panel — "FLAPS"
 * under #performance is the MCDU field, under #flaps-and-speed-brake it is
 * the pedestal lever.
 * ------------------------------------------------------------------ */

const ALIASES = { PERF: "APPROACH" };

const slugify = s =>
  s.toLowerCase().replace(/[`*_~]/g, "").replace(/[^\w\- ]/g, "").replace(/ /g, "-");

function buildControlIndex() {
  const md = read("controls.md");
  const sections = new Map(); // slug -> Map(NAME -> { url, desc })
  const global = new Map();
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
    const entry = { url, desc: stripMd(cells[1]) };
    sections.get(slug)?.set(name.toUpperCase(), entry);
    if (!global.has(name.toUpperCase())) global.set(name.toUpperCase(), entry);
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

  return (label, anchor) => {
    const map = (anchor && sections.get(anchor)) || global;
    const tries = [];
    const q = norm(label);
    tries.push(q);
    if (ALIASES[q]) tries.push(norm(ALIASES[q]));
    // "MCDU MENU / ATSU / AOC MENU" -> "AOC MENU"
    if (q.includes(" / ")) {
      const last = norm(q.split(" / ").pop());
      tries.push(last);
      if (ALIASES[last]) tries.push(norm(ALIASES[last]));
    }
    for (const t of tries) {
      const hit = within(map, t) ?? (map !== global ? within(global, t) : null);
      if (hit) return hit;
    }
    return null;
  };
}

const lookupControl = buildControlIndex();
const unresolved = new Set();

function controlHref(text, target) {
  if (/^https?:/.test(target)) return target;
  // cross-page navigation inside the notes has no docs equivalent — render as text
  if (!/^controls\.md/.test(target)) return null;
  const anchor = (target.split("#")[1] || "").trim();
  if (!anchor) return null; // prose link to the reference page as a whole
  const entry = lookupControl(text, anchor);
  if (!entry) unresolved.add(`${text} (#${anchor})`);
  return entry?.url ?? null;
}

/* ------------------------------------------------------------------ *
 * plain-English name for a control cell
 *
 * "[EXT PWR](controls.md#electrical) pushbutton" -> "External power".
 * The glossary wins where it has an entry (V1 is "decision speed", not
 * "takeoff performance entries"), otherwise controls.md supplies the name,
 * trimmed of the parts the checklist row already says.
 * ------------------------------------------------------------------ */

const DEVICE = /\s+(pushbuttons?|switch(es)?|selectors?|knobs?|levers?|handles?|handwheels?|signs?|indications?|windows?)$/i;
const same = (a, b) => String(a).toUpperCase().replace(/\s+/g, " ").trim() ===
                       String(b).toUpperCase().replace(/\s+/g, " ").trim();

// "navaid and ILS frequency tuning" -> "navaid and instrument landing system …"
const expandAcronyms = s => s.split(" ").map(w => {
  const bare = w.replace(/[.,;:]+$/, "");
  const full = /^[A-Z0-9/&-]{2,}$/.test(bare) && glossOf(bare);
  return full ? full + w.slice(bare.length) : w;
}).join(" ");

function controlFull(cell) {
  const m = String(cell).match(/\[([^\]]+)\]\(controls\.md#([^)]+)\)/);
  const label = m ? m[1] : stripMd(cell);

  const gloss = glossOf(label);
  if (gloss) return gloss;
  if (!m) return null;

  const entry = lookupControl(label, m[2].trim());
  if (!entry?.desc) return null;

  // "Altitude selector knob — turn to select, …" -> "altitude selector"
  let desc = entry.desc.split(" — ")[0]
    .replace(/\s*\([^)]*\)\s*$/, "")     // trailing list of positions
    .replace(DEVICE, "")                  // the row already names the device
    .trim();
  if (/^[A-Z][a-z]/.test(desc)) desc = desc[0].toLowerCase() + desc.slice(1);
  desc = expandAcronyms(desc);

  // nothing gained if it only echoes the label ("FLAPS lever" -> "flaps")
  return desc && !same(desc, label) ? desc : null;
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
    if (!g) { g = { title: "", level: 2, blocks: [] }; groups.push(g); }
    return g;
  };

  while (i < lines.length) {
    const line = lines[i];

    const h = line.match(/^(#{2,3})\s+(.*)$/);
    if (h) {
      g = { title: stripMd(h[2]), level: h[1].length, blocks: [] };
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
const idSeen = new Map();
const idPart = (s, max) => stripMd(s).slice(0, max).replace(/\s+/g, "_");

function itemId(phase, control, action) {
  const base = `${phase}:${idPart(control, 24)}:${idPart(action, 16)}`;
  const n = (idSeen.get(base) ?? 0) + 1;
  idSeen.set(base, n);
  return n === 1 ? base : `${base}#${n}`;
}

function buildProcedure(slug, num) {
  const md = read(`${slug}.md`);
  const title = stripMd((md.match(/^#\s+(.*)$/m) || [])[1] || slug);
  const groups = parseSections(md).map(g => ({
    title: g.title,
    level: g.level,
    blocks: g.blocks.map(b => {
      if (b.kind !== "table") return b;
      const head = b.head.map(h => h.toLowerCase());
      const isChecklist = /control|page \/ field|field|page|step|indication/.test(head[0]);
      if (!isChecklist) return { type: "para", frag: parseInline(b.head.join(" · "), controlHref) };
      return {
        type: "items",
        items: b.body.map(r => ({
          id: itemId(slug, r[0], r[1] || ""),
          control: parseInline(r[0], controlHref),
          full: controlFull(r[0]),
          action: parseInline(r[1] || "", controlHref),
          condition: r[2] && r[2] !== "–" && r[2] !== "-" ? parseInline(r[2], controlHref) : null,
          conditionLabel: b.head[2] || null,
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
    short: SHORT[slug] ?? title.replace(/^\d+\s+·\s+/, ""),
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
    level: g.level,
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
    id: "lights", num: "L", title: "Lights by Phase", short: "Lights",
    groups: matrixGroups(read("lights.md")),
  };
}

/* ------------------------------------------------------------------ *
 * abbreviations — FlyByWire's Airbus Terms and Abbreviations page,
 * vendored verbatim and rendered as a lookup sheet only
 * ------------------------------------------------------------------ */

function buildAbbreviations() {
  return {
    id: "glossary", num: "G",
    title: "Airbus Terms and Abbreviations", short: "Terms",
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
      g = { title: title.replace(/^\d+\s+·\s+/, ""), level: 2, blocks: [] };
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
    phase: { id: "atc", num: "A", kind: "atc", title: "ATC Communications", short: "ATC", chain, groups },
    tokens,
  };
}

/* ------------------------------------------------------------------ *
 * emit
 * ------------------------------------------------------------------ */

// The companion binds the digits 1-9 to phases, so a tenth would be unreachable.
if (PROCEDURES.length > 9) {
  throw new Error(`${PROCEDURES.length} procedures: the companion only binds digits 1-9 to phases`);
}
const shadowed = PROCEDURES.filter(s => REF_IDS.has(s));
if (shadowed.length) {
  throw new Error(`procedure id shadows a reference sheet: ${shadowed.join(", ")}`);
}

const abbreviations = buildAbbreviations();
const atc = buildATC();
const data = {
  phases: [
    ...PROCEDURES.map((s, n) => buildProcedure(s, n + 1)),
    buildLights(),
    abbreviations,
    atc.phase,
  ],
  tokens: atc.tokens,
  glossary: GLOSSARY,
};

const items = data.phases.flatMap(p => (p.groups || []).flatMap(g => (g.blocks || []).filter(b => b.type === "items").flatMap(b => b.items)));
const ids = items.map(i => i.id);
if (new Set(ids).size !== ids.length) {
  const dupes = ids.filter((id, n) => ids.indexOf(id) !== n);
  throw new Error(`duplicate item ids: ${[...new Set(dupes)].join(", ")}`);
}

const outFlag = process.argv.indexOf("--out");
const outPath = outFlag > -1
  ? resolve(process.cwd(), process.argv[outFlag + 1])
  : resolve(ROOT, "src/lib/fly/fbw-a32nx.json");

// The endpoint escapes "</" when it inlines this into a <script> block; escaping
// it here too would double up and render a literal backslash on the page.
const json = JSON.stringify(data);
writeFileSync(outPath, json + "\n");

const turns = atc.phase.groups.flatMap(g => g.blocks.filter(b => b.type === "exchange").flatMap(b => b.turns));
const absRows = abbreviations.groups.flatMap(g => g.blocks.filter(b => b.type === "matrix").flatMap(b => b.rows)).length;

console.log(`wrote ${outPath.replace(ROOT + "/", "")}`);
console.log(`  ${data.phases.length} phases · ${items.length} checklist items · ${turns.length} radio calls · ${data.tokens.length} worksheet fields`);
const linked = items.filter(i => i.control.some(n => n.t === "link")).length;
console.log(`  ${linked}/${items.length} items linked to FlyByWire docs`);
const named = items.filter(i => i.full).length;
console.log(`  ${named}/${items.length} items carry a plain-English control name`);
console.log(`  ${(json.length / 1024).toFixed(1)} kB payload · ${Object.keys(GLOSSARY).length} tooltip terms · ${absRows} abbreviation rows`);
const unnamed = items.filter(i => !i.full).map(i => stripMd(i.control.map(n => n.v).join("")));
if (unnamed.length) console.log(`  no plain-English name: ${[...new Set(unnamed)].join(", ")}`);
if (unresolved.size) console.log(`  unresolved control links: ${[...unresolved].join(", ")}`);
if (duplicateTerms.length) console.log(`  conflicting terms.md keys: ${[...new Set(duplicateTerms)].join(", ")}`);
