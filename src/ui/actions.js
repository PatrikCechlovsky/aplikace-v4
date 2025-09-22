// src/ui/actions.js
import { getAction } from '../app/action-catalog.js'

export function actionBtn(id, { onClick, title, className = '' } = {}){
  const a = getAction(id)
  if (!a) return ''
  const icon = `<span class="inline-flex items-center justify-center w-4 h-4">
    <img src="${a.iconPath}" onerror="this.style.display='none';this.nextElementSibling.style.display='inline-block';" class="icon-16" alt="">
    <span style="display:none">${a.emoji}</span>
  </span>`
  const label = title || a.label
  // button HTML
  return `<button data-action="${id}" class="px-2 py-1 border rounded text-sm bg-white ${className}" title="${label}">
    ${icon} <span class="ml-1">${label}</span>
  </button>`
}

// helper: naváže click handlery podle data-action
export function bindActionHandlers(root, handlers = {}){
  root.querySelectorAll('[data-action]').forEach(el => {
    const id = el.getAttribute('data-action')
    if (handlers[id]) el.addEventListener('click', handlers[id])
  })
}
