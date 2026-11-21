import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import App from "./App";
import { Room } from "./Room";
import { roomPosters } from "./brand";

describe("wood room", () => {
  it("is decoration hidden from assistive technology", () => {
    const html = renderToString(<Room />);
    expect(html).toMatch(/^<div class="room" aria-hidden="true">/);
    for (const poster of roomPosters) expect(html).toContain(poster.title.replace("'", "&#x27;"));
  });
  it("sits behind every page in the app shell", () => {
    const html = renderToString(<App />);
    expect(html.indexOf('class="room"')).toBeLessThan(html.indexOf("<main"));
  });
});
