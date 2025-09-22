// src/ui/sidebar.js
import { MODULES } from '../app/modules.index.js'

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
          <span class="sidebar-icon">
            <img
              src="/docs/icons/${m.id}.svg"
              alt=""
              width="18" height="18"
              style="display:inline-block; vertical-align:middle"
              onerror="this.replaceWith(document.createTextNode('${(m.icon || '').replace(/'/g,'&#39;')}'))"
            />
          </span>
          <span>${m.title}</span>
        </a>
      `).join('')}
    </nav>
  `
}
