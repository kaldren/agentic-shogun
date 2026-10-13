import { cn } from "@/lib/utils";

// Progress bar from DESIGN.md §6 (Learning feedback).
export function ProgressBar({
  value,
  max,
  label,
  className,
}: {
  value: number;
  max: number;
  label: string;
  className?: string;
}) {
  const percent = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cn("h-4 overflow-hidden rounded-full bg-green-200", className)}
    >
      <div
        className="bg-gradient-button h-full rounded-full transition-all duration-150 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
