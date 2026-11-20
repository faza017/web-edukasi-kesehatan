import Link from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-gradient-to-r from-[#ec4899] to-[#db2777] text-white shadow-sm shadow-pink-500/25 hover:from-[#db2777] hover:to-[#be185d] hover:shadow-md hover:shadow-pink-500/30 disabled:opacity-60",
  dark:
    "bg-brand-900 text-white shadow-sm hover:bg-brand-800 hover:shadow-md",
  outline:
    "border border-line bg-white text-brand-900 hover:border-brand-600 hover:bg-brand-50/70 hover:shadow-xs",
  ghost: "text-brand-700 hover:bg-brand-50",
  danger: "bg-red-600 text-white shadow-xs hover:bg-red-700",
  "danger-outline": "border border-red-200 bg-white text-red-600 hover:bg-red-50",
};

const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
};

/**
 * Tombol interaktif dengan animasi sentuhan (hover lift & active press bounce).
 */
export default function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  type = "button",
  ...props
}) {
  const classes = cn(
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] disabled:pointer-events-none disabled:cursor-not-allowed",
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
