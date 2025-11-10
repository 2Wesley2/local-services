import fs from 'node:fs';
import path from 'node:path';

import { scalarOptions, stringify } from 'yaml';

import { Helper } from '../../helper/index.js';
import type { MongodConfig, MongoReplicaSet as TMongoReplicaSet } from '../../types/index.d.ts';

export class MongoReplicaSet implements TMongoReplicaSet {
  public readonly binPath: string;

  public constructor(public readonly config: MongodConfig[]) {
    const mm = this.config[0].installer.config.downloader.builder.verifier.majorMinorVersion;
    this.binPath = path.join(Helper.getProgramFilesPath(), 'MongoDB', 'Server', mm);
  }

  public saveCfg(): void {
    Helper.ensureDir(this.binPath);

    scalarOptions.str.fold.lineWidth = 120;

    let i = 0;
    for (const c of this.config) {
      i++;
      const cfgFile = path.join(this.binPath, `mongod-${i}.cfg`);

      const yamlObj = {
        storage: c.storage,
        net: c.net,
        replication: c.replication,
        systemLog: c.systemLog,
      };

      const cleanObj = JSON.parse(JSON.stringify(yamlObj));
      const yamlContent = stringify(cleanObj);

      const storageDbPathUnknown = c.storage?.dbPath;
      const dbPath =
        typeof storageDbPathUnknown === 'string' && storageDbPathUnknown.length > 0
          ? storageDbPathUnknown
          : path.join(this.binPath, 'data');

      const systemLogPathUnknown = c.systemLog?.path;
      const logPath =
        typeof systemLogPathUnknown === 'string' && systemLogPathUnknown.length > 0
          ? systemLogPathUnknown
          : path.join(this.binPath, 'log', 'mongod.log');

      try {
        Helper.ensureDir(path.dirname(dbPath));
      } catch {}

      try {
        Helper.ensureDir(path.dirname(logPath));
      } catch {}

      fs.writeFileSync(cfgFile, yamlContent, { encoding: 'utf8' });
      console.log(`Arquivo de configuração salvo: ${cfgFile}`);
    }
  }
}
