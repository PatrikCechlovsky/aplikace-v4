// src/ui/actions.js
import { getAction } from '../app/action-catalog.js'

export function actionBtn(id, { onClick, title, className = '' } = {}) {
  const a = getAction(id)
  if (!a) return ''

  // pokud bude mít akce někdy SVG, zobrazíme je; jinak emoji
  const iconHtml = a.iconPath
    ? `<img src="${a.iconPath}" class="icon-16" alt="" />`
    : `<span class="icon-16" aria-hidden="true">${a.icon || '🔘'}</span>`

  const label = title || a.label

  return `<button data-action="${id}" class="px-2 py-1 border rounded text-sm bg-white ${className}" title="${label}">
    ${iconHtml} <span class="ml-1">${label}</span>
  </button>`
}

export function bindActionHandlers(root, handlers = {}){
  root.querySelectorAll('[data-action]').forEach(el => {
    const id = el.getAttribute('data-action')
    if (handlers[id]) el.addEventListener('click', handlers[id])
  })
}
