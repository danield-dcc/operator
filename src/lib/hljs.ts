import hljs from "highlight.js/lib/core";

import bash from "highlight.js/lib/languages/bash";
import c from "highlight.js/lib/languages/c";
import cpp from "highlight.js/lib/languages/cpp";
import csharp from "highlight.js/lib/languages/csharp";
import css from "highlight.js/lib/languages/css";
import go from "highlight.js/lib/languages/go";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import kotlin from "highlight.js/lib/languages/kotlin";
import markdown from "highlight.js/lib/languages/markdown";
import php from "highlight.js/lib/languages/php";
import python from "highlight.js/lib/languages/python";
import ruby from "highlight.js/lib/languages/ruby";
import rust from "highlight.js/lib/languages/rust";
import sql from "highlight.js/lib/languages/sql";
import swift from "highlight.js/lib/languages/swift";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";

hljs.registerLanguage("bash", bash);
hljs.registerLanguage("c", c);
hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("csharp", csharp);
hljs.registerLanguage("css", css);
hljs.registerLanguage("go", go);
hljs.registerLanguage("java", java);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("json", json);
hljs.registerLanguage("kotlin", kotlin);
hljs.registerLanguage("markdown", markdown);
hljs.registerLanguage("php", php);
hljs.registerLanguage("python", python);
hljs.registerLanguage("ruby", ruby);
hljs.registerLanguage("rust", rust);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("swift", swift);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("yaml", yaml);

const SUPPORTED_LANGUAGES = [
	{ id: "javascript", label: "JavaScript" },
	{ id: "typescript", label: "TypeScript" },
	{ id: "python", label: "Python" },
	{ id: "java", label: "Java" },
	{ id: "c", label: "C" },
	{ id: "cpp", label: "C++" },
	{ id: "csharp", label: "C#" },
	{ id: "go", label: "Go" },
	{ id: "rust", label: "Rust" },
	{ id: "ruby", label: "Ruby" },
	{ id: "php", label: "PHP" },
	{ id: "swift", label: "Swift" },
	{ id: "kotlin", label: "Kotlin" },
	{ id: "xml", label: "HTML" },
	{ id: "css", label: "CSS" },
	{ id: "sql", label: "SQL" },
	{ id: "bash", label: "Shell" },
	{ id: "json", label: "JSON" },
	{ id: "yaml", label: "YAML" },
	{ id: "markdown", label: "Markdown" },
] as const;

type SupportedLanguageId = (typeof SUPPORTED_LANGUAGES)[number]["id"];

const LANGUAGE_IDS = SUPPORTED_LANGUAGES.map((lang) => lang.id);

function detectLanguage(code: string): SupportedLanguageId | null {
	if (!code.trim()) return null;

	const result = hljs.highlightAuto(code, [...LANGUAGE_IDS]);

	if (result.language && result.relevance > 0) {
		return result.language as SupportedLanguageId;
	}

	return null;
}

export {
	SUPPORTED_LANGUAGES,
	LANGUAGE_IDS,
	detectLanguage,
	type SupportedLanguageId,
};
