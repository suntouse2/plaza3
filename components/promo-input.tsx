import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "./ui";
import { Tooltip } from "./ui/tooltip";
import { Info, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "./ui";

type PromoStatus = "idle" | "checking" | "valid" | "invalid";

export default function PromoInput({
  onValidChange,
  className,
  showErrorText = true,
}: {
  onValidChange?: (promo: string | null) => void;
  className?: string;
  showErrorText?: boolean;
}) {
  const [promo, setPromo] = useState("");
  const [status, setStatus] = useState<PromoStatus>("idle");
  const [shakeKey, setShakeKey] = useState(0);
  const debouncedPromo = useDebounce(promo.trim(), 500);

  useEffect(() => {
    if (!debouncedPromo) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("idle");
      onValidChange?.(null);
      return;
    }

    let cancelled = false;
    setStatus("checking");

    fetch(`/api/check-promo?promo=${encodeURIComponent(debouncedPromo)}`)
      .then((res) => res.json())
      .then((data: { valid: boolean }) => {
        if (cancelled) return;
        if (data.valid) {
          setStatus("valid");
          onValidChange?.(debouncedPromo);
        } else {
          setStatus("invalid");
          setShakeKey((k) => k + 1); // перезапуск shake
          onValidChange?.(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("invalid");
          setShakeKey((k) => k + 1);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedPromo, onValidChange]);

  const showError = status === "invalid";
  const showSuccess = status === "valid";

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div
        key={shakeKey}
        className={cn("relative h-full", showError && "animate-shake")}
      >
        <Ticket
          className={cn(
            "pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors",
            showError
              ? "text-danger"
              : showSuccess
              ? "text-success"
              : "text-muted"
          )}
        />
        <Input
          value={promo}
          onChange={(e) => setPromo(e.target.value)}
          placeholder="Промокод"
          variant="filled"
          aria-invalid={showError}
          className={cn(
            "h-full! min-h-12! bg-black/40! rounded-xl pl-10 pr-11 transition-colors",
            showError && "border-danger! ring-1 ring-danger! text-danger!",
            showSuccess && "border-success-border!"
          )}
        />

        <div className="absolute right-3 top-1/2 z-10 -translate-y-1/2">
          <Tooltip content="Введите промокод, чтобы получить скидку на заказ">
            <button
              type="button"
              aria-label="Подробнее о промокоде"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-subtle transition-colors hover:text-foreground cursor-pointer"
            >
              <Info className="h-4 w-4" />
            </button>
          </Tooltip>
        </div>
      </div>

      {showError && showErrorText && (
        <p className="px-1 text-xs text-danger">Промокод не найден</p>
      )}
      {showSuccess && (
        <p className="px-1 text-xs text-success">Промокод применён</p>
      )}
    </div>
  );
}
