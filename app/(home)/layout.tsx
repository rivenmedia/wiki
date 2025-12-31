import { HomeLayout } from "fumadocs-ui/layouts/home";
import { homeOptions } from "@/lib/layout.shared";

export const metadata = {
    title: "Riven",
    description:
        "The Ultimate Media Management Solution. Find, Organize, Stream, and Enjoy Your Media Effortlessly with Riven.",
    manifest: "/manifest.webmanifest",
    keywords: ["Riven", "Media", "Debrid", "Streaming"],
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_BASE_URL ?? "https://riven.tv",
    ),
    robots: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
    },
};

export default function Layout({ children }: LayoutProps<"/">) {
    return <HomeLayout {...homeOptions()}>{children}</HomeLayout>;
}
