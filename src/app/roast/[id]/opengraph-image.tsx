import { ImageResponse } from "@takumi-rs/image-response";
import {
	buildRoastDescription,
	getRoastByShareIdOrThrow,
	getVerdictColor,
	getVerdictStatus,
	truncateRoastQuote,
} from "./roast-data";

export const alt = "Roast result from devroast";

export const size = {
	width: 1200,
	height: 630,
};

export const contentType = "image/png";

export const runtime = "nodejs";

type ImageProps = {
	params: Promise<{ id: string }>;
};

export default async function Image({ params }: ImageProps) {
	const { id } = await params;
	const roast = await getRoastByShareIdOrThrow(id);
	const verdictStatus = getVerdictStatus(roast.verdict);
	const verdictColor = getVerdictColor(verdictStatus);
	const quote = truncateRoastQuote(roast.roastQuote);
	const meta = `lang: ${roast.language} · ${roast.lineCount} lines`;
	const description = buildRoastDescription(
		roast.roastQuote,
		roast.score,
		roast.verdict,
	);

	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				backgroundColor: "#0A0A0A",
				border: "1px solid #2A2A2A",
				boxSizing: "border-box",
				alignItems: "stretch",
				justifyContent: "stretch",
				fontFamily: '"JetBrains Mono", monospace',
				color: "#FAFAFA",
			}}
		>
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					gap: 28,
					padding: 64,
					boxSizing: "border-box",
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: 8,
						fontSize: 20,
						fontWeight: 500,
					}}
				>
					<span style={{ color: "#10B981", fontSize: 24, fontWeight: 700 }}>
						{">"}
					</span>
					<span>devroast</span>
				</div>

				<div
					style={{
						display: "flex",
						alignItems: "flex-end",
						justifyContent: "center",
						gap: 4,
					}}
				>
					<span
						style={{
							color: "#F59E0B",
							fontSize: 160,
							fontWeight: 900,
							lineHeight: 1,
						}}
					>
						{roast.score.toFixed(1)}
					</span>
					<span
						style={{
							color: "#4B5563",
							fontSize: 56,
							fontWeight: 400,
							lineHeight: 1,
						}}
					>
						/10
					</span>
				</div>

				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: 8,
						color: verdictColor,
						fontSize: 20,
					}}
				>
					<div
						style={{
							width: 12,
							height: 12,
							borderRadius: 999,
							backgroundColor: verdictColor,
							flexShrink: 0,
						}}
					/>
					<span>{roast.verdict}</span>
				</div>

				<div
					style={{
						color: "#4B5563",
						fontSize: 16,
					}}
				>
					{meta}
				</div>

				<div
					style={{
						maxWidth: 760,
						textAlign: "center",
						fontSize: 22,
						lineHeight: 1.5,
						color: "#FAFAFA",
					}}
				>
					{`"${quote}"`}
				</div>

				<div
					style={{
						position: "absolute",
						bottom: 28,
						right: 32,
						fontSize: 12,
						color: "#4B5563",
					}}
				>
					{description}
				</div>
			</div>
		</div>,
		{
			...size,
			format: "png",
		},
	);
}
