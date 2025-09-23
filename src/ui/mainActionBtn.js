// src/ui/mainActionBtn.js
export function renderMainAction(root, { mod, kind, actions = [] }){
  if (!root || !mod) return

  // Fallback: první form z module.config (globální +Přidat)
  const fallback = (mod.forms?.length)
    ? [`<a class="px-3 py-2 rounded bg-slate-900 text-white text-sm"
         href="#/m/${mod.id}/f/${mod.forms[0].id}">
         ${mod.forms[0].icon || '➕'} ${mod.forms[0].label}
       </a>`]
    : []

  // Dynamické akce z aktuální dlaždice/formuláře
  const dyn = (actions || []).map(a => {
    const icon = a.icon || '🔘'
    const label = a.label || 'Akce'
    return a.href
      ? `<a class="px-3 py-2 rounded bg-slate-900 text-white text-sm" href="${a.href}">${icon} ${label}</a>`
      : `<button class="px-3 py-2 rounded bg-slate-900 text-white text-sm" data-action="${a.id||''}">${icon} ${label}</button>`
  })

  const holder = document.createElement('div')
  holder.className = 'ml-2 flex gap-2'
  holder.innerHTML = [...fallback, ...dyn].join('')

  // nepřepisujeme chipy dlaždic – jen připojíme akce vpravo
  root.appendChild(holder)
}
