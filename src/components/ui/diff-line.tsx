import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

const diffLineVariants = tv({
	base: "flex gap-2 px-4 py-2 font-mono text-[13px] w-full",
	variants: {
		type: {
			added: "bg-diff-added",
			removed: "bg-diff-removed",
			context: "",
		},
	},
	defaultVariants: {
		type: "context",
	},
});

const prefixMap = {
	added: "+",
	removed: "-",
	context: " ",
} as const;

const prefixColorMap = {
	added: "text-accent-green",
	removed: "text-accent-red",
	context: "text-tertiary",
} as const;

const codeColorMap = {
	added: "text-primary",
	removed: "text-secondary",
	context: "text-secondary",
} as const;

type DiffLineVariants = VariantProps<typeof diffLineVariants>;

type DiffLineProps = {
	type?: DiffLineVariants["type"];
	children: string;
	className?: string;
};

function DiffLine({ type = "context", children, className }: DiffLineProps) {
	const resolvedType = type ?? "context";

	return (
		<div className={diffLineVariants({ type, className })}>
			<span className={twMerge("select-none", prefixColorMap[resolvedType])}>
				{prefixMap[resolvedType]}
			</span>
			<span className={codeColorMap[resolvedType]}>{children}</span>
		</div>
	);
}

export { DiffLine, diffLineVariants, type DiffLineProps };
