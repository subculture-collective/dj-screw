import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import App from "./App";
import { Room } from "./Room";
import { roomPosters } from "./brand";

describe("wood room", () => {
  it("is decoration hidden from assistive technology", () => {
    const html = renderToString(<Room />);
    expect(html).toContain('<div class="room" aria-hidden="true">');
    for (const poster of roomPosters)
      expect(html).toContain(`/brand/woodroom/posters/${poster.src}.webp`);
  });
  it("does not preload the posters lower on the wall", () => {
    const html = renderToString(<Room />);
    for (const poster of roomPosters) {
      const preload = `rel="preload" as="image" href="/brand/woodroom/posters/${poster.src}.webp"`;
      if ("lower" in poster) expect(html).not.toContain(preload);
      else expect(html).toContain(preload);
    }
  });
  it("sits behind every page in the app shell", () => {
    const html = renderToString(<App />);
    expect(html.indexOf('class="room"')).toBeLessThan(html.indexOf("<main"));
  });
});
