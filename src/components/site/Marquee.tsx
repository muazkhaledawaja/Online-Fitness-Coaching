import type { MarqueeItem } from "@/types";

interface MarqueeProps {
  items: MarqueeItem[];
}

export function Marquee({ items }: MarqueeProps) {
  if (items.length === 0) return null;

  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden py-4 border-y border-accent/[0.06] bg-surface">
      <div className="flex gap-12 animate-marquee w-max">
        {doubled.map((item, i) => (
          <span key={`${item.id}-${i}`} className="contents">
            <span className="font-display text-[1.2rem] tracking-[8px] whitespace-nowrap text-muted/25">
              {item.text}
            </span>
            <span className="text-accent/60 text-[0.8rem]">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
