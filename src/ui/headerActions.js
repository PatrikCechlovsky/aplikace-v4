// src/ui/headerActions.js (přepiš)
import { actionBtn, bindActionHandlers } from './actions.js'

export function renderHeaderActions(root){
  root.innerHTML = `
    ${actionBtn('filter', { title:'Hledat/filtry' })}
    ${actionBtn('notify')}
    <a href="#/m/020-muj-ucet" class="px-2 py-1 border rounded text-sm bg-white">👤 Můj účet</a>
    ${actionBtn('help')}
  `
  bindActionHandlers(root, {
    filter: () => alert('Otevřít panel filtrů…'),
    notify: () => alert('Notifikace…'),
    help:   () => location.hash = '#/m/990-help'
  })
}
