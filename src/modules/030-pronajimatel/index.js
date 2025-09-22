import config from './module.config.js'

export async function renderModule(root, route) {
  const kind = route?.kind || 'tile'
  const id = route?.id || (kind==='tile' ? config.defaultTile : config.forms[0]?.id)
  if (kind === 'tile') {
    const tile = config.tiles.find(t => t.id === id) || config.tiles[0]
    const mod = await tile.import()
    await mod.render(root, route?.params || new URLSearchParams())
  } else if (kind === 'form') {
    const form = config.forms.find(f => f.id === id) || config.forms[0]
    const mod = await form.import()
    await mod.render(root, route?.params || new URLSearchParams())
  } else {
    root.innerHTML = `<div class="card p-4 text-sm">Neznámá část modulu.</div>`
  }
}
export function getConfig(){ return config }
