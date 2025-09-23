// src/ui/sidebar.js
import { MODULES } from '../app/modules.index.js' // máš už hotové
// otevřený modul si držíme v paměti, ale hlavní je stejně hash
const OPEN_KEY = 'ui:openModule'

function activeFromHash(){
  const h = (location.hash || '').replace(/^#\/?/, '').split('/')
  if (h[0] !== 'm') return { mod:null, kind:null, id:null }
  return { mod: h[1] || null, kind: h[2] || null, id: h[3] || null }
}

function isOpen(modId, activeMod){
  // otevři aktivní modul nebo to, co si pamatujeme z minula
  const remembered = localStorage.getItem(OPEN_KEY)
  return (modId === activeMod) || (remembered === modId)
}

export function renderSidebar(root){
  if (!root) return
  const { mod:activeMod } = activeFromHash()

  root.innerHTML = `
    <nav class="sidebar flex flex-col gap-1">
      ${MODULES.map(m => {
        const open = isOpen(m.id, activeMod)
        const tiles = (m.tiles || [])
        const hrefModule = `#/m/${m.id}/t/${m.defaultTile || tiles[0]?.id || ''}`
        return `
          <div class="group">
            <a class="sidebar-link flex items-center gap-2 ${m.id===activeMod?'active':''}"
               href="${hrefModule}" data-mod="${m.id}">
              <span class="w-4 inline-flex justify-center
                           ${open ? 'rotate-90' : ''} transition-transform">▶</span>
              <span class="sidebar-icon">${m.icon || '📦'}</span>
              <span>${m.title}</span>
            </a>
            <div class="pl-6 mt-1 ${open ? '' : 'hidden'}" data-sub="${m.id}">
              ${tiles.map(t => `
                <a class="sidebar-sublink flex items-center gap-2 py-1 px-2 rounded text-sm
                          ${m.id===activeMod && location.hash.includes(`/t/${t.id}`) ? 'bg-[rgba(37,99,235,.14)] font-medium' : ''}"
                   href="#/m/${m.id}/t/${t.id}">
                  <span class="w-4 inline-block"></span>
                  <span>${t.icon || ''}</span>
                  <span>${t.label}</span>
                </a>
              `).join('')}
            </div>
          </div>
        `
      }).join('')}
    </nav>
  `

  // klik na modul jen přepíná otevření/zavření (navigace se stejně stane přes href)
  root.querySelectorAll('[data-mod]').forEach
