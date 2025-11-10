import fs from 'node:fs';
import https from 'node:https';
import os from 'node:os';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';

import { Helper } from '../helper/index.js';
import type { Builder, Downloader as TDownloader } from '../types/index.d.ts';

export class Downloader implements TDownloader {
  public readonly msiUrls: string[];
  public readonly downloadFolderPath: string;

  public constructor(public readonly builder: Builder) {
    this.downloadFolderPath = Helper.getDownloadFolderPath();
    Helper.ensureDir(this.downloadFolderPath);
    this.msiUrls = [this.builder.installerServerUrl, this.builder.installerShellUrl];

    const bad = this.msiUrls.filter((u) => !u || !u.trim());
    if (bad.length) {
      throw new Error(`URLs inválidas: ${JSON.stringify(this.msiUrls)}`);
    }

    console.log(`Pasta de downloads: ${this.downloadFolderPath}`);
    this.msiUrls.forEach((u) => console.log(` - ${u}`));
  }

  public static async create(builder: Builder): Promise<Downloader> {
    const d = new Downloader(builder);
    await d.downloadFiles();
    console.log('Arquivos baixados com sucesso.');
    return d;
  }

  public async downloadFiles(): Promise<void> {
    const errors: Array<{ Url: string; Dest: string; Error: string }> = [];
    for (const u of this.msiUrls) {
      const file = path.join(this.downloadFolderPath, path.basename(u));
      try {
        if (fs.existsSync(file)) {
          console.log(`Já existe, pulando: ${file}`);
          continue;
        }
        await this.download(u, file);
        console.log(`OK -> ${file}`);
      } catch (e: any) {
        errors.push({ Url: u, Dest: file, Error: e?.message ?? String(e) });
        console.log(`ERRO -> ${u}: ${e?.message ?? e}`);
      }
    }
    if (errors.length) {
      const msg = errors.map((e) => `- ${e.Url} => ${e.Error}`).join(os.EOL);
      throw new Error(`Falha ao baixar um ou mais arquivos:\n${msg}`);
    }
  }

  public async download(url: string, dest: string): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      https
        .get(url, (res) => {
          if (
            res.statusCode &&
            res.statusCode >= 300 &&
            res.statusCode < 400 &&
            res.headers.location
          ) {
            // Segue redirect
            this.download(res.headers.location, dest).then(resolve).catch(reject);
            return;
          }
          if (res.statusCode !== 200) {
            reject(new Error(`HTTP ${res.statusCode} ao baixar ${url}`));
            return;
          }
          const ws = fs.createWriteStream(dest);
          pipeline(res, ws)
            .then(() => resolve())
            .catch(reject);
        })
        .on('error', reject);
    });
  }
}
