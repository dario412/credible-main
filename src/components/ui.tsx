import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "accent";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-forest text-cream hover:bg-forest-dark border border-forest",
  secondary:
    "bg-transparent text-charcoal border border-charcoal hover:bg-charcoal hover:text-cream",
  ghost: "bg-transparent text-forest hover:underline border border-transparent",
  accent:
    "bg-rust text-white hover:bg-rust-dark border border-rust",
};

export function Button({
  children,
  className,
  variant = "primary",
  type = "button",
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center px-5 py-3 text-sm font-medium transition-colors disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  children,
  className,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: ButtonVariant;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center px-5 py-3 text-sm font-medium transition-colors",
        variants[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function Field({
  label,
  id,
  children,
  hint,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-charcoal">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export const inputClassName =
  "w-full border border-forest/40 bg-transparent px-4 py-3 text-sm text-charcoal outline-none transition-colors placeholder:text-charcoal/45 focus:border-forest focus:outline focus:outline-2 focus:outline-offset-[-2px] focus:outline-forest";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputClassName, props.className)} {...props} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(inputClassName, "min-h-32 resize-y", props.className)}
      {...props}
    />
  );
}
