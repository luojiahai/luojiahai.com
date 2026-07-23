// Regenerates the site icons in static/ from assets/icon.svg.
// Run with: pnpm icons
import { Resvg } from "@resvg/resvg-js";
import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const svg = readFileSync(join(root, "assets/icon.svg"), "utf8");

function render(size) {
  return new Resvg(svg, { fitTo: { mode: "width", value: size } }).render();
}

function writePng(size, name) {
  const path = join(root, "static", name);
  writeFileSync(path, render(size).asPng());
  console.log(`wrote static/${name} (${size}x${size})`);
}

// ICO container with 32-bit BMP entries (BGRA + empty AND mask).
function writeIco(sizes, name) {
  const images = sizes.map((size) => {
    const { width: w, height: h, pixels } = render(size);
    const xorStride = w * 4;
    const andStride = Math.ceil(w / 32) * 4;
    const bmp = Buffer.alloc(40 + h * xorStride + h * andStride);
    bmp.writeUInt32LE(40, 0); // BITMAPINFOHEADER size
    bmp.writeInt32LE(w, 4);
    bmp.writeInt32LE(h * 2, 8); // XOR + AND mask height
    bmp.writeUInt16LE(1, 12); // planes
    bmp.writeUInt16LE(32, 14); // bits per pixel
    for (let y = 0; y < h; y++) {
      const row = 40 + (h - 1 - y) * xorStride; // bottom-up
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        bmp[row + x * 4] = pixels[i + 2]; // B
        bmp[row + x * 4 + 1] = pixels[i + 1]; // G
        bmp[row + x * 4 + 2] = pixels[i]; // R
        bmp[row + x * 4 + 3] = pixels[i + 3]; // A
      }
    }
    return { size: w, bmp };
  });

  const header = Buffer.alloc(6 + images.length * 16);
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, bmp }, i) => {
    const entry = 6 + i * 16;
    header[entry] = size === 256 ? 0 : size;
    header[entry + 1] = size === 256 ? 0 : size;
    header.writeUInt16LE(1, entry + 4); // planes
    header.writeUInt16LE(32, entry + 6); // bits per pixel
    header.writeUInt32LE(bmp.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += bmp.length;
  });

  const path = join(root, "static", name);
  writeFileSync(path, Buffer.concat([header, ...images.map((i) => i.bmp)]));
  console.log(`wrote static/${name} (${sizes.join(", ")})`);
}

copyFileSync(join(root, "assets/icon.svg"), join(root, "static/icon.svg"));
console.log("wrote static/icon.svg (copy of assets/icon.svg)");

// Safari's pinned-tab mask icon only reads the silhouette: same glyph and
// padding as icon.svg, but no background box and a single flat color.
const mask = svg
  .replace(/^\s*<rect[^>]*\/>\n/m, "")
  .replace(/stroke='[^']*'|stroke="[^"]*"/, 'stroke="#000"');
if (mask === svg || !mask.includes('stroke="#000"')) {
  throw new Error("mask-icon rewrite failed; check assets/icon.svg markup");
}
writeFileSync(join(root, "static/mask-icon.svg"), mask);
console.log("wrote static/mask-icon.svg");
writePng(512, "icon.png");
writePng(192, "icon-192.png");
writePng(180, "apple-icon.png");
writeIco([48, 32, 16], "favicon.ico");
