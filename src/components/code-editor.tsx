"use client";

import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";
import { useCallback, useEffect, useRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { useLanguageDetection } from "@/hooks/use-language-detection";
import { useShikiHighlighter } from "@/hooks/use-shiki-highlighter";
import { SUPPORTED_LANGUAGES } from "@/lib/hljs";

// --- Variants ---

const codeEditorRootVariants = tv({
  base: "w-full overflow-hidden rounded border border-border bg-input",
});

const codeEditorHeaderVariants = tv({
  base: "flex h-10 items-center gap-2 border-b border-border px-4",
});

// --- Types ---

type CodeEditorRootVariants = VariantProps<typeof codeEditorRootVariants>;
type CodeEditorHeaderVariants = VariantProps<typeof codeEditorHeaderVariants>;

type CodeEditorRootProps = ComponentProps<"div"> & CodeEditorRootVariants;
type CodeEditorHeaderProps = ComponentProps<"div"> &
  CodeEditorHeaderVariants & {
    selectedLanguage: string;
    isAutoDetected: boolean;
    onLanguageChange: (lang: string | null) => void;
  };

type CodeEditorBodyProps = {
  code: string;
  highlightedHtml: string;
  isHighlighting: boolean;
  onChange: (value: string) => void;
  placeholder?: string;
};

// --- Constants ---

const CODE_MAX_LENGTH = 2500;

// --- Helpers ---

function getLineCount(code: string): number {
  if (!code) return 1;
  return code.split("\n").length;
}

function getIndentation(line: string): string {
  const match = line.match(/^(\s*)/);
  return match ? match[1] : "";
}

function shouldIncreaseIndent(line: string): boolean {
  const trimmed = line.trimEnd();
  return (
    trimmed.endsWith("{") ||
    trimmed.endsWith("[") ||
    trimmed.endsWith("(") ||
    trimmed.endsWith(":") ||
    trimmed.endsWith(">")
  );
}

// --- Components ---

function CodeEditorRoot({ className, ...props }: CodeEditorRootProps) {
  return <div className={codeEditorRootVariants({ className })} {...props} />;
}

function CodeEditorHeader({
  className,
  selectedLanguage,
  isAutoDetected,
  onLanguageChange,
  ...props
}: CodeEditorHeaderProps) {
  return (
    <div className={codeEditorHeaderVariants({ className })} {...props}>
      <span className="inline-block h-3 w-3 rounded-full bg-accent-red" />
      <span className="inline-block h-3 w-3 rounded-full bg-accent-amber" />
      <span className="inline-block h-3 w-3 rounded-full bg-accent-green" />

      <div className="ml-auto flex items-center gap-2">
        {isAutoDetected && selectedLanguage !== "plaintext" && (
          <span className="text-[10px] text-tertiary">auto</span>
        )}

        <div className="relative">
          <select
            value={selectedLanguage}
            onChange={(e) => {
              const value = e.target.value;
              onLanguageChange(value === "auto" ? null : value);
            }}
            className="cursor-pointer appearance-none rounded bg-transparent py-1 pl-2 pr-6 text-xs text-secondary outline-none transition-colors hover:text-primary focus:text-primary"
          >
            <option value="auto" className="bg-elevated text-primary">
              auto-detect
            </option>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option
                key={lang.id}
                value={lang.id}
                className="bg-elevated text-primary"
              >
                {lang.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-tertiary"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}

function CodeEditorBody({
  code,
  highlightedHtml,
  isHighlighting,
  onChange,
  placeholder = "// paste your code here...",
}: CodeEditorBodyProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineCount = getLineCount(code);
  const showPlain = isHighlighting || !highlightedHtml;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const textarea = e.currentTarget;
      const { selectionStart, selectionEnd, value } = textarea;

      // Tab — insert or indent
      if (e.key === "Tab") {
        e.preventDefault();
        const tab = "  ";

        if (e.shiftKey) {
          // Shift+Tab — dedent
          const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
          const line = value.slice(lineStart, selectionEnd);

          if (line.startsWith(tab)) {
            const newValue =
              value.slice(0, lineStart) +
              line.slice(tab.length) +
              value.slice(selectionEnd);
            onChange(newValue);
            requestAnimationFrame(() => {
              textarea.selectionStart = selectionStart - tab.length;
              textarea.selectionEnd = selectionEnd - tab.length;
            });
          }
        } else {
          // Tab — indent
          const newValue =
            value.slice(0, selectionStart) + tab + value.slice(selectionEnd);
          onChange(newValue);
          requestAnimationFrame(() => {
            textarea.selectionStart = selectionStart + tab.length;
            textarea.selectionEnd = selectionStart + tab.length;
          });
        }
        return;
      }

      // Enter — auto-indent
      if (e.key === "Enter") {
        e.preventDefault();
        const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
        const currentLine = value.slice(lineStart, selectionStart);
        const indent = getIndentation(currentLine);
        const extra = shouldIncreaseIndent(currentLine) ? "  " : "";
        const insertion = `\n${indent}${extra}`;

        const newValue =
          value.slice(0, selectionStart) +
          insertion +
          value.slice(selectionEnd);
        onChange(newValue);
        requestAnimationFrame(() => {
          const newPos = selectionStart + insertion.length;
          textarea.selectionStart = newPos;
          textarea.selectionEnd = newPos;
        });
      }
    },
    [onChange],
  );

  return (
    <div className="flex min-h-[273.6px] max-h-[419.2px] overflow-y-auto">
      {/* Line numbers */}
      <div
        aria-hidden="true"
        className="flex w-12 shrink-0 select-none flex-col border-r border-border-secondary bg-surface py-3 text-right"
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <span
            key={i}
            className="block px-3 font-mono text-xs leading-[1.6] text-tertiary"
            style={{ fontSize: 13 }}
          >
            {i + 1}
          </span>
        ))}
      </div>

      {/* Editor overlay area */}
      <div className="relative min-w-0 flex-1">
        {/* Highlighted code layer */}
        <div
          aria-hidden="true"
          className="pointer-events-none whitespace-pre-wrap wrap-break-word p-3 font-mono text-xs leading-[1.6] text-primary"
          style={{ fontSize: 13 }}
        >
          {showPlain ? (
            <span className="whitespace-pre-wrap wrap-break-word">
              {code || "\u00A0"}
            </span>
          ) : (
            <div
              className="[&_pre]:m-0! [&_pre]:bg-transparent! [&_pre]:p-0!"
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />
          )}
        </div>

        {/* Textarea input layer */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          placeholder={placeholder}
          className="absolute inset-0 h-full w-full resize-none overflow-hidden bg-transparent p-3 font-mono text-xs leading-[1.6] text-transparent caret-primary outline-none [-webkit-text-fill-color:transparent] placeholder:[-webkit-text-fill-color:var(--color-tertiary)]"
          style={{
            fontSize: 13,
          }}
        />
      </div>
    </div>
  );
}

function CodeEditorFooter({
  currentLength,
  maxLength,
}: {
  currentLength: number;
  maxLength: number;
}) {
  const isOverLimit = currentLength > maxLength;

  return (
    <div className="flex h-8 items-center justify-end border-t border-border px-4">
      <span
        className={`font-mono text-xs ${isOverLimit ? "text-danger" : "text-tertiary"}`}
      >
        {currentLength} / {maxLength}
      </span>
    </div>
  );
}

// --- Composed editor (with hooks) ---

type CodeEditorProps = {
  code: string;
  onChange: (value: string) => void;
  onLanguageChange?: (language: string) => void;
  placeholder?: string;
  className?: string;
};

function CodeEditor({
  code,
  onChange,
  onLanguageChange,
  placeholder,
  className,
}: CodeEditorProps) {
  const { selectedLanguage, isAutoDetected, setManualLanguage } =
    useLanguageDetection(code);

  useEffect(() => {
    onLanguageChange?.(selectedLanguage);
  }, [selectedLanguage, onLanguageChange]);

  const { highlightedHtml, isLoading } = useShikiHighlighter(
    code,
    selectedLanguage,
  );

  return (
    <CodeEditorRoot className={className}>
      <CodeEditorHeader
        selectedLanguage={selectedLanguage}
        isAutoDetected={isAutoDetected}
        onLanguageChange={setManualLanguage}
      />
      <CodeEditorBody
        code={code}
        highlightedHtml={highlightedHtml}
        isHighlighting={isLoading}
        onChange={onChange}
        placeholder={placeholder}
      />
      <CodeEditorFooter
        currentLength={code.length}
        maxLength={CODE_MAX_LENGTH}
      />
    </CodeEditorRoot>
  );
}

export {
  CODE_MAX_LENGTH,
  CodeEditor,
  CodeEditorRoot,
  CodeEditorHeader,
  CodeEditorBody,
  CodeEditorFooter,
  codeEditorRootVariants,
  codeEditorHeaderVariants,
  type CodeEditorRootProps,
  type CodeEditorHeaderProps,
  type CodeEditorBodyProps,
  type CodeEditorProps,
};
