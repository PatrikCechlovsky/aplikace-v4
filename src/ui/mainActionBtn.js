// src/ui/mainActionBtn.js

// Renderujeme do #crumb-actions, NE do #actions-bar.
// Tlačítka jsou ikony s title (tooltip), zarovnané vpravo.
export function renderCrumbActions(root, { mod, kind, actions = [] }){
  if (!root || !mod) return

  // fallback: vezmeme první form jako + ikonu (pokud nejsou žádné dynamické akce)
  const fallback = (!actions?.length && mod.forms?.length)
    ? [{ href: `#/m/${mod.id}/f/${mod.forms[0].id}`, icon: mod.forms[0].icon || '➕', label: mod.forms[0].label }]
    : []

  // poskládáme celkové akce
  const all = [...actions, ...fallback]

  // vyčistit starý obsah
  root.innerHTML = ''

  // vytvořit a přidat ikonová tlačítka
  all.forEach(a => {
    let el
    if (a.href){
      el = document.createElement('a')
      el.href = a.href
    } else {
      el = document.createElement('button')
      if (a.id) el.dataset.action = a.id
    }
    el.className = 'btn-ghost px-2 py-1 text-sm'
    el.title = a.label || 'Akce'
    el.textContent = a.icon || '🔘'
    root.appendChild(el)
  })
}
