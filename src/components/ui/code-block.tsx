import { cacheLife } from "next/cache";
import type { BundledLanguage, BundledTheme } from "shiki";
import { codeToHtml } from "shiki";
import { twMerge } from "tailwind-merge";

type CodeBlockProps = {
	code: string;
	lang: BundledLanguage;
	theme?: BundledTheme;
	filename?: string;
	showHeader?: boolean;
	showLineNumbers?: boolean;
	className?: string;
};

async function CodeBlock({
	code,
	lang,
	theme = "vesper",
	filename,
	showHeader = true,
	showLineNumbers = false,
	className,
}: CodeBlockProps) {
	"use cache";
	cacheLife({ expire: 3600 });

	const html = await codeToHtml(code, {
		lang,
		theme,
	});

	const lineCount = code.split("\n").length;

	return (
		<div
			className={twMerge(
				"overflow-hidden rounded border border-border bg-input",
				className,
			)}
		>
			{showHeader && (
				<header className="flex h-10 items-center gap-3 border-b border-border px-4">
					<span className="inline-block h-2.5 w-2.5 rounded-full bg-accent-red" />
					<span className="inline-block h-2.5 w-2.5 rounded-full bg-accent-amber" />
					<span className="inline-block h-2.5 w-2.5 rounded-full bg-accent-green" />
					<span className="flex-1" />
					{filename && (
						<span className="font-mono text-xs text-tertiary">{filename}</span>
					)}
				</header>
			)}

			{showLineNumbers ? (
				<div className="flex">
					<div
						aria-hidden="true"
						className="flex w-10 shrink-0 select-none flex-col items-end gap-0 border-r border-border-secondary bg-surface px-2.5 py-3.5"
					>
						{Array.from({ length: lineCount }, (_, index) => index + 1).map(
							(lineNumber) => (
								<span
									key={lineNumber}
									className="block font-mono text-xs leading-[1.6] text-tertiary"
									style={{ fontSize: 13 }}
								>
									{lineNumber}
								</span>
							),
						)}
					</div>
					<div
						className="min-w-0 flex-1"
						data-shiki
						// biome-ignore lint/security/noDangerouslySetInnerHtml: shiki-generated HTML
						dangerouslySetInnerHTML={{ __html: html }}
					/>
				</div>
			) : (
				<div
					data-shiki
					// biome-ignore lint/security/noDangerouslySetInnerHtml: shiki-generated HTML
					dangerouslySetInnerHTML={{ __html: html }}
				/>
			)}
		</div>
	);
}

export { CodeBlock, type CodeBlockProps };
