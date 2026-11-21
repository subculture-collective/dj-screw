import { useEffect, useRef } from "react";
import { roomPosters } from "./brand";

// The wood room behind every page: paneling, posters, a gold record, the wall
// lamp and the air conditioner. It is decoration only, hidden from assistive
// technology, and never takes pointer events. The page content scrolls at full
// speed over it; the room moves at a fraction of that speed (parallax) unless
// the reader asks for reduced motion.
const parallaxRate = 0.35;

export function Room() {
  const room = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = room.current;
    if (!element || typeof window.matchMedia !== "function") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const paint = () => {
      frame = 0;
      const offset = reduced.matches ? 0 : -window.scrollY * parallaxRate;
      element.style.setProperty("--room-shift", `${offset.toFixed(1)}px`);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    reduced.addEventListener("change", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      reduced.removeEventListener("change", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <div className="room" aria-hidden="true" ref={room}>
      <div className="room-wall" />
      <div className="room-props">
        <img className="room-ac" src="/brand/woodroom/room/grate.webp" alt="" decoding="async" draggable={false} />
        <img className="room-lamp" src="/brand/woodroom/room/lamp.webp" alt="" decoding="async" draggable={false} />
        {roomPosters.map((poster) => (
          <img
            key={poster.src}
            className={`room-poster slot-${poster.slot}${"shape" in poster ? ` ${poster.shape}` : ""}`}
            src={`/brand/woodroom/posters/${poster.src}.webp`}
            alt=""
            // The top band is in view on load; the lower wall can wait.
            loading={"lower" in poster ? "lazy" : undefined}
            decoding="async"
            draggable={false}
          />
        ))}
        <img className="room-plaque" src="/brand/woodroom/room/gold.webp" alt="" decoding="async" draggable={false} />
        <div className="room-vinyl" />
      </div>
      {/* Outside the moving props layer so its light blends with the paneling,
          and after it so it also falls on the frames near the lamp. */}
      <div className="room-light" />
    </div>
  );
}
