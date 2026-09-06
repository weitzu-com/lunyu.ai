#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { geographyPlaces } from "../src/data/geography.ts";
const baseMap = JSON.parse(fs.readFileSync("src/data/geography-base-map.json", "utf8"));

// Original vector diagrams drawn from the reviewed place data. They do not
// copy a basemap, infer historical borders, or connect uncertain itineraries.
const directory = "public/geography/maps";
fs.mkdirSync(directory, { recursive: true });
const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[char]));
const text = (x, y, value, size = 20, color = "#6b6660", anchor = "start") => `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" text-anchor="${anchor}">${escape(value)}</text>`;
const lines = (value, max = 37) => [...value].reduce((result, char, index) => {
  if (index % max === 0) result.push("");
  result[result.length - 1] += char;
  return result;
}, []);
const kinds = { state: "邦国", settlement: "城邑", landscape: "山川", region: "区域", site: "场所" };

for (const place of geographyPlaces) {
  let body = "";
  if (place.coordinates) {
    const longitude = place.coordinates.longitude;
    const latitude = place.coordinates.latitude;
    const left = Math.min(109, Math.floor(longitude) - 1);
    const right = Math.max(122, Math.ceil(longitude) + 1);
    const bottom = Math.min(29, Math.floor(latitude) - 1);
    const top = Math.max(39, Math.ceil(latitude) + 1);
    const x = (lon) => 95 + (lon - left) / (right - left) * 775;
    const y = (lat) => 490 - (lat - bottom) / (top - bottom) * 335;
    for (let lon = Math.ceil(left / 2) * 2; lon <= right; lon += 2) {
      body += `<path d="M${x(lon)} 143V495" stroke="#e5e0d8"/>${text(x(lon), 524, `${lon}°E`, 17, undefined, "middle")}`;
    }
    for (let lat = Math.ceil(bottom / 2) * 2; lat <= top; lat += 2) {
      body += `<path d="M90 ${y(lat)}H882" stroke="#e5e0d8"/>${text(78, y(lat) + 6, `${lat}°N`, 17, undefined, "end")}`;
    }
    for (const river of baseMap.rivers) {
      let drawing = false;
      const riverPath = river.coordinates.map(([lon, lat]) => {
        if (lon < left || lon > right || lat < bottom || lat > top) { drawing = false; return ""; }
        const command = drawing ? "L" : "M";
        drawing = true;
        return `${command}${x(lon).toFixed(1)},${y(lat).toFixed(1)}`;
      }).join(" ");
      body += `<path d="${riverPath}" fill="none" stroke="#6b6660" stroke-width="2" opacity=".35"/>`;
    }
    const sx = x(longitude);
    const sy = y(latitude);
    const occupied = [{ x: sx, y: sy - 23 }];
    for (const neighbor of geographyPlaces.filter((item) => item.kind === "state" && item.coordinates && item.slug !== place.slug)) {
      const nx = x(neighbor.coordinates.longitude);
      const ny = y(neighbor.coordinates.latitude);
      if (Math.hypot(nx - sx, ny - sy) < 60 || nx < 95 || nx > 870 || ny < 150 || ny > 490) continue;
      const labelY = ny - 13;
      if (occupied.some((mark) => Math.abs(mark.x - nx) < 65 && Math.abs(mark.y - labelY) < 35)) continue;
      occupied.push({ x: nx, y: labelY });
      body += `<circle cx="${nx}" cy="${ny}" r="4" fill="#6b6660"/>${text(nx, labelY, neighbor.name, 21, undefined, "middle")}`;
    }
    body += `<circle cx="${sx}" cy="${sy}" r="22" fill="#b44b3c" fill-opacity=".1"/><circle cx="${sx}" cy="${sy}" r="7" fill="#b44b3c"/><text x="${sx}" y="${sy - 23}" text-anchor="middle" font-size="27" fill="#9e4133" stroke="#faf8f3" stroke-width="7" paint-order="stroke">${escape(place.name)}</text>`;
    body += `<path d="M915 180V128L908 138M915 128L922 138" fill="none" stroke="#6b6660" stroke-width="2"/>${text(915, 116, "北", 18, undefined, "middle")}`;
    body += text(50, 562, "现代地望参照 · 点位不表示春秋疆界或精确遗址", 20);
    body += text(50, 593, "水系据 Natural Earth（公版）· 现代河道，非春秋复原", 17);
  } else {
    const parents = place.parentSlugs.map((slug) => geographyPlaces.find((item) => item.slug === slug)).filter(Boolean);
    body += `<rect x="265" y="175" width="430" height="100" rx="3" fill="#f1ece3" stroke="#e5e0d8"/>${text(480, 235, place.name, 34, "#1c1a17", "middle")}`;
    if (parents.length) {
      body += `<path d="M480 275V322" stroke="#b44b3c" stroke-width="2" stroke-dasharray="5 7"/>${text(480, 352, "所属或相关地理范围", 20, undefined, "middle")}`;
      const names = parents.map((item) => item.name).join(" · ");
      body += text(480, 397, names, 29, "#1c1a17", "middle");
    } else {
      body += text(480, 345, kinds[place.kind], 28, "#1c1a17", "middle");
      body += text(480, 397, "具体地望与范围，详见文献说明", 24, undefined, "middle");
    }
    body += text(50, 525, "地理关系示意 · 不作精确定位", 21);
    lines(place.modernLocation, 38).slice(0, 2).forEach((line, index) => { body += text(50, 567 + index * 29, line, 21); });
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="640" viewBox="0 0 960 640" role="img" aria-labelledby="title description"><title id="title">${escape(place.name)}${place.coordinates ? "地望参照图" : "地理关系图"}</title><desc id="description">${escape(place.modernLocation)}。${escape(place.locationNote)}</desc><rect width="960" height="640" fill="#faf8f3"/><g font-family="'Songti SC','Noto Serif SC',serif">${text(50, 63, place.name, 38, "#1c1a17")}${text(50, 102, `${kinds[place.kind]} · 孔门人物地理图志`, 21)}${body}${text(910, 621, "lunyu.ai · 据所列文献整理", 15, undefined, "end")}</g></svg>\n`;
  fs.writeFileSync(path.join(directory, `${place.slug}.svg`), svg);
}
console.log(`[geography] Generated ${geographyPlaces.length} original location/relationship diagrams.`);
