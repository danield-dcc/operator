"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CODE_MAX_LENGTH, CodeEditor } from "@/components/code-editor";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { useTRPC } from "@/trpc/client";

export function HomepageHero() {
	const [code, setCode] = useState("");
	const [language, setLanguage] = useState("plaintext");
	const [roastMode, setRoastMode] = useState(true);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const router = useRouter();
	const trpc = useTRPC();

	const { mutate, isPending } = useMutation(
		trpc.roasts.createRoast.mutationOptions({
			onSuccess: ({ shareId }) => {
				setErrorMessage(null);
				router.push(`/roast/${shareId}`);
			},
			onError: (error) => {
				setErrorMessage(error.message || "failed to roast code. try again.");
			},
		}),
	);

	const isOverLimit = code.length > CODE_MAX_LENGTH;
	const isDisabled = isOverLimit || isPending || code.trim().length === 0;

	return (
		<>
			{/* Hero */}
			<section className="flex flex-col items-center gap-3">
				<h1 className="flex items-center gap-3 text-4xl font-bold">
					<span className="text-accent-green">$</span>
					paste your code. get roasted.
				</h1>

				<p className="text-sm text-secondary">
					{
						"// drop your code below and we'll rate it — brutally honest or full roast mode"
					}
				</p>
			</section>

			{/* Code Editor */}
			<CodeEditor
				code={code}
				onChange={setCode}
				onLanguageChange={setLanguage}
				placeholder="// paste your code here..."
				className="max-w-195"
			/>

			{/* Actions Bar */}
			<div className="flex w-full max-w-195 items-center justify-between">
				<div className="flex items-center gap-4">
					<Toggle
						label="roast mode"
						defaultChecked
						onCheckedChange={setRoastMode}
					/>
					<span className="text-xs text-tertiary">
						{"// maximum sarcasm enabled"}
					</span>
				</div>

				<Button
					variant="primary"
					disabled={isDisabled}
					onClick={() => {
						setErrorMessage(null);
						mutate({ code, language, roastMode });
					}}
				>
					{isPending ? "// roasting..." : "$ roast_my_code"}
				</Button>
			</div>

			{errorMessage && (
				<p className="w-full max-w-195 text-right text-xs text-accent-red">
					{errorMessage}
				</p>
			)}
		</>
	);
}
