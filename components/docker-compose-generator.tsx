'use client';

import { useState, useEffect } from 'react';
import { Copy, Download, Check } from 'lucide-react';
import { codeToHtml } from 'shiki';

type MediaServer = 'none' | 'plex' | 'jellyfin' | 'emby';

interface GeneratorConfig {
  timezone: string;
  puid: string;
  pgid: string;
  frontendPort: string;
  backendPort: string;
  originUrl: string;
  hostMountPath: string;
  mediaServer: MediaServer;
}

export default function DockerComposeGenerator() {
  const [config, setConfig] = useState<GeneratorConfig>({
    timezone: 'Europe/UTC',
    puid: '1000',
    pgid: '1000',
    frontendPort: '3000',
    backendPort: '8080',
    originUrl: 'http://localhost:3000',
    hostMountPath: '/mnt/riven',
    mediaServer: 'none',
  });

  const [copied, setCopied] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState<string>('');

  const updateConfig = (key: keyof GeneratorConfig, value: string | MediaServer) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const highlightCode = async () => {
      const code = generateDockerCompose();
      const html = await codeToHtml(code, {
        lang: 'yaml',
        theme: 'github-dark',
      });
      setHighlightedCode(html);
    };

    highlightCode();
  }, [config]);

  const generateDockerCompose = () => {
    const baseCompose = `services:
  riven-frontend:
    image: spoked/riven-frontend:latest
    container_name: riven-frontend
    restart: unless-stopped
    ports:
      - "${config.frontendPort}:3000"
    tty: true
    environment:
      - PUID=${config.puid}
      - PGID=${config.pgid}
      - TZ=${config.timezone}
      - ORIGIN=${config.originUrl} # Set to the frontend url. It&apos;s the url you will use to access the frontend. This is used by both auth & svelte csrf protection.
      - BACKEND_URL=http://riven:8080
      - BACKEND_API_KEY=CHANGE_ME_32_CHARACTER_API_KEY # IMPORTANT: Generate a secure 32-character API key
    depends_on:
      riven:
        condition: service_healthy
    volumes:
      - ./riven-frontend/data:/riven/data

  riven:
    image: spoked/riven:latest
    container_name: riven
    restart: unless-stopped
    ports:
      - "${config.backendPort}:8080"
    tty: true
    cap_add:
      - SYS_ADMIN
    security_opt:
      - apparmor:unconfined
    devices:
      - /dev/fuse
    environment:
      - PUID=${config.puid}
      - PGID=${config.pgid}
      - TZ=${config.timezone}
      - RIVEN_FORCE_ENV=true
      - RIVEN_DATABASE_HOST=postgresql+psycopg2://postgres:CHANGE_ME_DB_PASSWORD@riven-db/riven # IMPORTANT: Change the database password
      - RIVEN_FILESYSTEM_MOUNT_PATH=/mount
    healthcheck:
      test: curl -s http://localhost:8080 >/dev/null || exit 1
      interval: 30s
      timeout: 10s
      retries: 10
    volumes:
      - ./riven/data:/riven/data
      - ${config.hostMountPath}:/mount:rshared,z # Use your actual host mount path here
    depends_on:
      riven-db:
        condition: service_healthy

  riven-db:
    image: postgres:16.3-alpine3.20
    container_name: riven-db
    environment:
      PGDATA: /var/lib/postgresql/data/pgdata
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: CHANGE_ME_DB_PASSWORD # IMPORTANT: Use a secure password and match it in riven service above
      POSTGRES_DB: riven
    volumes:
      - ./riven-db:/var/lib/postgresql/data/pgdata
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5`;

    const mediaServerConfigs: Record<Exclude<MediaServer, 'none'>, string> = {
      plex: `
  plex:
    image: plexinc/pms-docker:latest
    container_name: plex
    restart: unless-stopped
    network_mode: host
    environment:
      - PUID=${config.puid}
      - PGID=${config.pgid}
      - TZ=${config.timezone}
      - VERSION=docker
    volumes:
      - ./plex/config:/config
      - ${config.hostMountPath}:/mount:rslave,z # Mount propagation must be rslave for Plex`,
      jellyfin: `
  jellyfin:
    image: jellyfin/jellyfin:latest
    container_name: jellyfin
    restart: unless-stopped
    ports:
      - "8096:8096"
    environment:
      - PUID=${config.puid}
      - PGID=${config.pgid}
      - TZ=${config.timezone}
    volumes:
      - ./jellyfin/config:/config
      - ./jellyfin/cache:/cache
      - ${config.hostMountPath}:/mount:rslave,z # Mount propagation must be rslave for Jellyfin`,
      emby: `
  emby:
    image: emby/embyserver:latest
    container_name: emby
    restart: unless-stopped
    ports:
      - "8096:8096"
    environment:
      - PUID=${config.puid}
      - PGID=${config.pgid}
      - TZ=${config.timezone}
    volumes:
      - ./emby/config:/config
      - ${config.hostMountPath}:/mount:rslave,z # Mount propagation must be rslave for Emby`,
    };

    let finalCompose = baseCompose;

    if (config.mediaServer !== 'none') {
      finalCompose += "\n" + mediaServerConfigs[config.mediaServer];
    }

    return finalCompose;
  };

  const handleCopy = async () => {
    const compose = generateDockerCompose();
    await navigator.clipboard.writeText(compose);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const compose = generateDockerCompose();
    const blob = new Blob([compose], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'docker-compose.yml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Configuration Form */}
      <div className="space-y-6">
        <div>
          <h3 className="mb-4 text-xl font-semibold">Configuration</h3>
          <div className="space-y-4">
            {/* Timezone */}
            <div>
              <label className="mb-2 block text-sm font-medium">Timezone</label>
              <input
                type="text"
                value={config.timezone}
                onChange={(e) => updateConfig('timezone', e.target.value)}
                placeholder="Europe/UTC"
                className="w-full rounded-lg border border-fd-border bg-fd-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fd-primary"
              />
              <p className="mt-1 text-xs text-fd-muted-foreground">
                e.g., America/New_York, Europe/London, Asia/Tokyo
              </p>
            </div>

            {/* PUID/PGID */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium">PUID</label>
                <input
                  type="number"
                  value={config.puid}
                  onChange={(e) => updateConfig('puid', e.target.value)}
                  className="w-full rounded-lg border border-fd-border bg-fd-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fd-primary"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">PGID</label>
                <input
                  type="number"
                  value={config.pgid}
                  onChange={(e) => updateConfig('pgid', e.target.value)}
                  className="w-full rounded-lg border border-fd-border bg-fd-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fd-primary"
                />
              </div>
            </div>
            <p className="text-xs text-fd-muted-foreground">
              Run <code className="rounded bg-fd-muted px-1 py-0.5">id</code> command to find your user/group IDs
            </p>

            {/* Ports */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Frontend Port</label>
                <input
                  type="number"
                  value={config.frontendPort}
                  onChange={(e) => updateConfig('frontendPort', e.target.value)}
                  className="w-full rounded-lg border border-fd-border bg-fd-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fd-primary"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Backend Port</label>
                <input
                  type="number"
                  value={config.backendPort}
                  onChange={(e) => updateConfig('backendPort', e.target.value)}
                  className="w-full rounded-lg border border-fd-border bg-fd-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fd-primary"
                />
              </div>
            </div>

            {/* Origin URL */}
            <div>
              <label className="mb-2 block text-sm font-medium">Origin URL</label>
              <input
                type="text"
                value={config.originUrl}
                onChange={(e) => updateConfig('originUrl', e.target.value)}
                placeholder="http://localhost:3000"
                className="w-full rounded-lg border border-fd-border bg-fd-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fd-primary"
              />
              <p className="mt-1 text-xs text-fd-muted-foreground">
                The URL where you&apos;ll access the frontend (remove if using reverse proxy)
              </p>
            </div>

            {/* Host Mount Path */}
            <div>
              <label className="mb-2 block text-sm font-medium">Host Mount Path</label>
              <input
                type="text"
                value={config.hostMountPath}
                onChange={(e) => updateConfig('hostMountPath', e.target.value)}
                placeholder="/mnt/riven"
                className="w-full rounded-lg border border-fd-border bg-fd-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fd-primary"
              />
              <p className="mt-1 text-xs text-fd-muted-foreground">
                Absolute path on your host system for the Riven mount
              </p>
            </div>

            {/* Media Server Selection */}
            <div>
              <label className="mb-3 block text-sm font-medium">Media Server (Optional)</label>
              <div className="space-y-2">
                {(['none', 'plex', 'jellyfin', 'emby'] as const).map((server) => (
                  <label key={server} className="flex cursor-pointer items-center gap-3 rounded-lg border border-fd-border bg-fd-background p-3 transition-colors hover:bg-fd-muted/50">
                    <input
                      type="radio"
                      name="mediaServer"
                      value={server}
                      checked={config.mediaServer === server}
                      onChange={(e) => updateConfig('mediaServer', e.target.value as MediaServer)}
                      className="h-4 w-4 text-fd-primary focus:ring-2 focus:ring-fd-primary"
                    />
                    <span className="capitalize">{server === 'none' ? 'None (I\'ll add it later)' : server}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
          <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
            ⚠️ Important: After generating, you must:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-fd-muted-foreground">
            <li>Set a secure 32-character API key for <code className="rounded bg-fd-muted px-1 py-0.5">BACKEND_API_KEY</code></li>
            <li>Set a secure database password for <code className="rounded bg-fd-muted px-1 py-0.5">POSTGRES_PASSWORD</code></li>
            <li>Configure mount propagation on your host (see docs)</li>
          </ul>
        </div>
      </div>

      {/* Preview & Actions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Preview</h3>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-4 py-2 text-sm font-medium transition-colors hover:bg-fd-muted/50"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
          </div>
        </div>

        <div
          className="max-h-[600px] [&_pre]:py-3 overflow-auto rounded-lg border border-fd-border text-xs [&_pre]:!m-0 [&_pre]:!bg-transparent"
          dangerouslySetInnerHTML={{ __html: highlightedCode || '<pre><code>Loading...</code></pre>' }}
        />
      </div>
    </div>
  );
}