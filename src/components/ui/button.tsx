import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

// Variants and sizes follow DESIGN.md §6 (Buttons) and §5 (Shape and depth).
const pressable =
  "motion-safe:active:not-aria-[haspopup]:translate-y-1 active:not-aria-[haspopup]:shadow-none";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl font-semibold whitespace-nowrap transition-all duration-150 ease-out outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default: cn(
          "bg-gradient-button font-bold text-primary-foreground shadow-edge-primary hover:brightness-105",
          pressable,
        ),
        secondary: cn(
          "border-2 border-border bg-background text-secondary-foreground shadow-edge-secondary hover:bg-secondary aria-expanded:bg-secondary",
          pressable,
        ),
        ghost:
          "text-secondary-foreground hover:bg-secondary aria-expanded:bg-secondary",
        destructive: cn(
          "bg-danger font-bold text-white shadow-edge-danger hover:brightness-105",
          pressable,
        ),
        link: "text-secondary-foreground underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 gap-2 px-5 text-base",
        sm: "h-9 gap-1.5 px-4 text-sm",
        lg: "h-13 gap-2 px-6 text-base",
        icon: "size-11",
        "icon-sm": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
