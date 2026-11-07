import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Promo } from "@/data/promos";

export function PromoSlide({
  promo,
  priority,
}: {
  promo: Promo;
  priority?: boolean;
}) {
  return (
    <Link
      href={promo.href}
      className="group relative block h-[260px] w-full overflow-hidden bg-surface sm:h-[320px] lg:h-[380px]"
    >
      <Image
        src={promo.image}
        alt={promo.title}
        fill
        preload={priority}
        // остальные слайды за краем карусели — lazy грузил бы их только при свайпе
        loading={priority ? undefined : "eager"}
        sizes="(max-width: 1320px) 100vw, 1320px"
        className="object-cover object-right transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />

      {/* Подложка под текст: снизу на мобилке, слева на десктопе */}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent md:bg-linear-to-r md:from-black/95 md:via-black/55 md:to-transparent" />

      <div className="relative z-10 flex h-full max-w-full flex-col justify-end gap-2 p-5 sm:p-8 md:max-w-[56%] md:justify-center md:gap-3 lg:p-12">
        <span className="w-fit rounded-md bg-accent px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-fg">
          {promo.badge}
        </span>
        <h3 className="font-display text-2xl font-semibold leading-[1.1] text-white sm:text-3xl lg:text-[40px]">
          {promo.title}
        </h3>
        <p className="line-clamp-2 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">
          {promo.description}
        </p>
        <span className="mt-2 hidden h-11 w-fit items-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-black transition-colors group-hover:bg-white/85 sm:inline-flex">
          {promo.cta}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
