// src/ui/mainActionBtn.js
import { MODULES } from '../app/modules.index.js'
import { getState } from '../app/state.js'

export function renderMainAction(root){
  const cur = getState().current
  const mod = MODULES.find(m => m.id === cur)
  if (!mod || !mod.forms?.length) { root.innerHTML = ''; return }
  const firstForm = mod.forms[0]
  root.innerHTML = `
    <a href="#/m/${mod.id}/f/${firstForm.id}"
       class="px-3 py-1 bg-slate-900 text-white rounded text-sm">
       + ${firstForm.label}
    </a>`
}
