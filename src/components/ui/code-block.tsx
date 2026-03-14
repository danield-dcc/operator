import type { BundledLanguage, BundledTheme } from "shiki";
import { codeToHtml } from "shiki";

type CodeBlockProps = {
	code: string;
	lang: BundledLanguage;
	theme?: BundledTheme;
	filename?: string;
};

async function CodeBlock({
	code,
	lang,
	theme = "vesper",
	filename,
}: CodeBlockProps) {
	const html = await codeToHtml(code, {
		lang,
		theme,
	});

	return (
		<div className="overflow-hidden rounded border border-border bg-input">
			<header className="flex h-10 items-center gap-3 border-b border-border px-4">
				<span className="inline-block h-2.5 w-2.5 rounded-full bg-accent-red" />
				<span className="inline-block h-2.5 w-2.5 rounded-full bg-accent-amber" />
				<span className="inline-block h-2.5 w-2.5 rounded-full bg-accent-green" />
				<span className="flex-1" />
				{filename && (
					<span className="font-mono text-xs text-tertiary">{filename}</span>
				)}
			</header>
			<div data-shiki dangerouslySetInnerHTML={{ __html: html }} />
		</div>
	);
}

export { CodeBlock, type CodeBlockProps };
