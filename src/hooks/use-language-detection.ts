import { useCallback, useEffect, useRef, useState } from "react";
import { detectLanguage, type SupportedLanguageId } from "@/lib/hljs";

type UseLanguageDetectionReturn = {
	detectedLanguage: SupportedLanguageId | null;
	selectedLanguage: string;
	manualLanguage: string | null;
	setManualLanguage: (lang: string | null) => void;
	isAutoDetected: boolean;
};

function useLanguageDetection(
	code: string,
	debounceMs = 150,
): UseLanguageDetectionReturn {
	const [detectedLanguage, setDetectedLanguage] =
		useState<SupportedLanguageId | null>(null);
	const [manualLanguage, setManualLanguage] = useState<string | null>(null);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (manualLanguage) return;

		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(() => {
			const detected = detectLanguage(code);
			setDetectedLanguage(detected);
		}, debounceMs);

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [code, debounceMs, manualLanguage]);

	const selectedLanguage = manualLanguage ?? detectedLanguage ?? "plaintext";
	const isAutoDetected = manualLanguage === null;

	const handleSetManualLanguage = useCallback((lang: string | null) => {
		setManualLanguage(lang);
		if (lang === null) {
			setDetectedLanguage(null);
		}
	}, []);

	return {
		detectedLanguage,
		selectedLanguage,
		manualLanguage,
		setManualLanguage: handleSetManualLanguage,
		isAutoDetected,
	};
}

export { useLanguageDetection, type UseLanguageDetectionReturn };
