// src/ui/sidebar.js
import { MODULES } from '../app/modules.index.js'
import { getState } from '../app/state.js'

export function renderSidebar(root){
  const cur = getState().current
  root.innerHTML = `
    <nav class="sidebar">
      ${MODULES.map(m => `
        <a href="#/m/${m.id}" class="${cur===m.id?'active':''}">
          ${m.iconPath
            ? `<img src="${m.iconPath}" alt="" class="icon-16" />`
            : `<span>${m.icon || '📦'}</span>`}
          <span>${m.title}</span>
        </a>`).join('')}
    </nav>
  `
}
