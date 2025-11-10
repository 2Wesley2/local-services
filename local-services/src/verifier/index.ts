import { WinServerVersion } from '../enums/index.js';
import { Helper } from '../helper/index.js';
import type { Verifier as TVerifier } from '../types/index.d.ts';
import { Builds } from '../version/index.js';
import { Versions } from '../version/index.js';

export class Verifier implements TVerifier {
  public readonly name: WinServerVersion;
  public readonly version: string;
  public readonly majorMinorVersion: string;

  public constructor() {
    const resolved: { name: WinServerVersion; version: string } =
      this.resolveWindowsServerVersion();
    this.name = resolved.name;
    this.version = resolved.version;
    this.majorMinorVersion = Helper.getMajorMinor(this.version);
  }

  public resolveWindowsServerVersion(): { name: WinServerVersion; version: string } {
    const build = Helper.getOsBuildNumber();
    if (build >= Builds.WS2025)
      return { name: WinServerVersion.WindowsServer2025, version: Versions.Mongo8Stable };
    if (build >= Builds.WS2022)
      return { name: WinServerVersion.WindowsServer2022, version: Versions.Mongo8Stable };
    if (build >= Builds.WS2019)
      return { name: WinServerVersion.WindowsServer2019, version: Versions.Mongo7Stable };
    if (build >= Builds.WS2016)
      return { name: WinServerVersion.WindowsServer2016, version: Versions.Mongo6Stable };
    throw new Error('Versão do Windows Server não suportada');
  }
}
