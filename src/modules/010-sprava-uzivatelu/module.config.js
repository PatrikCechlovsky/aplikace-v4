export default {
  id: '010-sprava-uzivatelu',
  title: 'Správa uživatelů',
  icon: '👥',
  defaultTile: 'prehled',
  tiles: [
    { id: 'prehled', label: 'Přehled', icon: '📊' },
    { id: 'seznam',  label: 'Seznam',  icon: '📋' },
  ],
  forms: [
    { id: 'novy',    label: 'Nový uživatel', icon: '➕' }
  ]
}
