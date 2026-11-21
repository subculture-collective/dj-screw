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
        <div className="room-ac">
          <span />
        </div>
        <div className="room-lamp" />
        {roomPosters.map((poster) => (
          <div key={poster.artist} className={`room-poster ${poster.tone}`}>
            <span className="room-poster-top">{poster.kicker}</span>
            <strong>{poster.artist}</strong>
            <em>{poster.title}</em>
            <span className="room-poster-foot">In stores now</span>
          </div>
        ))}
        <div className="room-plaque">
          <span className="room-plaque-disc" />
          <span className="room-plaque-card" />
        </div>
        <div className="room-vinyl" />
      </div>
    </div>
  );
}
