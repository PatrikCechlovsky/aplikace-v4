// src/ui/breadcrumbs.js
import { MODULES } from '../app/modules.index.js'

export function renderBreadcrumbs(root, { mod, kind, id }){
  if (!root || !mod) { if (root) root.innerHTML = ''; return }
  const modLink = `#/m/${mod.id}/t/${mod.defaultTile || mod.tiles?.[0]?.id || ''}`

  let second = ''
  if (kind === 'tile') {
    const t = (mod.tiles||[]).find(x => x.id === id)
    second = t ? `<span class="opacity-60 mx-1">/</span><span>${t.icon||''} ${t.label}</span>` : ''
  } else if (kind === 'form') {
    const f = (mod.forms||[]).find(x => x.id === id)
    second = f ? `<span class="opacity-60 mx-1">/</span><span>${f.icon||''} ${f.label}</span>` : ''
  }

  root.innerHTML = `
    <a class="inline-flex items-center gap-1 px-2 py-1 rounded border bg-white text-sm" href="#/dashboard">🏠 Domů</a>
    <span class="opacity-60 mx-1">/</span>
    <a class="inline-flex items-center gap-1 px-2 py-1 rounded border bg-white text-sm" href="${modLink}">
      ${mod.icon||''} ${mod.title}
    </a>
    ${second}
  `
}
