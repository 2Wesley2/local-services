import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export class Helper {
  /** Tenta obter o BuildNumber do Windows (CIM -> REG -> WMIC). */
  static getOsBuildNumber(): number {
    // 1) PowerShell CIM
    try {
      console.log('Tentando obter BuildNumber via PowerShell CIM...');
      const out = execFileSync(
        'powershell.exe',
        [
          '-NoProfile',
          '-Command',
          '([string](Get-CimInstance -ClassName Win32_OperatingSystem).BuildNumber)',
        ],
        { encoding: 'utf8' },
      );
      const val = out.trim();
      const num = parseInt(val, 10);
      if (!Number.isNaN(num)) {
        console.log(`Build via CIM: ${num}`);
        return num;
      }
    } catch (_) {
      console.log('CIM falhou, tentando via Registro...');
    }

    // 2) REG QUERY
    try {
      const out = execFileSync(
        'reg.exe',
        ['QUERY', 'HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion', '/v', 'CurrentBuild'],
        { encoding: 'utf8' },
      );
      const m = out.match(/CurrentBuild\s+REG_\w+\s+(\d+)/i);
      if (m) {
        const num = parseInt(m[1], 10);
        console.log(`Build via REG: ${num}`);
        return num;
      }
    } catch (_) {
      console.log('Registro falhou, tentando via WMIC...');
    }

    // 3) WMIC (pode não existir em builds mais novos)
    try {
      const out = execFileSync('wmic', ['os', 'get', 'BuildNumber', '/value'], {
        encoding: 'utf8',
      });
      const m = out.match(/BuildNumber=(\d+)/i);
      if (m) {
        const num = parseInt(m[1], 10);
        console.log(`Build via WMIC: ${num}`);
        return num;
      }
    } catch (_) {
      // ignore
    }

    throw new Error('Falha ao obter o número de build do Windows.');
  }

  /** Extrai major.minor (ex.: "8.0" de "8.0.13"). */
  static getMajorMinor(version: string): string {
    const m = /^(\d+\.\d+)\..*/.exec(version);
    return m ? m[1] : version;
  }

  /** Caminho da pasta Downloads do usuário, com fallback. */
  static getDownloadFolderPath(): string {
    // Tentativa simples e confiável em Windows
    const home = os.homedir();
    const candidate = path.join(home, 'Downloads');
    try {
      if (!fs.existsSync(candidate)) fs.mkdirSync(candidate, { recursive: true });
      return candidate;
    } catch {
      return home; // fallback
    }
  }

  /** Caminho do Program Files (x64). */
  static getProgramFilesPath(): string {
    const pf = process.env['ProgramFiles'] || 'C:\\Program Files';
    try {
      if (!fs.existsSync(pf)) fs.mkdirSync(pf, { recursive: true });
    } catch {
      // Se falhar, apenas retorna o caminho (provável falta de permissão)
    }
    return pf;
  }

  static ensureDir(dir: string) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }
}
