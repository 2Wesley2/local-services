import { Downloader } from '../../downloader/index.js';
import { MsiPublicProperty } from '../../enums/index.js';
import type { MsiConfig as TMsiConfig } from '../../types/index.d.ts';

export class MsiConfig implements TMsiConfig {
  public readonly installationProps: Record<string, string>;
  public constructor(public downloader: Downloader) {
    this.installationProps = this.setInstallationProps();
  }

  public setInstallationProps(): Record<string, string> {
    const props: Record<string, string> = {
      // [MsiPublicProperty.INSTALLLOCATION]: `C:\\MongoDB\\Server\\${majorMinor}\\`,
      [MsiPublicProperty.SHOULD_INSTALL_COMPASS]: '0', // Não instalar o Compass
    };

    const mm = this.downloader.builder.verifier.majorMinorVersion;
    switch (mm) {
      case '8.0':
        props[MsiPublicProperty.ADDLOCAL] = 'ServerService,MiscellaneousTools';
        break;
      case '7.0':
      case '6.0':
        props[MsiPublicProperty.ADDLOCAL] = 'ServerService,MiscellaneousTools,Router';
        break;
      default:
        props[MsiPublicProperty.ADDLOCAL] = 'ServerService';
        break;
    }
    return props;
  }
}
