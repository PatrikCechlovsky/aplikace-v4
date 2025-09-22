// src/ui/mainActionBtn.js (přepiš)
import { getState } from '../app/state.js'
import { MODULES } from '../app/modules.index.js'
import { actionBtn, bindActionHandlers } from './actions.js'

export function renderMainAction(root){
  const cur = getState().current
  const mod = MODULES.find(m => m.id === cur)
  if (!mod || !mod.forms?.length) { root.innerHTML = ''; return }
  const firstForm = mod.forms[0]
  root.innerHTML = actionBtn('add', { title: `Přidat – ${mod.title}` })
  bindActionHandlers(root, {
    add: () => location.hash = `#/m/${mod.id}/f/${firstForm.id}`
  })
}
