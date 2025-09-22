export default {
  id: '100-energie',
  title: 'Energie',
  icon: '⚡',
  defaultTile: 'prehled',
  tiles: [
    { id: 'prehled', label: 'Přehled', icon: '📊' },
    { id: 'seznam',  label: 'Měřidla', icon: '📋' },
  ],
  forms: [
    { id: 'odecty', label: 'Zadat odečet', icon: '➕' }
  ]
}
