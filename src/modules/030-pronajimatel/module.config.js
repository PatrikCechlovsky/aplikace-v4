export default {
  id: '030-pronajimatel',
  title: 'Pronajímatel',
  icon: '🏠',
  defaultTile: 'list',
  tiles: [
    { id: 'list',   label: 'Seznam', icon: '📋', import: () => import('./tiles/list.js') },
  ],
  forms: [
    { id: 'create', label: 'Nový',   icon: '➕', import: () => import('./forms/create.js') },
  ]
}
