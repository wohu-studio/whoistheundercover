import { ReactNode, ButtonHTMLAttributes } from "react";

interface DesertButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "tertiary";
}

export function DesertButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: DesertButtonProps) {
  const variantClasses = {
    primary:
      "bg-primary/90 text-on-primary hover:bg-primary shadow-neon-pink hover:shadow-[0_0_20px_rgba(224,64,251,0.5),0_0_40px_rgba(224,64,251,0.2)]",
    secondary:
      "bg-secondary/90 text-on-secondary hover:bg-secondary shadow-neon-cyan hover:shadow-[0_0_20px_rgba(0,229,255,0.5),0_0_40px_rgba(0,229,255,0.2)]",
    tertiary:
      "bg-surface-container-high/80 hover:bg-surface-container-highest text-on-surface border border-outline-variant/60 hover:border-primary/40",
  };

  return (
    <button
      className={`
        px-6 py-3 rounded-lg font-bold
        transition-all duration-200
        active:scale-95
        disabled:opacity-40 disabled:shadow-none disabled:scale-100
        ${variantClasses[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
