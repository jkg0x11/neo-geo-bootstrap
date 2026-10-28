import { files } from "../shared/site";
type Asset = { path: string; type: string; bytes: Uint8Array; url: string };
const encoder = new TextEncoder();
const decoder = new TextDecoder();
// ZIP's stored method keeps browser downloads dependency-free.
function zip(assets: Asset[]) {
  const chunks: Uint8Array[] = [], central: Uint8Array[] = [];
  let offset = 0, centralSize = 0;
  const table = Array.from({ length: 256 }, (_, index) => {
    let crc = index;
    for (let bit = 0; bit < 8; bit++) crc = (crc & 1) ? (0xedb88320 ^ (crc >>> 1)) : crc >>> 1;
    return crc >>> 0;
  });
  for (const asset of assets) {
    const name = encoder.encode(asset.path);
    let crc = 0xffffffff;
    for (const byte of asset.bytes) crc = table[(crc ^ byte) & 255] ^ (crc >>> 8);
    crc = (crc ^ 0xffffffff) >>> 0;
    const header = new Uint8Array(30 + name.length), view = new DataView(header.buffer);
    view.setUint32(0, 0x04034b50, true); view.setUint16(4, 20, true); view.setUint16(6, 0x800, true);
    view.setUint32(14, crc, true); view.setUint32(18, asset.bytes.length, true); view.setUint32(22, asset.bytes.length, true);
    view.setUint16(26, name.length, true); header.set(name, 30);
    const record = new Uint8Array(46 + name.length), recordView = new DataView(record.buffer);
    recordView.setUint32(0, 0x02014b50, true); recordView.setUint16(4, 20, true); recordView.setUint16(6, 20, true); recordView.setUint16(8, 0x800, true);
    recordView.setUint32(16, crc, true); recordView.setUint32(20, asset.bytes.length, true); recordView.setUint32(24, asset.bytes.length, true);
    recordView.setUint16(28, name.length, true); recordView.setUint32(42, offset, true); record.set(name, 46);
    chunks.push(header, asset.bytes); central.push(record); offset += header.length + asset.bytes.length; centralSize += record.length;
  }
  const end = new Uint8Array(22), endView = new DataView(end.buffer);
  endView.setUint32(0, 0x06054b50, true); endView.setUint16(8, assets.length, true); endView.setUint16(10, assets.length, true);
  endView.setUint32(12, centralSize, true); endView.setUint32(16, offset, true);
  return new Blob([...chunks, ...central, end], { type: "application/zip" });
}
export async function createSite() {
  const assets: Asset[] = await Promise.all(files.map(async file => {
    const compressed = Uint8Array.from(atob(file.gzip), character => character.charCodeAt(0));
    const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream("gzip"));
    const bytes = new Uint8Array(await new Response(stream).arrayBuffer());
    return { path: file.path, type: file.type, bytes, url: URL.createObjectURL(new Blob([bytes], { type: file.type })) };
  }));
  const byPath = new Map(assets.map(asset => [asset.path, asset]));
  const archive = URL.createObjectURL(zip(assets));
  const resolve = (path: string, base = "index.html") => {
    const url = new URL(path, `https://neo-geo.invalid/${base}`);
    return byPath.get(url.pathname.slice(1));
  };
  const content = (path: string) => decoder.decode(byPath.get(path)!.bytes);
  return {
    page(path: "index.html" | "gallery.html") {
      const doc = new DOMParser().parseFromString(content(path), "text/html");
      for (const link of doc.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')) {
        const asset = resolve(link.getAttribute("href")!, path)!;
        const style = doc.createElement("style");
        style.textContent = decoder.decode(asset.bytes).replace(/url\((['"]?)([^)'"\s]+)\1\)/g, (match, quote, value) => {
          if (value.startsWith("data:")) return match;
          const image = resolve(value, asset.path);
          return image ? `url("${image.url}")` : match;
        });
        link.replaceWith(style);
      }
      for (const element of doc.querySelectorAll<HTMLImageElement | HTMLLinkElement>("img[src], link[rel='icon']")) {
        const attribute = element.tagName === "IMG" ? "src" : "href";
        const asset = resolve(element.getAttribute(attribute)!, path);
        if (asset) element.setAttribute(attribute, asset.url);
      }
      for (const script of doc.querySelectorAll<HTMLScriptElement>("script[src]")) {
        const asset = resolve(script.getAttribute("src")!, path)!;
        script.removeAttribute("src"); script.removeAttribute("defer");
        script.textContent = decoder.decode(asset.bytes).replace(/<\/script/gi, "<\\/script");
      }
      for (const link of doc.querySelectorAll<HTMLAnchorElement>("a[href]")) {
        const href = link.getAttribute("href")!;
        if (/^https?:/i.test(href)) { link.target = "_blank"; link.rel = "noopener"; continue; }
        if (href.startsWith("#") || /^[a-z]+:/i.test(href)) continue;
        const target = new URL(href, `https://neo-geo.invalid/${path}`).pathname;
        if (target.endsWith("/gallery.html")) { link.href = "/gallery"; link.target = "_top"; }
        else if (target.endsWith("/index.html")) { link.href = "/"; link.target = "_top"; }
        else if (target.endsWith(".zip")) { link.href = archive; link.download = "neo-geo-bootstrap.zip"; }
        else {
          const asset = resolve(href, path);
          if (asset) {
            link.href = asset.url;
            if (link.hasAttribute("download")) link.download = asset.path.split("/").pop()!;
            else { link.target = "_blank"; link.rel = "noopener"; }
          }
        }
      }
      return "<!doctype html>" + doc.documentElement.outerHTML;
    },
  };
}
