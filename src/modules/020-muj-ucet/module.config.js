export default {
  id: '020-muj-ucet',
  title: 'Můj účet',
  icon: '👤',
  defaultTile: 'profile',
  tiles: [
    { id: 'profile', label: 'Profil', icon: '📇', import: () => import('./tiles/profile.js') },
  ],
  forms: []
}
