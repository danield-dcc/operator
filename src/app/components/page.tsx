import {
	AnalysisCardBody,
	AnalysisCardDescription,
	AnalysisCardFooter,
	AnalysisCardRoot,
	AnalysisCardTitle,
} from "@/components/ui/analysis-card";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";
import { StatusBadge } from "@/components/ui/status-badge";
import {
	TableRowCode,
	TableRowLanguage,
	TableRowRank,
	TableRowRoot,
	TableRowScore,
} from "@/components/ui/table-row";
import { Toggle } from "@/components/ui/toggle";

const codeExample = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`;

export default function ComponentsPage() {
	return (
		<div className="min-h-screen bg-page p-10 font-mono text-primary">
			<h1 className="mb-10 text-2xl font-bold">
				<span className="text-accent-green">{"// "}</span>
				component_library
			</h1>

			<div className="flex flex-col gap-16 max-w-3xl">
				{/* Button */}
				<section>
					<h2 className="mb-2 text-sm font-bold">
						<span className="text-accent-green">{"// "}</span>
						buttons
					</h2>
					<div className="mt-6 space-y-6">
						<div>
							<h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-tertiary">
								Variants
							</h3>
							<div className="flex items-center gap-4">
								<Button variant="primary">$ roast_my_code</Button>
								<Button variant="secondary">$ share_roast</Button>
								<Button variant="ghost">{"$ view_all >>"}</Button>
							</div>
						</div>
						<div>
							<h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-tertiary">
								Sizes
							</h3>
							<div className="flex items-center gap-4">
								<Button variant="primary" size="sm">
									Small
								</Button>
								<Button variant="primary" size="md">
									Medium
								</Button>
								<Button variant="primary" size="lg">
									Large
								</Button>
							</div>
						</div>
						<div>
							<h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-tertiary">
								Disabled
							</h3>
							<div className="flex items-center gap-4">
								<Button variant="primary" disabled>
									Disabled
								</Button>
								<Button variant="secondary" disabled>
									Disabled
								</Button>
								<Button variant="ghost" disabled>
									Disabled
								</Button>
							</div>
						</div>
					</div>
				</section>

				{/* Toggle */}
				<section>
					<h2 className="mb-2 text-sm font-bold">
						<span className="text-accent-green">{"// "}</span>
						toggle
					</h2>
					<div className="mt-6 flex items-center gap-8">
						<Toggle label="roast mode" defaultChecked />
						<Toggle label="roast mode" />
					</div>
				</section>

				{/* StatusBadge */}
				<section>
					<h2 className="mb-2 text-sm font-bold">
						<span className="text-accent-green">{"// "}</span>
						badge_status
					</h2>
					<div className="mt-6 flex items-center gap-6">
						<StatusBadge status="critical">critical</StatusBadge>
						<StatusBadge status="warning">warning</StatusBadge>
						<StatusBadge status="good">good</StatusBadge>
						<StatusBadge status="critical">needs_serious_help</StatusBadge>
					</div>
				</section>

				{/* CodeBlock */}
				<section>
					<h2 className="mb-2 text-sm font-bold">
						<span className="text-accent-green">{"// "}</span>
						code_block
					</h2>
					<div className="mt-6">
						<CodeBlock
							code={codeExample}
							lang="javascript"
							filename="calculate.js"
						/>
					</div>
				</section>

				{/* DiffLine */}
				<section>
					<h2 className="mb-2 text-sm font-bold">
						<span className="text-accent-green">{"// "}</span>
						diff_line
					</h2>
					<div className="mt-6 overflow-hidden rounded border border-border">
						<DiffLine type="removed">var total = 0;</DiffLine>
						<DiffLine type="added">const total = 0;</DiffLine>
						<DiffLine type="context">
							{"for (let i = 0; i < items.length; i++) {"}
						</DiffLine>
					</div>
				</section>

				{/* ScoreRing */}
				<section>
					<h2 className="mb-2 text-sm font-bold">
						<span className="text-accent-green">{"// "}</span>
						score_ring
					</h2>
					<div className="mt-6 flex items-center gap-10">
						<ScoreRing score={2.1} />
						<ScoreRing score={5.5} />
						<ScoreRing score={8.7} />
					</div>
				</section>
				{/* AnalysisCard */}
				<section>
					<h2 className="mb-2 text-sm font-bold">
						<span className="text-accent-green">{"// "}</span>
						analysis_card
					</h2>
					<div className="mt-6">
						<AnalysisCardRoot>
							<AnalysisCardTitle>Performance Summary</AnalysisCardTitle>
							<AnalysisCardDescription>
								{"// quick read on your latest roast"}
							</AnalysisCardDescription>
							<AnalysisCardBody>
								Too many mutable variables and a couple of nested loops.
								Consider refactoring for clarity.
							</AnalysisCardBody>
							<AnalysisCardFooter>avg score: 4.2/10</AnalysisCardFooter>
						</AnalysisCardRoot>
					</div>
				</section>
				{/* TableRow */}
				<section>
					<h2 className="mb-2 text-sm font-bold">
						<span className="text-accent-green">{"// "}</span>
						table_row
					</h2>
					<div className="mt-6 overflow-hidden rounded border border-border">
						<TableRowRoot>
							<TableRowRank>#1</TableRowRank>
							<TableRowScore tone="good">8.7</TableRowScore>
							<TableRowCode>
								const total = items.reduce((sum, item) =&gt; sum + item.price,
								0);
							</TableRowCode>
							<TableRowLanguage>typescript</TableRowLanguage>
						</TableRowRoot>
						<TableRowRoot>
							<TableRowRank>#2</TableRowRank>
							<TableRowScore tone="warning">5.5</TableRowScore>
							<TableRowCode>
								let result = fetchData().then(data =&gt; transform(data));
							</TableRowCode>
							<TableRowLanguage>javascript</TableRowLanguage>
						</TableRowRoot>
						<TableRowRoot>
							<TableRowRank>#3</TableRowRank>
							<TableRowScore tone="critical">2.1</TableRowScore>
							<TableRowCode>
								{"function calculateTotal(items) "}
								{"{"}
								{" var total = 0; ..."}
							</TableRowCode>
							<TableRowLanguage>javascript</TableRowLanguage>
						</TableRowRoot>
					</div>
				</section>
			</div>
		</div>
	);
}
