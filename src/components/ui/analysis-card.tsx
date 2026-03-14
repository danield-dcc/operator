import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const analysisCardRootVariants = tv({
	base: "flex w-full flex-col gap-3 rounded border border-border bg-surface p-5",
	variants: {
		variant: {
			default: "",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

const analysisCardTitleVariants = tv({
	base: "text-sm font-bold text-primary",
});

const analysisCardDescriptionVariants = tv({
	base: "text-xs text-tertiary",
});

const analysisCardBodyVariants = tv({
	base: "text-sm text-secondary",
});

const analysisCardFooterVariants = tv({
	base: "text-xs text-tertiary",
});

type AnalysisCardRootVariants = VariantProps<typeof analysisCardRootVariants>;

type AnalysisCardRootProps = ComponentProps<"div"> & AnalysisCardRootVariants;
type AnalysisCardTitleProps = ComponentProps<"h3">;
type AnalysisCardDescriptionProps = ComponentProps<"p">;
type AnalysisCardBodyProps = ComponentProps<"div">;
type AnalysisCardFooterProps = ComponentProps<"div">;

function AnalysisCardRoot({
	className,
	variant,
	...props
}: AnalysisCardRootProps) {
	return (
		<div
			className={analysisCardRootVariants({ variant, className })}
			{...props}
		/>
	);
}

function AnalysisCardTitle({ className, ...props }: AnalysisCardTitleProps) {
	return <h3 className={analysisCardTitleVariants({ className })} {...props} />;
}

function AnalysisCardDescription({
	className,
	...props
}: AnalysisCardDescriptionProps) {
	return (
		<p className={analysisCardDescriptionVariants({ className })} {...props} />
	);
}

function AnalysisCardBody({ className, ...props }: AnalysisCardBodyProps) {
	return <div className={analysisCardBodyVariants({ className })} {...props} />;
}

function AnalysisCardFooter({ className, ...props }: AnalysisCardFooterProps) {
	return (
		<div className={analysisCardFooterVariants({ className })} {...props} />
	);
}

export {
	AnalysisCardRoot,
	AnalysisCardTitle,
	AnalysisCardDescription,
	AnalysisCardBody,
	AnalysisCardFooter,
	analysisCardRootVariants,
	analysisCardTitleVariants,
	analysisCardDescriptionVariants,
	analysisCardBodyVariants,
	analysisCardFooterVariants,
	type AnalysisCardRootProps,
	type AnalysisCardTitleProps,
	type AnalysisCardDescriptionProps,
	type AnalysisCardBodyProps,
	type AnalysisCardFooterProps,
};
