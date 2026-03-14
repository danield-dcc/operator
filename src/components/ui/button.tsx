import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
	base: "inline-flex items-center justify-center gap-2 font-mono text-sm font-medium transition-colors cursor-pointer disabled:pointer-events-none disabled:opacity-50",
	variants: {
		variant: {
			primary:
				"bg-accent-green text-page px-6 py-2.5 enabled:hover:bg-accent-green/90",
			secondary:
				"bg-transparent text-primary border border-border px-4 py-2 text-xs enabled:hover:bg-border/20",
			ghost:
				"bg-transparent text-secondary border border-border px-3 py-1.5 text-xs enabled:hover:text-primary enabled:hover:border-secondary",
		},
		size: {
			sm: "px-3 py-1.5 text-xs",
			md: "px-4 py-2 text-xs",
			lg: "px-6 py-2.5 text-sm",
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "lg",
	},
});

type ButtonVariants = VariantProps<typeof buttonVariants>;

type ButtonProps = ComponentProps<"button"> & ButtonVariants;

function Button({ className, variant, size, ...props }: ButtonProps) {
	return (
		<button
			className={buttonVariants({ variant, size, className })}
			{...props}
		/>
	);
}

export { Button, buttonVariants, type ButtonProps };
