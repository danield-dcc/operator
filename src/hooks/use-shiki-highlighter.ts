import { useCallback, useEffect, useRef, useState } from "react";
import { highlightCode } from "@/lib/shiki";

type UseShikiHighlighterReturn = {
	highlightedHtml: string;
	isLoading: boolean;
};

function useShikiHighlighter(
	code: string,
	language: string,
	debounceMs = 50,
): UseShikiHighlighterReturn {
	const [highlightedHtml, setHighlightedHtml] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const latestRequestRef = useRef(0);

	const highlight = useCallback(
		async (codeToHighlight: string, lang: string, requestId: number) => {
			if (!codeToHighlight.trim()) {
				if (requestId === latestRequestRef.current) {
					setHighlightedHtml("");
					setIsLoading(false);
				}
				return;
			}

			try {
				const html = await highlightCode(codeToHighlight, lang);

				if (requestId === latestRequestRef.current) {
					setHighlightedHtml(html);
					setIsLoading(false);
				}
			} catch {
				if (requestId === latestRequestRef.current) {
					setIsLoading(false);
				}
			}
		},
		[],
	);

	useEffect(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		if (!code.trim()) {
			setHighlightedHtml("");
			setIsLoading(false);
			return;
		}

		if (language === "plaintext") {
			setHighlightedHtml("");
			setIsLoading(false);
			return;
		}

		setIsLoading(true);
		const requestId = ++latestRequestRef.current;

		timeoutRef.current = setTimeout(() => {
			highlight(code, language, requestId);
		}, debounceMs);

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [code, language, debounceMs, highlight]);

	return { highlightedHtml, isLoading };
}

export { useShikiHighlighter, type UseShikiHighlighterReturn };
