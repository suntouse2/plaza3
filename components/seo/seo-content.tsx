import { BadgeRussianRuble, Headset, ShieldCheck, Zap } from "lucide-react";
import type { Faq } from "@/data/seo";
import { Card } from "@/components/ui";

/**
 * Текстовый SEO-блок под товарами. Заголовки — настоящие h2/h3
 * (не div/span), чтобы поисковики видели структуру страницы.
 */

export function SeoSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-bold text-foreground sm:text-xl">{title}</h2>
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted">
        {children}
      </div>
    </section>
  );
}

export function SeoSteps({ steps }: { steps: string[] }) {
  return (
    <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {steps.map((step, i) => (
        <li key={i}>
          <Card className="flex h-full gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-fg">
              {i + 1}
            </span>
            <span className="text-sm text-muted">{step}</span>
          </Card>
        </li>
      ))}
    </ol>
  );
}

const ADVANTAGES = [
  {
    icon: Zap,
    title: "Быстрое зачисление",
    text: "Валюта поступает на аккаунт автоматически — в среднем за 2 минуты после оплаты, круглосуточно.",
  },
  {
    icon: ShieldCheck,
    title: "Без пароля и входа в аккаунт",
    text: "Для пополнения нужен только игровой ID. Мы не просим логин, пароль и коды подтверждения.",
  },
  {
    icon: BadgeRussianRuble,
    title: "Оплата из России в рублях",
    text: "Цена в рублях видна до оплаты. Платите через СБП из любого российского банка.",
  },
  {
    icon: Headset,
    title: "Поддержка в Telegram",
    text: "Если что-то пошло не так, поддержка проверит заказ и поможет: зачислит валюту повторно или вернёт деньги.",
  },
];

/** Преимущества: каждое — с собственным h3 внутри секции h2 */
export function SeoAdvantages({ title }: { title: string }) {
  return (
    <SeoSection title={title}>
      <ul className="grid gap-3 sm:grid-cols-2">
        {ADVANTAGES.map(({ icon: Icon, title, text }) => (
          <li key={title}>
            <Card className="flex h-full gap-3">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-accent-text" />
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-bold text-foreground">{title}</h3>
                <p className="text-sm text-muted">{text}</p>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </SeoSection>
  );
}

/** FAQ: каждый вопрос — отдельный h2, ответ виден сразу (не скрыт в аккордеоне) */
export function SeoFaq({ label, items }: { label: string; items: Faq[] }) {
  return (
    <section className="flex flex-col gap-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-subtle">
        {label}
      </p>
      <div className="flex flex-col gap-3">
        {items.map(({ q, a }) => (
          <Card key={q} className="flex flex-col gap-1.5">
            <h2 className="text-base font-bold text-foreground">{q}</h2>
            <p className="text-sm leading-relaxed text-muted">{a}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function faqJsonLd(items: Faq[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}
