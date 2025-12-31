import { Settings } from "lucide-react";
import DockerComposeGenerator from "@/components/docker-compose-generator";
import Link from "next/link";

export const metadata = {
    title: "Docker Compose Generator",
    description:
        "Generate a customized docker-compose.yml configuration for your Riven deployment",
};

export default function GeneratorPage() {
    return (
        <main className="flex min-h-screen flex-col">
            {/* Header */}
            <section className="border-b border-fd-border bg-linear-to-b from-fd-background to-fd-muted/20 px-4 py-12">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-4">
                        <Link
                            href="/"
                            className="inline-flex items-center text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-fd-primary/10 p-3 text-fd-primary">
                            <Settings className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold md:text-4xl">
                                Docker Compose Generator
                            </h1>
                            <p className="mt-2 text-lg text-fd-muted-foreground">
                                Customize and generate your Riven deployment
                                configuration
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Generator */}
            <section className="flex-1 px-4 py-12">
                <div className="mx-auto max-w-7xl">
                    <DockerComposeGenerator />
                </div>
            </section>

            {/* Help Section */}
            <section className="border-t border-fd-border bg-fd-muted/20 px-4 py-12">
                <div className="mx-auto max-w-7xl">
                    <h2 className="mb-6 text-2xl font-bold">Next Steps</h2>
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="rounded-lg border border-fd-border bg-fd-background p-6">
                            <h3 className="mb-2 font-semibold">
                                1. Save Configuration
                            </h3>
                            <p className="text-sm text-fd-muted-foreground">
                                Download or copy the generated
                                docker-compose.yml file to your server
                            </p>
                        </div>
                        <div className="rounded-lg border border-fd-border bg-fd-background p-6">
                            <h3 className="mb-2 font-semibold">
                                2. Set Credentials
                            </h3>
                            <p className="text-sm text-fd-muted-foreground">
                                Replace placeholder values for API keys and
                                database passwords with secure credentials
                            </p>
                        </div>
                        <div className="rounded-lg border border-fd-border bg-fd-background p-6">
                            <h3 className="mb-2 font-semibold">3. Deploy</h3>
                            <p className="text-sm text-fd-muted-foreground">
                                Follow the{" "}
                                <Link
                                    href="/docs"
                                    className="text-fd-primary hover:underline"
                                >
                                    Getting Started Guide
                                </Link>{" "}
                                for complete deployment instructions
                            </p>    
                        </div>
                    </div>

                    <div className="mt-8 rounded-lg border border-fd-border bg-fd-background p-6">
                        <h3 className="mb-4 font-semibold">
                            Additional Resources
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href="/docs/deployment"
                                    className="text-fd-primary hover:underline"
                                >
                                    🚀 Deployment Guide
                                </Link>{" "}
                                - Production deployment with reverse proxies
                            </li>
                            <li>
                                <Link
                                    href="/docs/services/filesystem"
                                    className="text-fd-primary hover:underline"
                                >
                                    💾 Filesystem (VFS) Documentation
                                </Link>{" "}
                                - Understanding mount propagation and VFS
                                configuration
                            </li>
                            <li>
                                <Link
                                    href="/docs/troubleshooting"
                                    className="text-fd-primary hover:underline"
                                >
                                    🔧 Troubleshooting
                                </Link>{" "}
                                - Common issues and solutions
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </main>
    );
}
