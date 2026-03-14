import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const dotVariants = tv({
	base: "inline-block h-2 w-2 shrink-0 rounded-full",
	variants: {
		status: {
			critical: "bg-accent-red",
			warning: "bg-accent-amber",
			good: "bg-accent-green",
		},
	},
	defaultVariants: {
		status: "good",
	},
});

const statusBadgeVariants = tv({
	base: "inline-flex items-center gap-2 font-mono text-xs",
	variants: {
		status: {
			critical: "text-accent-red",
			warning: "text-accent-amber",
			good: "text-accent-green",
		},
	},
	defaultVariants: {
		status: "good",
	},
});

type StatusBadgeVariants = VariantProps<typeof statusBadgeVariants>;

type StatusBadgeProps = ComponentProps<"span"> & StatusBadgeVariants;

function StatusBadge({
	className,
	status,
	children,
	...props
}: StatusBadgeProps) {
	return (
		<span
			className={statusBadgeVariants({ status, className })}
			{...props}
		>
			<span className={dotVariants({ status })} />
			{children}
		</span>
	);
}

export { StatusBadge, statusBadgeVariants, type StatusBadgeProps };
