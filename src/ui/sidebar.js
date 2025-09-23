// src/ui/sidebar.js
console.log('sidebar.emoji.js LOADED', import.meta.url);
window.__SIDEBAR_VER__ = 'emoji-v1';
import { MODULES } from '../app/modules.index.js'

// Pomocný log, abychom viděli, že se načetla NOVÁ verze souboru:
console.log('sidebar.js v10 loaded')

function activeModFromHash() {
  const h = (location.hash || '').slice(1).split('/')
  return h[0] === 'm' ? h[1] : null
}

export function renderSidebar(el) {
  if (!el) return
  const current = activeModFromHash()

  el.innerHTML = `
    <nav class="sidebar flex flex-col gap-1">
      ${MODULES.map(m => `
        <a class="sidebar-link ${current === m.id ? 'active' : ''}" href="#/m/${m.id}">
          <span class="sidebar-icon">${m.icon || '📦'}</span>
          <span>${m.title}</span>
        </a>
      `).join('')}
    </nav>
  `
}
