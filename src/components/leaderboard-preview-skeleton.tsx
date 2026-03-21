export function LeaderboardPreviewSkeleton() {
	return (
		<section className="flex w-full flex-col gap-6">
			<div className="flex items-center justify-between">
				<h2 className="flex items-center gap-2 text-sm font-bold">
					<span className="text-accent-green">{"//"}</span>
					shame_leaderboard
				</h2>

				<div className="h-8 w-28 animate-pulse rounded bg-elevated" />
			</div>

			<p className="text-[13px] text-tertiary">
				{"// the worst code on the internet, ranked by shame"}
			</p>

			<div className="overflow-hidden rounded border border-border">
				{/* Table Header */}
				<div className="flex h-10 items-center gap-6 border-b border-border bg-surface px-5 text-xs font-medium text-tertiary">
					<span className="w-10 shrink-0">#</span>
					<span className="w-15 shrink-0">score</span>
					<span className="min-w-0 flex-1">code</span>
					<span className="w-25 shrink-0 text-right">lang</span>
				</div>

				{/* Skeleton Rows */}
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className="flex h-12 items-center gap-6 border-b border-border px-5 last:border-b-0"
					>
						<div className="w-10 shrink-0">
							<div className="h-3 w-6 animate-pulse rounded bg-elevated" />
						</div>
						<div className="w-15 shrink-0">
							<div className="h-3 w-8 animate-pulse rounded bg-elevated" />
						</div>
						<div className="min-w-0 flex-1">
							<div className="h-3 w-full animate-pulse rounded bg-elevated" />
						</div>
						<div className="w-25 shrink-0 flex justify-end">
							<div className="h-3 w-16 animate-pulse rounded bg-elevated" />
						</div>
					</div>
				))}
			</div>

			<div className="py-2 flex justify-center">
				<div className="h-3 w-48 animate-pulse rounded bg-elevated" />
			</div>
		</section>
	);
}
