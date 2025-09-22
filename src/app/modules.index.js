// src/app/modules.index.js
// Každý modul má ID = název složky. Ikonku bereme z ./docs/icons/<ID>.svg.
// Když SVG nenajdeme, použijeme emoji fallback.

import userMgmt     from '../modules/010-sprava-uzivatelu/module.config.js'
import myAccount    from '../modules/020-muj-ucet/module.config.js'
import pronajimatel from '../modules/030-pronajimatel/module.config.js'
import nemovitost   from '../modules/040-nemovitost/module.config.js'
import najemnik     from '../modules/050-najemnik/module.config.js'
import smlouva      from '../modules/060-smlouva/module.config.js'
import sluzby       from '../modules/070-sluzby/module.config.js'
import platby       from '../modules/080-platby/module.config.js'
import finance      from '../modules/090-finance/module.config.js'
import energie      from '../modules/100-energie/module.config.js'
import udrzba       from '../modules/110-udrzba/module.config.js'
import dokumenty    from '../modules/120-dokumenty/module.config.js'
import komunikace   from '../modules/130-komunikace/module.config.js'
import nastaveni    from '../modules/900-nastaveni/module.config.js'
import help         from '../modules/990-help/module.config.js'

// emoji fallbacky (když pro modul chybí SVG v docs/icons)
const EMOJI = {
  '010-sprava-uzivatelu': '👥',
  '020-muj-ucet':         '👤',
  '030-pronajimatel':     '🏠',
  '040-nemovitost':       '🏢',
  '050-najemnik':         '🧑‍🦱',
  '060-smlouva':          '📄',
  '070-sluzby':           '🛠️',
  '080-platby':           '💰',
  '090-finance':          '💸',
  '100-energie':          '⚡',
  '110-udrzba':           '🔧',
  '120-dokumenty':        '📁',
  '130-komunikace':       '📧',
  '900-nastaveni':        '⚙️',
  '990-help':             '🆘',
};

// Pomůcka – doplní iconPath a emoji fallback.
function withIcon(cfg) {
  const id = cfg.id;
  // očekáváme SVG v ./docs/icons/<ID>.svg (např. docs/icons/030-pronajimatel.svg)
  const iconPath = `./docs/icons/${id}.svg`;
  return { ...cfg, iconPath, icon: EMOJI[id] || '📦' };
}

export const MODULES = [
  withIcon(userMgmt),
  withIcon(myAccount),
  withIcon(pronajimatel),
  withIcon(nemovitost),
  withIcon(najemnik),
  withIcon(smlouva),
  withIcon(sluzby),
  withIcon(platby),
  withIcon(finance),
  withIcon(energie),
  withIcon(udrzba),
  withIcon(dokumenty),
  withIcon(komunikace),
  withIcon(nastaveni),
  withIcon(help),
];
