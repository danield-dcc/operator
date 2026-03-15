import type { Metadata } from "next";
import Link from "next/link";
import { NavbarBrand, NavbarNav, NavbarRoot } from "@/components/navbar";
import { TRPCReactProvider } from "@/trpc/client";
import "./globals.css";

export const metadata: Metadata = {
	title: "devroast",
	description: "Paste your code. Get roasted.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR">
			<body className="min-h-screen bg-page font-mono text-primary">
				<NavbarRoot>
					<NavbarBrand>
						<Link href="/" className="flex items-center gap-2">
							<span className="text-xl font-bold text-accent-green">{">"}</span>
							<span className="text-lg font-medium text-primary">devroast</span>
						</Link>
					</NavbarBrand>
					<NavbarNav>
						<Link
							href="/leaderboard"
							className="text-[13px] text-secondary transition-colors hover:text-primary"
						>
							leaderboard
						</Link>
					</NavbarNav>
				</NavbarRoot>
				<TRPCReactProvider>{children}</TRPCReactProvider>
			</body>
		</html>
	);
}
