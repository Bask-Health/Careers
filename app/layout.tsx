import "../global.css";
import { Inter } from "@next/font/google";
import LocalFont from "@next/font/local";
import { Metadata } from "next";
import { Analytics } from "./components/analytics";

export const metadata: Metadata = {
	title: {
		default: "Careers | Bask Health",
		template: "%s | Bask Health",
	},
	description: "Explore rewarding career opportunities at Bask Health! Join our dynamic team dedicated to revolutionizing healthcare through innovative solutions and compassionate service. Discover diverse roles that foster growth and make a real difference in people's lives.",
	openGraph: {
		title: "Careers | Bask Health",
		description:
		"Explore rewarding career opportunities at Bask Health! Join our dynamic team dedicated to revolutionizing healthcare through innovative solutions and compassionate service. Discover diverse roles that foster growth and make a real difference in people's lives.",
		url: "https://jobs.bask.health/",
		siteName: "Careers | Bask Health",
		images: [
			{
				url: "https://bask.health/seo/images/social_share_bask_platform.jpg",
				width: 1920,
				height: 1080,
			},
		],
		locale: "en-US",
		type: "website",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	twitter: {
		title: "Careers | Bask Health",
		card: "summary_large_image",
	},
	icons: {
		shortcut: "/favicon.png",
	},
};
const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});

const calSans = LocalFont({
	src: "../public/fonts/CalSans-SemiBold.ttf",
	variable: "--font-calsans",
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={[inter.variable, calSans.variable].join(" ")}>
			<body
				className={`bg-black ${
					process.env.NODE_ENV === "development" ? "debug-screens" : undefined
				}`}
			>
				<Analytics />
				{children}
			</body>
		</html>
	);
}
