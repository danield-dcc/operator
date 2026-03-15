"use client";

import { useState } from "react";
import { CODE_MAX_LENGTH, CodeEditor } from "@/components/code-editor";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

export function HomeEditor() {
	const [code, setCode] = useState("");
	const isOverLimit = code.length > CODE_MAX_LENGTH;

	return (
		<>
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
