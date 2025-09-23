// src/app/action-catalog.js
// Centrální katalog akcí s emoji ikonami (bez načítání SVG)

const make = (id, label, emoji) => ({
  id,
  label,
  icon: emoji,   // UI používá TOTO
  iconPath: null // zůstává jen pro kompatibilitu; UI ho nepoužívá
})

export const ACTIONS = {
  add:       make('add',       'Přidat',         '➕'),
  edit:      make('edit',      'Upravit',        '✏️'),
  detail:    make('detail',    'Detail',         '👁️'),
  archive:   make('archive',   'Archivovat',     '🗄️'),
  block:     make('block',     'Zablokovat',     '⛔'),
  resetPwd:  make('resetPwd',  'Resetovat heslo','🔁'),
  invite:    make('invite',    'Poslat pozvánku','📨'),
  docs:      make('docs',      'Dokumenty',      '📑'),
  perms:     make('perms',     'Oprávnění',      '✳️'),
  remove:    make('remove',    'Smazat',         '🗑️'),
  export:    make('export',    'Export',         '📤'),
  import:    make('import',    'Import',         '📥'),
  print:     make('print',     'Tisk',           '🖨️'),
  filter:    make('filter',    'Filtr',          '🔍'),
  stats:     make('stats',     'Statistiky',     '📊'),
  reminder:  make('reminder',  'Upomínka',       '📨'),
  notify:    make('notify',    'Notifikace',     '🔔'),
  sign:      make('sign',      'Podepsat',       '🖋️'),
  approve:   make('approve',   'Schválit',       '✔️'),
  reject:    make('reject',    'Zamítnout',      '❌'),
  note:      make('note',      'Poznámka',       '📝'),
  help:      make('help',      'Nápověda',       '🆘'),
}

export default ACTIONS
+export const getAction = (id) => ACTIONS[id]
