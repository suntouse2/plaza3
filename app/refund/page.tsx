import Link from "next/link";
import { Card } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import { supportLink } from "@/data/shared";

type Section = {
  title: string;
  intro?: string;
  items?: string[];
};

const SECTIONS: Section[] = [
  {
    title: "1. Форма возврата",
    intro:
      "Агент возвращает денежные средства Принципала исключительно в виде доступных к использованию в Сервисе Плазмитов.",
  },
  {
    title: "2. Подтверждение активации",
    intro:
      "Принципал обязан после получения уникального цифрового кода (ключа) Игры/платформы осуществить видеозапись его активации в Игре/платформе.",
  },
  {
    title: "3. Случаи возврата средств",
    intro: "Агент возвращает денежные средства в следующих случаях:",
    items: [
      "поручение, направленное Принципалом, не было исполнено либо не может быть исполнено по причинам, зависящим от Агента;",
      "Принципал получил неверный уникальный цифровой код (ключ) Игры;",
      "Принципал предоставил несуществующие данные, необходимые для перевода денежных средств правообладателю Игры;",
      "в иных случаях на усмотрение Агента.",
    ],
  },
  {
    title: "4. Случаи отказа в возврате",
    intro: "Агент не возвращает денежные средства в следующих случаях:",
    items: [
      "Принципал не предоставил видеозапись процесса активации уникального цифрового кода (ключа) Игры;",
      "Принципал ошибочно предоставил данные другого пользователя Игры;",
      "поручение исполнено в соответствии с описанием, размещённым в Сервисе, однако результат не соответствует ожиданиям Принципала.",
    ],
  },
  {
    title: "5. Обращения",
    intro:
      `Принципал направляет обращения, связанные с возвратом денежных средств, через службу поддержки в Telegram: ${supportLink}`,
  },
];

export default function RefundPage() {
  return (
    <div className="mx-auto w-full max-w-3xl py-2">
      {/* Назад */}
      <Link
        href="/"
        className="mb-4 flex w-max items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        На главную
      </Link>

      {/* Заголовок */}
      <div className="mb-6 flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-subtle">
          Документы
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Политика возвратов
        </h1>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          Определяет условия возврата денежных средств по неисполненным
          поручениям Принципала и является частью оферты, размещённой по адресу{" "}
          <Link href="/eula" className="text-accent-text">
            Пользовательское соглашение
          </Link>
          .
        </p>
      </div>

      {/* Контент */}
      <Card className="flex flex-col gap-7 p-5 sm:p-8">
        {SECTIONS.map((section) => (
          <section key={section.title} className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-foreground">
              {section.title}
            </h2>
            {section.intro && (
              <p className="text-sm leading-relaxed text-muted">
                {section.intro}
              </p>
            )}
            {section.items && (
              <ul className="flex flex-col gap-2.5">
                {section.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-2.5 text-sm leading-relaxed text-muted"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <p className="border-t border-card-border pt-5 text-xs text-subtle">
          Последнее обновление:{" "}
          {new Date().toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
      </Card>
    </div>
  );
}
