export const enum WinServerVersion {
  WindowsServer2016 = 'WindowsServer2016',
  WindowsServer2019 = 'WindowsServer2019',
  WindowsServer2022 = 'WindowsServer2022',
  WindowsServer2025 = 'WindowsServer2025',
}

/**
 * Propriedades públicas do MSI (ver docs oficiais do MongoDB para msiexec)
 */
export const enum MsiPublicProperty {
  INSTALLLOCATION = 'INSTALLLOCATION',
  SHOULD_INSTALL_COMPASS = 'SHOULD_INSTALL_COMPASS',
  ADDLOCAL = 'ADDLOCAL',
}
