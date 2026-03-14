import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const tableRowRootVariants = tv({
	base: "flex w-full items-center gap-6 border-b border-border px-5 py-4 font-mono",
	variants: {
		variant: {
			default: "",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

const tableRowRankVariants = tv({
	base: "w-10 shrink-0 text-[13px] text-tertiary",
});

const tableRowScoreVariants = tv({
	base: "w-[60px] shrink-0 text-[13px] font-bold",
	variants: {
		tone: {
			neutral: "text-secondary",
			critical: "text-accent-red",
			warning: "text-accent-amber",
			good: "text-accent-green",
		},
	},
	defaultVariants: {
		tone: "neutral",
	},
});

const tableRowCodeVariants = tv({
	base: "min-w-0 flex-1 truncate text-xs text-secondary",
});

const tableRowLanguageVariants = tv({
	base: "w-[100px] shrink-0 text-right text-xs text-tertiary",
});

type TableRowRootVariants = VariantProps<typeof tableRowRootVariants>;
type TableRowScoreVariants = VariantProps<typeof tableRowScoreVariants>;

type TableRowRootProps = ComponentProps<"div"> & TableRowRootVariants;
type TableRowRankProps = ComponentProps<"span">;
type TableRowScoreProps = ComponentProps<"span"> & TableRowScoreVariants;
type TableRowCodeProps = ComponentProps<"span">;
type TableRowLanguageProps = ComponentProps<"span">;

function TableRowRoot({ className, variant, ...props }: TableRowRootProps) {
	return (
		<div className={tableRowRootVariants({ variant, className })} {...props} />
	);
}

function TableRowRank({ className, ...props }: TableRowRankProps) {
	return <span className={tableRowRankVariants({ className })} {...props} />;
}

function TableRowScore({ className, tone, ...props }: TableRowScoreProps) {
	return (
		<span className={tableRowScoreVariants({ tone, className })} {...props} />
	);
}

function TableRowCode({ className, ...props }: TableRowCodeProps) {
	return <span className={tableRowCodeVariants({ className })} {...props} />;
}

function TableRowLanguage({ className, ...props }: TableRowLanguageProps) {
	return (
		<span className={tableRowLanguageVariants({ className })} {...props} />
	);
}

export {
	TableRowRoot,
	TableRowRank,
	TableRowScore,
	TableRowCode,
	TableRowLanguage,
	tableRowRootVariants,
	tableRowRankVariants,
	tableRowScoreVariants,
	tableRowCodeVariants,
	tableRowLanguageVariants,
	type TableRowRootProps,
	type TableRowRankProps,
	type TableRowScoreProps,
	type TableRowCodeProps,
	type TableRowLanguageProps,
};
