export default {
  id: '040-nemovitost',
  title: 'Nemovitosti',
  icon: '🏘️',
  defaultTile: 'prehled',
  tiles: [
    { id: 'prehled', label: 'Přehled', icon: '📊' },
    { id: 'seznam',  label: 'Seznam',  icon: '📋' },
  ],
  forms: [
    { id: 'novy', label: 'Nová nemovitost', icon: '➕' }
  ]
}
