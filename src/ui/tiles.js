// src/ui/tiles.js
export function renderTiles(root, { mod, activeTileId }){
  if (!root || !mod) return
  const chips = (mod.tiles||[]).map(t => `
    <a class="px-2 py-1 rounded border text-sm ${t.id===activeTileId?'bg-[rgba(37,99,235,.14)] font-medium':''}"
       href="#/m/${mod.id}/t/${t.id}">
       ${t.icon||''} ${t.label}
    </a>
  `).join('')

  // vložíme chipy; main action tlačítka přidá mainActionBtn.js (append)
  root.innerHTML = `<div class="flex flex-wrap gap-2">${chips}</div>`
}
