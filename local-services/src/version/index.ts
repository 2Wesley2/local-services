/**
  Mapeamento BuildNumber -> Versão do Windows Server
  Fonte (Microsoft Learn): Windows Server release information
  https://learn.microsoft.com/en-us/windows/release-health/windows-server-release-info

  Versões do MongoDB (Community Edition) utilizadas nas constantes abaixo
  foram extraídas de:
  https://www.mongodb.com/try/download/community-edition/releases
  (consultado em: 17-09-2025)

  Builds-base por versão (LTSC):
    - Windows Server 2025 (24H2): 26100
    - Windows Server 2022 (21H2): 20348
    - Windows Server 2019 (1809): 17763
    - Windows Server 2016 (1607): 14393

  Regras abaixo usam FAIXAS NÃO-SOBREPOSTAS:
    >=26100 -> 2025
    >=20348 e <26100 -> 2022
    >=17763 e <20348 -> 2019
  >= 14393 e < 17763 -> 2016
  */

export class Versions {
  /**As versões abaixo foram extraídas de:
   https://www.mongodb.com/try/download/community-edition/releases
   (consultado em: 17-09-2025)
   */
  static Mongo8Stable = '8.0.13'; // Windows Server 2022/2025
  static Mongo7Stable = '7.0.24'; // Windows Server 2019
  static Mongo6Stable = '6.0.26'; // Windows Server 2016
  static MongoshLatest = '2.5.8'; // Shell do MongoDB (mongosh)
}

export class Builds {
  static WS2016 = 14393;
  static WS2019 = 17763;
  static WS2022 = 20348;
  static WS2025 = 26100;
}
