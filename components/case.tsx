import Image from "next/image";
import { Gift } from "lucide-react";
import { Card } from "@/components/ui";

type Props = {
  title: string;
  imageUrl: string;
};

/** Карточка выигранного товара на странице заказа */
export default function Case({ title, imageUrl }: Props) {
  return (
    <Card className="relative flex items-center gap-4 overflow-hidden p-5 sm:p-6">
      <div className="pointer-events-none absolute -right-8 -bottom-8 z-0 h-44 w-44 opacity-15 blur-2xl">
        <Image src={imageUrl} alt="" fill sizes="176px" />
      </div>
      <div className="relative z-1 h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-accent-soft ring-2 ring-accent">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="80px"
          className="object-contain p-2"
        />
      </div>
      <div className="relative z-1 min-w-0">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent-text">
          <Gift className="h-3.5 w-3.5" />
          Кейс открыт
        </p>
        <h2 className="text-lg font-extrabold text-foreground">
          Вы выиграли {title}!
        </h2>
        <p className="text-sm text-muted">
          Товар будет зачислен на указанный аккаунт
        </p>
      </div>
    </Card>
  );
}
