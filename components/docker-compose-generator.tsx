"use client";

import { useState, useEffect, useCallback } from "react";
import { Copy, Download, Check } from "lucide-react";
import { codeToHtml } from "shiki";
import { stringify } from "yaml";
import { Files, Folder, File } from "@/components/files";

type MediaServer = "none" | "plex" | "jellyfin" | "emby";

interface GeneratorConfig {
    timezone: string;
    puid: string;
    pgid: string;
    frontendPort: string;
    backendPort: string;
    originUrl: string;
    hostMountPath: string;
    mediaServer: MediaServer;
    // Secrets
    backendApiKey: string;
    authSecret: string;
    dbPassword: string;
}

interface DockerService {
    image: string;
    container_name: string;
    restart?: string;
    shm_size?: string;
    ports?: string[];
    expose?: number[];
    tty?: boolean;
    network_mode?: string;
    cap_add?: string[];
    security_opt?: string[];
    devices?: string[];
    environment?: string[] | Record<string, string>;
    depends_on?: Record<string, { condition: string }>;
    volumes?: string[];
    healthcheck?: {
        test: string | string[];
        interval: string;
        timeout: string;
        retries: number;
    };
}

interface DockerCompose {
    volumes: Record<string, null>;
    services: Record<string, DockerService>;
}

// Service builders
const createFrontendService = (cfg: GeneratorConfig): DockerService => ({
    image: "spoked/riven-frontend:dev",
    container_name: "riven-frontend",
    restart: "unless-stopped",
    ports: [`${cfg.frontendPort}:3000`],
    environment: [
        `TZ=${cfg.timezone}`,
        "DATABASE_URL=/riven/data/riven.db",
        "BACKEND_URL=http://riven:8080",
        `BACKEND_API_KEY=${
            cfg.backendApiKey || "CHANGE_ME_32_CHARACTER_API_KEY"
        }`,
        `AUTH_SECRET=${cfg.authSecret || "CHANGE_ME_AUTH_SECRET"}`,
        `ORIGIN=${cfg.originUrl}`,
    ],
    depends_on: {
        riven: { condition: "service_healthy" },
    },
    volumes: ["riven-frontend-data:/riven/data"],
});

const createBackendService = (cfg: GeneratorConfig): DockerService => ({
    image: "spoked/riven:dev",
    container_name: "riven",
    restart: "unless-stopped",
    shm_size: "1024m",
    ports: [`${cfg.backendPort}:8080`],
    tty: true,
    cap_add: ["SYS_ADMIN"],
    security_opt: ["apparmor:unconfined"],
    devices: ["/dev/fuse"],
    environment: [
        `PUID=${cfg.puid}`,
        `PGID=${cfg.pgid}`,
        `TZ=${cfg.timezone}`,
        "RIVEN_FORCE_ENV=true",
        `RIVEN_API_KEY=${cfg.backendApiKey || "CHANGE_ME_32_CHARACTER_API_KEY"}`,
        `RIVEN_DATABASE_HOST=postgresql+psycopg2://postgres:${
            cfg.dbPassword || "CHANGE_ME_DB_PASSWORD"
        }@riven-db:5432/riven`,
        "RIVEN_FILESYSTEM_MOUNT_PATH=/mount",
        `RIVEN_UPDATERS_LIBRARY_PATH=${cfg.hostMountPath}`,
    ],
    healthcheck: {
        test: "curl -s http://localhost:8080 >/dev/null || exit 1",
        interval: "30s",
        timeout: "10s",
        retries: 10,
    },
    volumes: ["./data:/riven/data", `${cfg.hostMountPath}:/mount:rshared,z`],
    depends_on: {
        "riven-db": { condition: "service_healthy" },
    },
});

const createDatabaseService = (cfg: GeneratorConfig): DockerService => ({
    image: "postgres:17-alpine",
    container_name: "riven-db",
    environment: {
        PGDATA: "/var/lib/postgresql/data/pgdata",
        POSTGRES_USER: "postgres",
        POSTGRES_PASSWORD: cfg.dbPassword || "CHANGE_ME_DB_PASSWORD",
        POSTGRES_DB: "riven",
    },
    volumes: ["riven-pg-data:/var/lib/postgresql/data/pgdata"],
    healthcheck: {
        test: ["CMD-SHELL", "pg_isready -U postgres"],
        interval: "10s",
        timeout: "5s",
        retries: 5,
    },
});

const createPlexService = (cfg: GeneratorConfig): DockerService => ({
    image: "plexinc/pms-docker:latest",
    container_name: "plex",
    restart: "unless-stopped",
    network_mode: "host",
    environment: [
        `PUID=${cfg.puid}`,
        `PGID=${cfg.pgid}`,
        `TZ=${cfg.timezone}`,
        "VERSION=docker",
    ],
    volumes: ["plex-config:/config", `${cfg.hostMountPath}:/mount:rslave,z`],
});

const createJellyfinService = (cfg: GeneratorConfig): DockerService => ({
    image: "jellyfin/jellyfin:latest",
    container_name: "jellyfin",
    restart: "unless-stopped",
    ports: ["8096:8096"],
    environment: [`PUID=${cfg.puid}`, `PGID=${cfg.pgid}`, `TZ=${cfg.timezone}`],
    volumes: [
        "jellyfin-config:/config",
        "jellyfin-cache:/cache",
        `${cfg.hostMountPath}:/mount:rslave,z`,
    ],
});

const createEmbyService = (cfg: GeneratorConfig): DockerService => ({
    image: "emby/embyserver:latest",
    container_name: "emby",
    restart: "unless-stopped",
    ports: ["8096:8096"],
    environment: [`PUID=${cfg.puid}`, `PGID=${cfg.pgid}`, `TZ=${cfg.timezone}`],
    volumes: ["emby-config:/config", `${cfg.hostMountPath}:/mount:rslave,z`],
});

const mediaServerBuilders: Record<
    Exclude<MediaServer, "none">,
    (cfg: GeneratorConfig) => DockerService
> = {
    plex: createPlexService,
    jellyfin: createJellyfinService,
    emby: createEmbyService,
};

// Crypto-safe random string generator
const generateSecret = (
    length: number,
    format: "hex" | "base64" = "hex"
): string => {
    const bytes = format === "base64" ? length : Math.ceil(length / 2);
    const array = new Uint8Array(bytes);
    crypto.getRandomValues(array);
    if (format === "base64") {
        return btoa(String.fromCharCode(...array));
    }
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0"))
        .join("")
        .slice(0, length);
};

export default function DockerComposeGenerator() {
    const [config, setConfig] = useState<GeneratorConfig>({
        timezone: "Asia/Kolkata",
        puid: "1000",
        pgid: "1000",
        frontendPort: "3000",
        backendPort: "8080",
        originUrl: "http://localhost:3000",
        hostMountPath: "/mnt/riven",
        mediaServer: "none",
        backendApiKey: "",
        authSecret: "",
        dbPassword: "",
    });

    const [copied, setCopied] = useState(false);
    const [copiedService, setCopiedService] = useState(false);
    const [highlightedCode, setHighlightedCode] = useState<string>("");
    const [highlightedService, setHighlightedService] = useState<string>("");
    const [activeTab, setActiveTab] = useState<"compose" | "service">(
        "service"
    );

    const updateConfig = (
        key: keyof GeneratorConfig,
        value: string | MediaServer
    ) => {
        setConfig((prev) => ({ ...prev, [key]: value }));
    };

    const generateSecrets = () => {
        setConfig((prev) => ({
            ...prev,
            backendApiKey: generateSecret(32),
            authSecret: generateSecret(32, "base64"),
            dbPassword: generateSecret(24),
        }));
    };

    const generateDockerCompose = useCallback(() => {
        const compose: DockerCompose = {
            volumes: {
                "riven-frontend-data": null,
                "riven-pg-data": null,
            },
            services: {
                "riven-frontend": createFrontendService(config),
                riven: createBackendService(config),
                "riven-db": createDatabaseService(config),
            },
        };

        if (config.mediaServer !== "none") {
            const builder = mediaServerBuilders[config.mediaServer];
            compose.services[config.mediaServer] = builder(config);

            // Add media server volumes
            if (config.mediaServer === "plex") {
                compose.volumes["plex-config"] = null;
            } else if (config.mediaServer === "jellyfin") {
                compose.volumes["jellyfin-config"] = null;
                compose.volumes["jellyfin-cache"] = null;
            } else if (config.mediaServer === "emby") {
                compose.volumes["emby-config"] = null;
            }
        }

        return stringify(compose, { lineWidth: 0, nullStr: "" });
    }, [config]);

    const generateSystemdService = useCallback(() => {
        const mountPath = config.hostMountPath;
        return `
            [Unit]
            Description=Make Riven data bind mount shared
            After=local-fs.target
            Before=docker.service

            [Service]
            Type=oneshot
            ExecStart=/usr/bin/mount --bind ${mountPath} ${mountPath}
            ExecStart=/usr/bin/mount --make-rshared ${mountPath}
            RemainAfterExit=yes

            [Install]
            WantedBy=multi-user.target`
            .trim()
            .replace(/^[ \t]+/gm, "");
    }, [config.hostMountPath]);

    useEffect(() => {
        const highlightCode = async () => {
            const [composeHtml, serviceHtml] = await Promise.all([
                codeToHtml(generateDockerCompose(), {
                    lang: "yaml",
                    theme: "github-dark",
                }),
                codeToHtml(generateSystemdService(), {
                    lang: "ini",
                    theme: "github-dark",
                }),
            ]);
            setHighlightedCode(composeHtml);
            setHighlightedService(serviceHtml);
        };
        highlightCode();
    }, [generateDockerCompose, generateSystemdService]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(generateDockerCompose());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCopyService = async () => {
        await navigator.clipboard.writeText(generateSystemdService());
        setCopiedService(true);
        setTimeout(() => setCopiedService(false), 2000);
    };

    const handleDownload = () => {
        const compose = generateDockerCompose();
        const blob = new Blob([compose], { type: "text/yaml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "docker-compose.yml";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleDownloadService = () => {
        const service = generateSystemdService();
        const blob = new Blob([service], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "riven-mount.service";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
            {/* Configuration Form */}
            <div className="space-y-6">
                <div>
                    <h3 className="mb-4 text-xl font-semibold">
                        Configuration
                    </h3>
                    {/* Warning */}
                    <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4 mb-4">
                        <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                            ⚠️ Important: This generator creates config files
                            for upcoming version of Riven (v1.0)
                        </p>
                    </div>
                    <div className="space-y-4">
                        {/* Timezone */}
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Timezone
                            </label>
                            <input
                                type="text"
                                value={config.timezone}
                                onChange={(e) =>
                                    updateConfig("timezone", e.target.value)
                                }
                                placeholder="Europe/UTC"
                                className="w-full rounded-lg border border-fd-border bg-fd-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fd-primary"
                            />
                            <p className="mt-1 text-xs text-fd-muted-foreground">
                                e.g., America/New_York, Europe/Zurich,
                                Asia/Tokyo
                            </p>
                        </div>

                        {/* PUID/PGID */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    PUID
                                </label>
                                <input
                                    type="number"
                                    value={config.puid}
                                    onChange={(e) =>
                                        updateConfig("puid", e.target.value)
                                    }
                                    className="w-full rounded-lg border border-fd-border bg-fd-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fd-primary"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    PGID
                                </label>
                                <input
                                    type="number"
                                    value={config.pgid}
                                    onChange={(e) =>
                                        updateConfig("pgid", e.target.value)
                                    }
                                    className="w-full rounded-lg border border-fd-border bg-fd-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fd-primary"
                                />
                            </div>
                        </div>
                        <p className="text-xs text-fd-muted-foreground">
                            Run{" "}
                            <code className="rounded bg-fd-muted px-1 py-0.5">
                                id
                            </code>{" "}
                            command to find your user/group IDs
                        </p>

                        {/* Ports */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Frontend Port
                                </label>
                                <input
                                    type="number"
                                    value={config.frontendPort}
                                    onChange={(e) =>
                                        updateConfig(
                                            "frontendPort",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border border-fd-border bg-fd-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fd-primary"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Backend Port
                                </label>
                                <input
                                    type="number"
                                    value={config.backendPort}
                                    onChange={(e) =>
                                        updateConfig(
                                            "backendPort",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border border-fd-border bg-fd-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fd-primary"
                                />
                            </div>
                        </div>

                        {/* Origin URL */}
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Origin URL
                            </label>
                            <input
                                type="text"
                                value={config.originUrl}
                                onChange={(e) =>
                                    updateConfig("originUrl", e.target.value)
                                }
                                placeholder="http://localhost:3000"
                                className="w-full rounded-lg border border-fd-border bg-fd-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fd-primary"
                            />
                            <p className="mt-1 text-xs text-fd-muted-foreground">
                                The URL where you&apos;ll access the frontend
                                (remove if using reverse proxy)
                            </p>
                        </div>

                        {/* Host Mount Path */}
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Host Mount Path
                            </label>
                            <input
                                type="text"
                                value={config.hostMountPath}
                                onChange={(e) =>
                                    updateConfig(
                                        "hostMountPath",
                                        e.target.value
                                    )
                                }
                                placeholder="/mnt/riven"
                                className="w-full rounded-lg border border-fd-border bg-fd-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fd-primary"
                            />
                            <p className="mt-1 text-xs text-fd-muted-foreground">
                                Absolute path on your host system for the Riven
                                mount
                            </p>
                        </div>

                        {/* Media Server Selection */}
                        <div>
                            <label className="mb-3 block text-sm font-medium">
                                Media Server (Optional)
                            </label>
                            <div className="space-y-2">
                                {(
                                    [
                                        "none",
                                        "plex",
                                        "jellyfin",
                                        "emby",
                                    ] as const
                                ).map((server) => (
                                    <label
                                        key={server}
                                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-fd-border bg-fd-background p-3 transition-colors hover:bg-fd-muted/50"
                                    >
                                        <input
                                            type="radio"
                                            name="mediaServer"
                                            value={server}
                                            checked={
                                                config.mediaServer === server
                                            }
                                            onChange={(e) =>
                                                updateConfig(
                                                    "mediaServer",
                                                    e.target
                                                        .value as MediaServer
                                                )
                                            }
                                            className="h-4 w-4 text-fd-primary focus:ring-2 focus:ring-fd-primary"
                                        />
                                        <span className="capitalize">
                                            {server === "none"
                                                ? "None (I'll add it later)"
                                                : server}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Secrets Generation */}
                        <div className="rounded-lg border border-fd-border bg-fd-muted/30 p-4">
                            <div className="flex items-center justify-between mb-3">
                                <label className="block text-sm font-medium">
                                    Secrets (Auto-generated)
                                </label>
                                <button
                                    type="button"
                                    onClick={generateSecrets}
                                    className="inline-flex items-center gap-1.5 rounded-md bg-fd-primary px-3 py-1.5 text-xs font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
                                >
                                    Generate Secrets
                                </button>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <label className="mb-1 block text-xs text-fd-muted-foreground">
                                        Backend API Key (32 chars)
                                    </label>
                                    <input
                                        type="text"
                                        value={config.backendApiKey}
                                        onChange={(e) =>
                                            updateConfig(
                                                "backendApiKey",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Click 'Generate Secrets' or enter manually"
                                        className="w-full rounded-md border border-fd-border bg-fd-background px-3 py-1.5 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-fd-primary"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs text-fd-muted-foreground">
                                        Auth Secret (Base64)
                                    </label>
                                    <input
                                        type="text"
                                        value={config.authSecret}
                                        onChange={(e) =>
                                            updateConfig(
                                                "authSecret",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Click 'Generate Secrets' or enter manually"
                                        className="w-full rounded-md border border-fd-border bg-fd-background px-3 py-1.5 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-fd-primary"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs text-fd-muted-foreground">
                                        Database Password
                                    </label>
                                    <input
                                        type="text"
                                        value={config.dbPassword}
                                        onChange={(e) =>
                                            updateConfig(
                                                "dbPassword",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Click 'Generate Secrets' or enter manually"
                                        className="w-full rounded-md border border-fd-border bg-fd-background px-3 py-1.5 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-fd-primary"
                                    />
                                </div>
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
                        <li>
                            Set a secure 32-character API key for{" "}
                            <code className="rounded bg-fd-muted px-1 py-0.5">
                                BACKEND_API_KEY
                            </code>
                        </li>
                        <li>
                            Generate a random{" "}
                            <code className="rounded bg-fd-muted px-1 py-0.5">
                                AUTH_SECRET
                            </code>{" "}
                            using{" "}
                            <code className="rounded bg-fd-muted px-1 py-0.5">
                                openssl rand -base64 32
                            </code>
                        </li>
                        <li>
                            Set a secure database password for{" "}
                            <code className="rounded bg-fd-muted px-1 py-0.5">
                                POSTGRES_PASSWORD
                            </code>
                        </li>
                        <li>
                            Configure mount propagation on your host (see docs)
                        </li>
                    </ul>
                </div>
            </div>

            {/* Preview & Actions */}
            <div className="flex flex-col h-full min-h-0">
                {/* Tabs */}
                <div className="flex gap-1 border-b border-fd-border">
                    <button
                        onClick={() => setActiveTab("service")}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                            activeTab === "service"
                                ? "border-b-2 border-fd-primary text-fd-primary"
                                : "text-fd-muted-foreground hover:text-fd-foreground"
                        }`}
                    >
                        1. riven-mount.service
                    </button>
                    <button
                        onClick={() => setActiveTab("compose")}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                            activeTab === "compose"
                                ? "border-b-2 border-fd-primary text-fd-primary"
                                : "text-fd-muted-foreground hover:text-fd-foreground"
                        }`}
                    >
                        2. docker-compose.yml
                    </button>
                </div>

                {/* Docker Compose Tab */}
                {activeTab === "compose" && (
                    <div className="flex flex-col flex-1 min-h-0 gap-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">
                                Docker Compose
                            </h3>
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
                        <div className="space-y-2">
                            <p className="text-sm font-medium">Expected docker-compose.yml structure:</p>
                            <Files>
                                <File name="docker-compose.yml" />
                                <Folder name="data" defaultOpen>
                                    <File name="settings.json" />
                                </Folder>
                            </Files>
                            <p className="text-sm font-medium mt-3">Host mount path:</p>
                            <Files>
                                <Folder name={config.hostMountPath} defaultOpen />
                            </Files>
                        </div>
                        <div
                            className="flex-1 min-h-0 [&_pre]:py-3 [&_pre]:h-full overflow-auto rounded-lg border border-fd-border text-xs [&_pre]:m-0! [&_pre]:bg-transparent!"
                            dangerouslySetInnerHTML={{
                                __html:
                                    highlightedCode ||
                                    "<pre><code>Loading...</code></pre>",
                            }}
                        />
                    </div>
                )}

                {/* Systemd Service Tab */}
                {activeTab === "service" && (
                    <div className="flex flex-col flex-1 min-h-0 gap-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">
                                Systemd Service
                            </h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCopyService}
                                    className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-4 py-2 text-sm font-medium transition-colors hover:bg-fd-muted/50"
                                >
                                    {copiedService ? (
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
                                    onClick={handleDownloadService}
                                    className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
                                >
                                    <Download className="h-4 w-4" />
                                    Download
                                </button>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="rounded-lg border border-fd-border bg-fd-muted/30 p-4 text-sm space-y-3">
                            <p className="font-medium">
                                📋 Installation Instructions:
                            </p>
                            <ol className="list-decimal list-inside space-y-2 text-fd-muted-foreground">
                                <li>
                                    Create the mount directory:
                                    <code className="ml-2 rounded bg-fd-muted px-2 py-0.5 text-xs">
                                        sudo mkdir -p {config.hostMountPath}
                                    </code>
                                </li>
                                <li>
                                    Save the service file:
                                    <code className="ml-2 rounded bg-fd-muted px-2 py-0.5 text-xs">
                                        sudo nano
                                        /etc/systemd/system/riven-mount.service
                                    </code>
                                </li>
                                <li>
                                    Reload systemd:
                                    <code className="ml-2 rounded bg-fd-muted px-2 py-0.5 text-xs">
                                        sudo systemctl daemon-reload
                                    </code>
                                </li>
                                <li>
                                    Enable and start the service:
                                    <code className="ml-2 rounded bg-fd-muted px-2 py-0.5 text-xs">
                                        sudo systemctl enable --now
                                        riven-mount.service
                                    </code>
                                </li>
                                <li>
                                    Verify it&apos;s running:
                                    <code className="ml-2 rounded bg-fd-muted px-2 py-0.5 text-xs">
                                        sudo systemctl status
                                        riven-mount.service
                                    </code>
                                </li>
                            </ol>
                        </div>

                        <div
                            className="flex-1 min-h-0 [&_pre]:py-3 [&_pre]:h-full overflow-auto rounded-lg border border-fd-border text-xs [&_pre]:m-0! [&_pre]:bg-transparent!"
                            dangerouslySetInnerHTML={{
                                __html:
                                    highlightedService ||
                                    "<pre><code>Loading...</code></pre>",
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

