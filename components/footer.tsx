import Link from "next/link";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { supportLink } from "@/data/shared";
import Logo from "./logo";

const NAV = [
  { label: "Каталог игр", href: "/#catalog" },
  { label: "Поддержка", href: supportLink, external: true },
];

const LEGAL = [
  { label: "Пользовательское соглашение", href: "/eula" },
  { label: "Правила возврата", href: "/refund" },
  { label: "Политика конфиденциальности", href: "/privacy" },
];

const SOCIAL = [{ label: "Поддержка", href: supportLink, icon: MessageCircle }];

export default function Footer() {
  return (
    <footer className="border-t border-card-border bg-surface/40">
      <div className="mx-auto grid w-full max-w-[1320px] gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        {/* Бренд */}
        <div className="flex max-w-sm flex-col gap-4">
          <Logo />
          <p className="text-sm leading-relaxed text-muted">
            Быстрое и безопасное пополнение игровых валют. Доставка в среднем за
            2 минуты.
          </p>
          <div className="flex gap-2">
            {SOCIAL.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  aria-label={item.label}
                  className="grid h-10 w-10 place-items-center rounded-lg border border-card-border text-muted transition-colors hover:border-card-border-strong hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              );
            })}
          </div>
        </div>

        <FooterColumn title="Навигация" items={NAV} />
        <FooterColumn title="Документы" items={LEGAL} />
      </div>

      <div className="border-t border-card-border">
        <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-6 px-4 py-6 text-xs text-subtle sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div className="flex flex-col gap-1 leading-relaxed">
            <p>Name: OAK PLAZA LTD · Registration No: HE 443487</p>
            <p>Adress: 18A Demokratias, Lakatamia, 2331, Nicosia, Cyprus</p>
            <p className="mt-2">
              © {new Date().getFullYear()} GamerPlaza. Все права защищены. Не
              является официальным сервисом игровых издателей.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 items-center rounded-md border border-card-border bg-surface px-2.5">
              <Image src="/pay/sbp.svg" alt="СБП" width={36} height={18} />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string; external?: boolean }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="eyebrow">{title}</p>
      <ul className="flex flex-col gap-2.5">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              target={item.external ? "_blank" : undefined}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
