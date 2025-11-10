import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import type { MsiConfig, Installer as TInstaller } from '../types/index.d.ts';

export class Installer implements TInstaller {
  public constructor(public readonly config: MsiConfig) {}

  public buildMsiArgs(msiPath: string, props?: Record<string, string>): string[] {
    const temp = process.env['TEMP'] || os.tmpdir();
    const logName = `mongodb_${new Date().toISOString().replace(/[-:T]/g, '').slice(0, 15)}_${path.basename(msiPath, '.msi')}.log`;
    const log = path.join(temp, logName);
    const base = ['/i', msiPath, '/qn', '/norestart', '/l*v', log];

    const kv: string[] = [];
    if (props && Object.keys(props).length) {
      for (const [k, v] of Object.entries(props)) kv.push(`${k}="${v}"`);
    }

    console.log(`Log do MSI: ${log}`);
    return [...base, ...kv];
  }

  public localPathFromUrl(url?: string): string | null {
    if (!url) return null;
    const leaf = path.basename(url);
    return path.join(this.config.downloader.downloadFolderPath, leaf);
  }

  public installOne(msiPath: string | null, props: Record<string, string>, label: string) {
    if (!msiPath || !fs.existsSync(msiPath)) {
      throw new Error(`MSI não encontrado para ${label}: ${msiPath}`);
    }
    const args = this.buildMsiArgs(msiPath, props);
    const p = spawnSync('msiexec.exe', args, { stdio: 'inherit' });
    const code = p.status ?? p.signal ?? -1;
    if (code === 0 || code === 3010) {
      console.log(`${label} instalado (ExitCode=${code}).`);
    } else {
      throw new Error(`Falha na instalação de ${label}. ExitCode=${code}`);
    }
  }

  public installAll() {
    const serverMsi = this.localPathFromUrl(this.config.downloader.builder.installerServerUrl);
    this.installOne(serverMsi, this.config.installationProps, 'MongoDB Server');

    const mongoshMsi = this.localPathFromUrl(this.config.downloader.builder.installerShellUrl);
    this.installOne(mongoshMsi, {}, 'mongosh');
  }
}
