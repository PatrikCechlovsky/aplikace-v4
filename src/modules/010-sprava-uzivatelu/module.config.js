export default {
  id: '010-sprava-uzivatelu',
  title: 'Správa uživatelů',
  icon: '👥',
  defaultTile: 'prehled',         // klik na modul → tahle dlaždice
  tiles: [
    { id: 'prehled', label: 'Přehled', icon: '📊' },
    { id: 'seznam',  label: 'Seznam',  icon: '📋' },
  ],
  forms: [
    { id: 'novy',    label: 'Pozvat',  icon: '➕' },
    { id: 'edit',    label: 'Upravit', icon: '✏️' }
  ]
}
