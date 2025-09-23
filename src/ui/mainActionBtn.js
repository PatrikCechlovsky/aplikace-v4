// src/ui/mainActionBtn.js
export function renderMainAction(root, { mod, kind }){
  if (!root || !mod) return
  const forms = mod.forms || []
  if (!forms.length) return

  const btns = forms.map(f => `
    <a class="px-3 py-2 rounded bg-slate-900 text-white text-sm"
       href="#/m/${mod.id}/f/${f.id}">
       ${f.icon || '➕'} ${f.label}
    </a>
  `).join('')

  // přidáme vpravo za tiles (nepřepisujeme)
  const holder = document.createElement('div')
  holder.className = 'ml-2 flex gap-2'
  holder.innerHTML = btns
  root.appendChild(holder)
}
