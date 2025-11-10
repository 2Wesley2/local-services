type WinServerVersion =
  | 'WindowsServer2016'
  | 'WindowsServer2019'
  | 'WindowsServer2022'
  | 'WindowsServer2025';

export abstract class Verifier {
  public constructor();
  public readonly name: WinServerVersion;
  public readonly version: string;
  public readonly majorMinorVersion: string;
  public resolveWindowsServerVersion(): { name: WinServerVersion; version: string };
}

export abstract class Builder {
  public constructor(verifier: Verifier);
  public readonly verifier: Verifier;
  public readonly installerServerBaseUrl: string;
  public readonly installerServerUrl: string;
  public readonly installerShellUrl: string;
}

export abstract class Downloader {
  public constructor(builder: Builder);
  public readonly builder: Builder;
  public readonly msiUrls: string[];
  public readonly downloadFolderPath: string;
  public static create(builder: Builder): Promise<Downloader>;
  public downloadFiles(): Promise<void>;
  public download(url: string, dest: string): Promise<void>;
}

export abstract class MsiConfig {
  public constructor(downloader: Downloader);
  public readonly downloader: Downloader;
  public readonly installationProps: Record<string, string>;
  public setInstallationProps(): Record<string, string>;
}

export abstract class Installer {
  public constructor(config: MsiConfig);
  public readonly config: MsiConfig;
  public buildMsiArgs(msiPath: string, props?: Record<string, string>): string[];
  public localPathFromUrl(url?: string): string | null;
  public installOne(msiPath: string | null, props: Record<string, string>, label: string): void;
  public installAll(): void;
}

export abstract class MongodConfig {
  public constructor(installer: Installer);
  public readonly installer: Installer;
  protected static instanceCount: number;
  public readonly storage: Record<string, unknown>;
  public readonly net: Record<string, unknown>;
  public readonly replication: Record<string, unknown>;
  public readonly systemLog: Record<string, unknown>;
}

export abstract class MongoReplicaSet {
  public constructor(config: MongodConfig[]);
  public readonly config: MongodConfig[];
  public readonly binPath: string;
  public saveCfg(): void;
}
