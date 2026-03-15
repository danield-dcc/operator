"use client";

import { useState } from "react";
import { CODE_MAX_LENGTH, CodeEditor } from "@/components/code-editor";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

export function HomepageHero() {
	const [code, setCode] = useState("");
	const isOverLimit = code.length > CODE_MAX_LENGTH;

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
				placeholder="// paste your code here..."
				className="max-w-195"
			/>

			{/* Actions Bar */}
			<div className="flex w-full max-w-195 items-center justify-between">
				<div className="flex items-center gap-4">
					<Toggle label="roast mode" defaultChecked />
					<span className="text-xs text-tertiary">
						{"// maximum sarcasm enabled"}
					</span>
				</div>

				<Button variant="primary" disabled={isOverLimit}>
					$ roast_my_code
				</Button>
			</div>
		</>
	);
}
