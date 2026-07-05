import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-2xl border border-transparent bg-clip-padding font-bold tracking-wide whitespace-nowrap transition-all duration-300 ease-out outline-none select-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-extruded hover:-translate-y-[1px] hover:shadow-extruded-hover active:translate-y-[0.5px] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2),inset_-4px_-4px_8px_rgba(255,255,255,0.2)]",
        secondary: "bg-secondary text-secondary-foreground shadow-extruded hover:-translate-y-[1px] hover:shadow-extruded-hover active:translate-y-[0.5px] active:shadow-inset-sm",
        outline: "bg-transparent text-foreground hover:shadow-extruded hover:-translate-y-[1px] active:translate-y-[0.5px] active:shadow-inset-sm",
        ghost: "bg-transparent text-foreground hover:shadow-inset-sm active:shadow-inset-deep",
        destructive: "bg-destructive text-destructive-foreground shadow-extruded hover:-translate-y-[1px] hover:shadow-extruded-hover active:translate-y-[0.5px] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2),inset_-4px_-4px_8px_rgba(255,255,255,0.2)]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 text-base gap-2",
        xs: "h-8 px-3 text-xs gap-1",
        sm: "h-10 px-4 text-sm gap-1.5",
        lg: "h-14 px-8 text-lg gap-2.5",
        icon: "size-12 rounded-2xl",
        "icon-xs": "size-8 rounded-xl",
        "icon-sm": "size-10 rounded-xl",
        "icon-lg": "size-14 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

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
  )
}

export { Button, buttonVariants }
