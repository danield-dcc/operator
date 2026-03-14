"use client";

import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const codeEditorRootVariants = tv({
	base: "w-full overflow-hidden rounded border border-border bg-input",
	variants: {
		variant: {
			default: "",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

const codeEditorHeaderVariants = tv({
	base: "flex h-10 items-center gap-2 border-b border-border px-4",
	variants: {
		variant: {
			default: "",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

const codeEditorTextareaVariants = tv({
	base: "h-[300px] w-full resize-none bg-transparent p-4 font-mono text-xs text-primary outline-none placeholder:text-tertiary",
});

type CodeEditorRootVariants = VariantProps<typeof codeEditorRootVariants>;
type CodeEditorHeaderVariants = VariantProps<typeof codeEditorHeaderVariants>;
type CodeEditorTextareaVariants = VariantProps<
	typeof codeEditorTextareaVariants
>;

type CodeEditorRootProps = ComponentProps<"div"> & CodeEditorRootVariants;
type CodeEditorHeaderProps = ComponentProps<"div"> & CodeEditorHeaderVariants;
type CodeEditorTextareaProps = ComponentProps<"textarea"> &
	CodeEditorTextareaVariants;

function CodeEditorRoot({ className, variant, ...props }: CodeEditorRootProps) {
	return (
		<div
			className={codeEditorRootVariants({ variant, className })}
			{...props}
		/>
	);
}

function CodeEditorHeader({
	className,
	variant,
	children,
	...props
}: CodeEditorHeaderProps) {
	return (
		<div
			className={codeEditorHeaderVariants({ variant, className })}
			{...props}
		>
			<span className="inline-block h-3 w-3 rounded-full bg-accent-red" />
			<span className="inline-block h-3 w-3 rounded-full bg-accent-amber" />
			<span className="inline-block h-3 w-3 rounded-full bg-accent-green" />
			{children}
		</div>
	);
}

function CodeEditorTextarea({ className, ...props }: CodeEditorTextareaProps) {
	return (
		<textarea
			className={codeEditorTextareaVariants({ className })}
			spellCheck={false}
			{...props}
		/>
	);
}

export {
	CodeEditorRoot,
	CodeEditorHeader,
	CodeEditorTextarea,
	codeEditorRootVariants,
	codeEditorHeaderVariants,
	codeEditorTextareaVariants,
	type CodeEditorRootProps,
	type CodeEditorHeaderProps,
	type CodeEditorTextareaProps,
};
