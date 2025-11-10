import path from 'node:path';

import { Helper } from '../../helper';
import type { Installer, MongodConfig as TMongodConfig } from '../../types/index.d.ts';

export class MongodConfig implements TMongodConfig {
  protected static instanceCounter = 0;
  public readonly storage: Record<string, unknown>;
  public readonly net: Record<string, unknown>;
  public readonly replication: Record<string, unknown>;
  public readonly systemLog: Record<string, unknown>;

  public constructor(public readonly installer: Installer) {
    MongodConfig.instanceCounter++;
    const mm = this.installer.config.downloader.builder.verifier.majorMinorVersion;
    const base = path.join(Helper.getProgramFilesPath(), 'MongoDB', 'Server', mm);

    this.storage = {
      dbPath: path.join(base, `data${MongodConfig.instanceCounter}`),
      journal: { enabled: true },
    };
    this.net = { bindIp: '127.0.0.1', port: 27017 + MongodConfig.instanceCounter };
    this.replication = { replSetName: 'rs0' };
    this.systemLog = {
      destination: 'file',
      logAppend: true,
      path: path.join(base, 'log', `mongod-${MongodConfig.instanceCounter}.log`),
    };
  }
}
