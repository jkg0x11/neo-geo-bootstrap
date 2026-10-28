import { Route, Router, Routes } from "lakebed/client";
import { useEffect, useState } from "preact/hooks";
import { createSite } from "./site";
const site = createSite();
function Showcase({ page }: { page: "index.html" | "gallery.html" }) {
  const [html, setHtml] = useState<string>();
  const [error, setError] = useState<string>();
  useEffect(() => {
    let active = true;
    site.then(value => { if (active) setHtml(value.page(page)); })
      .catch(() => { if (active) setError("The showcase could not open. Please reload this page."); });
    return () => { active = false; };
  }, [page]);
  if (error) return <p role="alert">{error}</p>;
  if (!html) return null;
  return <iframe title={page === "index.html" ? "Neo Geo Bootstrap showcase" : "Neo Geo Bootstrap component catalogue"} srcDoc={html} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", border: 0, background: "#000063" }} />;
}
export function App() {
  return <Router><Routes>
    <Route path="/gallery" element={<Showcase page="gallery.html" />} />
    <Route path="/gallery.html" element={<Showcase page="gallery.html" />} />
    <Route path="*" element={<Showcase page="index.html" />} />
  </Routes></Router>;
}
