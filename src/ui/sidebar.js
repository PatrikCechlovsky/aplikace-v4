import { MODULES } from '../app/modules.js';
import { getState } from '../app/state.js';

export function renderSidebar(root){
  const cur = getState().current;
  root.innerHTML = `
    <nav class="sidebar">
      ${MODULES.map(m => `
        <a href="${m.route}" data-id="${m.id}" class="${cur===m.id?'active':''}">
          <span>${m.icon}</span><span>${m.title}</span>
        </a>`).join('')}
    </nav>
  `;
}
