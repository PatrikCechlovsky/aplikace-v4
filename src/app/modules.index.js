// src/app/modules.index.js
// Sem přidej 1 import pokaždé, když přibude modul
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

// Export ve správném pořadí pro sidebar
export const MODULES = [
  myAccount,
  pronajimatel,
  nemovitost,
  najemnik,
  smlouva,
  sluzby,
  platby,
  finance,
  energie,
  udrzba,
  dokumenty,
  komunikace,
  nastaveni,
  help,
  userMgmt, // klidně přesuň, kam chceš
]
