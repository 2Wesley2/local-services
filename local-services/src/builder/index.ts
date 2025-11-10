import type { Builder as TBuilder } from '../types/index.d.ts';
import type { Verifier } from '../types/index.d.ts';
import { Versions } from '../version/index.js';

export class Builder implements TBuilder {
  public readonly installerServerBaseUrl: string =
    'https://fastdl.mongodb.org/windows/mongodb-windows-x86_64';
  public readonly installerServerUrl: string;
  public readonly installerShellUrl: string = `https://downloads.mongodb.com/compass/mongosh-${Versions.MongoshLatest}-x64.msi`;
  public constructor(public readonly verifier: Verifier) {
    this.installerServerUrl = `${this.installerServerBaseUrl}-${this.verifier.version}-signed.msi`;
  }
}
