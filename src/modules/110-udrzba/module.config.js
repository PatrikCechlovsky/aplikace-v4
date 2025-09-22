export default {
  id: '110-udrzba',
  title: 'Údržba',
  icon: '🔧',
  defaultTile: 'prehled',
  tiles: [
    { id: 'prehled', label: 'Přehled', icon: '📊' },
    { id: 'seznam',  label: 'Požadavky', icon: '📋' },
  ],
  forms: [
    { id: 'nahlasit', label: 'Nahlásit závadu', icon: '➕' }
  ]
}
