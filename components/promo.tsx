"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { promos } from "@/data/promos";
import { PromoSlide } from "./promo-slide";
import { cn } from "./ui";

const AUTOPLAY_DELAY = 5000;

export default function PromoSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: AUTOPLAY_DELAY, stopOnInteraction: false })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        {/* Вьюпорт */}
        <div
          className="overflow-hidden rounded-2xl border border-card-border"
          ref={emblaRef}
        >
          <div className="flex">
            {promos.map((promo, i) => (
              <div key={promo.id} className="min-w-0 flex-[0_0_100%]">
                <PromoSlide promo={promo} priority={i === 0} />
              </div>
            ))}
          </div>
        </div>

        {/* Стрелки — только десктоп, на тач-устройствах свайп */}
        <div className="absolute bottom-5 right-5 z-20 hidden gap-2 md:flex">
          <button
            onClick={scrollPrev}
            aria-label="Предыдущая акция"
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-lg border border-white/15 bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Следующая акция"
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-lg border border-white/15 bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Вкладки акций с прогрессом автопрокрутки */}
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${promos.length}, minmax(0, 1fr))` }}
      >
        {promos.map((promo, i) => {
          const active = i === selectedIndex;
          return (
            <button
              key={promo.id}
              onClick={() => scrollTo(i)}
              aria-label={`Акция: ${promo.title}`}
              aria-current={active}
              className="group flex cursor-pointer flex-col gap-2 py-1 text-left md:py-0"
            >
              <span className="relative h-[3px] w-full overflow-hidden rounded-full bg-surface-3">
                {active && (
                  <span
                    key={selectedIndex}
                    className="absolute inset-0 origin-left bg-accent"
                    style={{
                      animation: `progress ${AUTOPLAY_DELAY}ms linear forwards`,
                    }}
                  />
                )}
              </span>
              <span className="hidden min-w-0 md:block">
                <span className="block truncate text-[11px] font-semibold uppercase tracking-wider text-subtle">
                  {promo.badge}
                </span>
                <span
                  className={cn(
                    "block truncate text-sm font-semibold transition-colors",
                    active
                      ? "text-foreground"
                      : "text-muted group-hover:text-foreground"
                  )}
                >
                  {promo.title}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
