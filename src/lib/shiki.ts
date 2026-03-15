import type { BundledLanguage, BundledTheme } from "shiki";
import { createHighlighter } from "shiki";

type Highlighter = Awaited<ReturnType<typeof createHighlighter>>;

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighter({
			themes: ["vesper"],
			langs: ["javascript", "typescript", "python", "json"],
		});
	}

	return highlighterPromise;
}

/**
 * Maps highlight.js language IDs to Shiki BundledLanguage IDs.
 * Most are identical, but some differ (e.g., hljs "xml" -> shiki "html").
 */
const HLJS_TO_SHIKI: Record<string, BundledLanguage> = {
	javascript: "javascript",
	typescript: "typescript",
	python: "python",
	java: "java",
	c: "c",
	cpp: "cpp",
	csharp: "csharp",
	go: "go",
	rust: "rust",
	ruby: "ruby",
	php: "php",
	swift: "swift",
	kotlin: "kotlin",
	xml: "html",
	css: "css",
	sql: "sql",
	bash: "bash",
	json: "json",
	yaml: "yaml",
	markdown: "markdown",
};

async function highlightCode(code: string, lang: string): Promise<string> {
	const highlighter = await getHighlighter();

	const shikiLang = HLJS_TO_SHIKI[lang] ?? "javascript";

	const loadedLanguages = highlighter.getLoadedLanguages();
	if (!loadedLanguages.includes(shikiLang)) {
		await highlighter.loadLanguage(shikiLang as BundledLanguage);
	}

	return highlighter.codeToHtml(code, {
		lang: shikiLang,
		theme: "vesper" as BundledTheme,
	});
}

export { getHighlighter, highlightCode, HLJS_TO_SHIKI };
