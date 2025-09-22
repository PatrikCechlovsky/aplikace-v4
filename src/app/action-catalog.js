// src/app/action-catalog.js
// Ikony: preferujeme SVG z docs/icons/actions/<id>.svg, jinak emoji fallback.
const F = (id, label, emoji) => ({
  id, label,
  iconPath: `./docs/icons/actions/${id}.svg`,
  emoji
});

export const ACTIONS = [
  F('add',        'Přidat',               '➕'),
  F('edit',       'Upravit',              '✏️'),
  F('detail',     'Detail',               '👁️'),
  F('archive',    'Archivovat',           '🗄️'),
  F('block',      'Zablokovat',           '⛔'),
  F('reset-pass', 'Reset hesla',          '🔁'),
  F('invite',     'Poslat pozvánku',      '📨'),
  F('audit',      'Historie aktivit',     '🧑‍💻'),
  F('attachments','Dokumenty',            '📑'),
  F('perms',      'Oprávnění',            '✳️'),
  F('delete',     'Smazat',               '🗑️'),
  F('export',     'Export',               '📤'),
  F('import',     'Import',               '📥'),
  F('print',      'Tisk',                 '🖨️'),
  F('filter',     'Filtry',               '🔍'),
  F('stats',      'Statistiky',           '📊'),
  F('remind',     'Upomínka',             '📨'),
  F('notify',     'Notifikace',           '🔔'),
  F('sign',       'Podepsat',             '🖋️'),
  F('approve',    'Schválit',             '✔️'),
  F('reject',     'Zamítnout',            '❌'),
  F('note',       'Poznámka',             '📝'),
  F('help',       'Nápověda',             '🆘'),
  F('lang',       'Jazyk',                '🌐'),
  F('reset',      'Reset nastavení',      '🔄'),
  F('info',       'Info',                 'ℹ️'),
  F('comment',    'Komentář',             '💬'),
];

export function getAction(id){ return ACTIONS.find(a => a.id === id); }
