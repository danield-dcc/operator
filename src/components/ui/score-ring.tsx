import { twMerge } from "tailwind-merge";

type ScoreRingProps = {
	score: number;
	max?: number;
	size?: number;
	strokeWidth?: number;
	className?: string;
};

function ScoreRing({
	score,
	max = 10,
	size = 180,
	strokeWidth = 4,
	className,
}: ScoreRingProps) {
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const percentage = Math.min(score / max, 1);
	const strokeDashoffset = circumference * (1 - percentage);

	return (
		<div
			className={twMerge(
				"relative inline-flex items-center justify-center",
				className,
			)}
			style={{ width: size, height: size }}
		>
			<svg
				width={size}
				height={size}
				viewBox={`0 0 ${size} ${size}`}
				className="-rotate-90"
			>
				<defs>
					<linearGradient
						id={`score-gradient-${score}`}
						x1="0%"
						y1="0%"
						x2="100%"
						y2="0%"
					>
						<stop offset="0%" stopColor="#10B981" />
						<stop offset="100%" stopColor="#F59E0B" />
					</linearGradient>
				</defs>

				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					stroke="#2A2A2A"
					strokeWidth={strokeWidth}
				/>

				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					stroke={`url(#score-gradient-${score})`}
					strokeWidth={strokeWidth}
					strokeDasharray={circumference}
					strokeDashoffset={strokeDashoffset}
					strokeLinecap="round"
				/>
			</svg>

			<div className="absolute flex items-end gap-0.5">
				<span className="font-mono text-5xl font-bold text-primary leading-none">
					{score}
				</span>
				<span className="font-mono text-base text-tertiary leading-none mb-1">
					/{max}
				</span>
			</div>
		</div>
	);
}

export { ScoreRing, type ScoreRingProps };
