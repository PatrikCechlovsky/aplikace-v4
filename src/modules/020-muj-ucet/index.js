import config from './module.config.js'

export async function renderModule(root, route) {
  const kind = route?.kind || 'tile'
  const id = route?.id || config.defaultTile
  if (kind !== 'tile') {
    root.innerHTML = `<div class="card p-4 text-sm">Neznámá část modulu.</div>`
    return
  }
  const tile = config.tiles.find(t => t.id === id) || config.tiles[0]
  const mod = await tile.import()
  await mod.render(root, route?.params || new URLSearchParams())
}
export function getConfig(){ return config }
