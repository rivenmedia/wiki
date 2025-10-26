import Link from 'next/link';
import { ArrowRight, Zap, Shield, Puzzle, Cog, Bell, BarChart3, GitBranch, Download } from 'lucide-react';
import { StarCounter } from '@/components/star-counter';

async function getGitHubStars() {
  try {
    const res = await fetch('https://api.github.com/repos/rivenmedia/riven', {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.stargazers_count as number;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const stars = await getGitHubStars();
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-fd-border bg-gradient-to-b from-fd-background to-fd-muted/20 px-4 py-20 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-muted/50 px-4 py-2 text-sm">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-fd-muted-foreground">
                vfs-based media management
              </span>
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              The Ultimate
              <br />
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Media Management
              </span>
              <br />
              Solution
            </h1>

            <p className="mb-8 max-w-2xl text-lg text-fd-muted-foreground md:text-xl">
              Riven is a comprehensive media management system that uses a virtual file system to organize your content.
              Built with efficiency and automation in mind, it seamlessly integrates with your favorite tools.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-6 py-3 font-semibold text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="https://github.com/rivenmedia/riven"
                className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-6 py-3 font-semibold transition-colors hover:bg-fd-muted/50"
              >
                <Download className="h-4 w-4" />
                View on GitHub
              </Link>
              {stars && <StarCounter targetCount={stars} />}
            </div>

            <div className="mt-8 flex items-center gap-6 text-sm text-fd-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Open Source</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span>Self-Hosted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                <span>Docker Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-b border-fd-border px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Powerful Features
            </h2>
            <p className="text-lg text-fd-muted-foreground">
              Everything you need for automated media management
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="VFS-Based"
              description="Efficient organization using a virtual file system, keeping your media library clean and accessible."
            />
            <FeatureCard
              icon={<Puzzle className="h-6 w-6" />}
              title="Extensive Integration"
              description="Works with Plex, Jellyfin, Emby, Real-Debrid, and many more services out of the box."
            />
            <FeatureCard
              icon={<Cog className="h-6 w-6" />}
              title="Smart Automation"
              description="Automated content discovery, downloading, and organization with intelligent scraping and matching."
            />
            <FeatureCard
              icon={<Bell className="h-6 w-6" />}
              title="Real-Time Notifications"
              description="Stay updated with Discord, Apprise, and webhook notifications for all your media events."
            />
            <FeatureCard
              icon={<BarChart3 className="h-6 w-6" />}
              title="Rich Dashboard"
              description="Beautiful web interface with analytics, monitoring, and complete control over your media library."
            />
            <FeatureCard
              icon={<GitBranch className="h-6 w-6" />}
              title="Advanced Scraping"
              description="Multiple scraper support with configurable quality preferences based on RTN."
            />
          </div>
        </div>
      </section>

      {/* Integration Showcase */}
      <section className="border-b border-fd-border px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Seamless Integration
            </h2>
            <p className="text-lg text-fd-muted-foreground">
              Connect with your favorite services
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-5">
            <IntegrationBadge name="Plex" />
            <IntegrationBadge name="Jellyfin" />
            <IntegrationBadge name="Emby" />
            <IntegrationBadge name="Real-Debrid" />
            <IntegrationBadge name="All-Debrid" />
            <IntegrationBadge name="Torrentio" />
            <IntegrationBadge name="Jackett" />
            <IntegrationBadge name="Prowlarr" />
            <IntegrationBadge name="Overseerr" />
            <IntegrationBadge name="Discord" />
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-fd-border bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-8 md:p-12">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              <div>
                <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                  Ready to get started?
                </h2>
                <p className="mb-6 text-lg text-fd-muted-foreground">
                  Deploy Riven in minutes with Docker or follow our comprehensive installation guide.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link
                    href="/docs"
                    className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-6 py-3 font-semibold text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
                  >
                    Read Documentation
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="https://github.com/rivenmedia/riven"
                    className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-6 py-3 font-semibold transition-colors hover:bg-fd-muted/50"
                  >
                    View Source
                  </Link>
                </div>
              </div>

              <div className="rounded-lg border border-fd-border bg-fd-background/50 p-6">
                <h3 className="mb-4 font-semibold">Quick Install</h3>
                <pre className="overflow-x-auto rounded-lg bg-fd-muted/50 p-4 text-sm">
                  <code className="text-fd-muted-foreground">
{`docker run -d \\
  --name riven \\
  -p 8080:8080 \\
  -v ./data:/riven/data \\
  ghcr.io/rivenmedia/riven:latest`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-fd-border px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 text-center md:grid-cols-3">
            <div>
              <div className="mb-2 text-3xl font-bold">20+</div>
              <div className="text-sm text-fd-muted-foreground">Service Integrations</div>
            </div>
            <div>
              <div className="mb-2 text-3xl font-bold">100%</div>
              <div className="text-sm text-fd-muted-foreground">Open Source</div>
            </div>
            <div>
              <div className="mb-2 text-3xl font-bold">24/7</div>
              <div className="text-sm text-fd-muted-foreground">Automated Management</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-lg border border-fd-border bg-fd-card p-6 transition-colors hover:bg-fd-muted/50">
      <div className="mb-4 inline-flex rounded-lg bg-fd-primary/10 p-3 text-fd-primary">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-fd-muted-foreground">{description}</p>
    </div>
  );
}

function IntegrationBadge({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center rounded-lg border border-fd-border bg-fd-card px-4 py-3 text-sm font-medium transition-colors hover:bg-fd-muted/50">
      {name}
    </div>
  );
}
