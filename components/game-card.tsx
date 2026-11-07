import Image from "next/image";
import Link from "next/link";
import { Game } from "@/app/generated/prisma/client";
import { Card } from "./ui";

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function GameCard({ game }: { game: Game }) {
  return (
    <Link href={`/game/${game.slug}`} className="block group">
      <Card className="relative h-[200px] w-full overflow-hidden rounded-2xl shadow-lg shadow-black/40">
        <Image
          src={game.bannerUrl}
          alt={game.title}
          fill
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          className="object-cover scale-105 contrast-110 saturate-125 brightness-95 transition-transform duration-500 group-hover:scale-110"
        />

        {/* шум — прячет артефакты сжатия */}
        <div
          className="absolute inset-0 z-[1] opacity-[0.15] mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: NOISE }}
        />

        {/* затемнение снизу под текст */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        {/* бейджи */}
        <div className="absolute left-3 top-3 z-10 flex gap-2">
          {game.isNew && (
            <span className="rounded-md bg-emerald-500/90 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white backdrop-blur">
              New
            </span>
          )}
          {game.isPopular && (
            <span className="rounded-md bg-amber-500/90 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-black backdrop-blur">
              Популярное
            </span>
          )}
        </div>

        {/* контент */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-4">
          <h3 className="text-lg font-bold text-white leading-tight">
            {game.title}
          </h3>
          <p className="mt-1 line-clamp-1 text-sm text-white/70">
            {game.description}
          </p>
        </div>
      </Card>
    </Link>
  );
}
