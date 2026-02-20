import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "OpenNext Query String Bug",
	description: "Minimal reproduction for OpenNext query string encoding bug",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
