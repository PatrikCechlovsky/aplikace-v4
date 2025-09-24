// src/main.js
import { supabase } from './supabase.js';              // ✅ použít existující klient (žádný createClient)
import { MODULES } from './app/modules.index.js'
import { renderSidebar } from './ui/sidebar.js'
import { renderBreadcrumbs } from './ui/breadcrumbs.js'
import { renderCrumbActions } from './ui/mainActionBtn.js'
import { initAuthUI } from './ui/auth.js'
import { initComp01 } from './components/comp01.js'    // logo → domů + zavřít sidebar

const $ = (id) => document.getElementById(id)
const findModule = (id) => MODULES.find(m => m.id === id)

function parseHash() {
  const raw = (location.hash || '').replace(/^#\/?/, '')
  const [path, q] = raw.split('?')
  const parts = (path || '').split('/').filter(Boolean)
  const params = new URLSearchParams(q || '')
  if (parts[0] !== 'm') return { view: 'dashboard', params }
  const mod = parts[1]
  if (!mod) return { view: 'dashboard', params }
  if (parts[2] === 't' && parts[3]) return { view:'module', mod, kind:'tile', id:parts[3], params }
  if (parts[2] === 'f' && parts[3]) return { view:'module', mod, kind:'form', id:parts[3], params }
  return { view:'module', mod, kind:'tile', id:null, params }
}

async function loadModule(modId){
  return await import(`./modules/${modId}/index.js`)
}

async function paintStatic() {
  renderSidebar($('sidebar'))
}

async function route(){
  const h = parseHash()
  await paintStatic()

  if (h.view === 'dashboard') {
    $('breadcrumbs').innerHTML = `
      <a id="home-link" class="inline-flex items-center gap-1 px-2 py-1 rounded border bg-white text-sm" href="#/dashboard">🏠 Domů</a>
    `
    $('crumb-actions').innerHTML = ''
    $('actions-bar').innerHTML = ''
    $('content').innerHTML = `<div class="card p-4">Dashboard – sem dáme 7 karet.</div>`
    bindHomeCloseSidebar()
    return
  }

  const mod = findModule(h.mod)
  if (!mod){
    $('content').innerHTML = `<div class="card p-4">Neznámý modul.</div>`
    return
  }

  const activeTile = h.kind === 'tile'
    ? (h.id || mod.defaultTile || mod.tiles?.[0]?.id || null)
    : (mod.defaultTile || mod.tiles?.[0]?.id || null)

  renderBreadcrumbs($('breadcrumbs'), { mod, kind:h.kind, id: h.kind==='tile' ? activeTile : h.id })
  bindHomeCloseSidebar()

  // chips vypnuté – používáme strom v sidebaru
  $('actions-bar').innerHTML = ''

  try{
    const modImpl = await loadModule(mod.id)

    const getActions = typeof modImpl.getActions === 'function' ? modImpl.getActions : null
    const dynamicActions = getActions ? (await getActions({ kind: h.kind, id: h.kind==='tile' ? activeTile : h.id, params: h.params })) || [] : []
    $('crumb-actions').innerHTML = ''
    renderCrumbActions($('crumb-actions'), { mod, kind: h.kind, actions: dynamicActions })

    const { renderModule } = modImpl
    await renderModule($('content'), { kind: h.kind, id: h.kind==='tile' ? activeTile : h.id, params: h.params })
  }catch(err){
    console.error(err)
    $('content').innerHTML = `<div class="card p-4">Chyba načtení modulu.</div>`
  }
}

function bindHomeCloseSidebar(){
  const OPEN_KEY = 'ui:openModule'
  $('home-link')?.addEventListener('click', () => {
    localStorage.removeItem(OPEN_KEY)
  })
}

window.addEventListener('DOMContentLoaded', async () => {
  initAuthUI(supabase)     // předáme stejný klient (i když si ho auth.js importuje, nevadí)
  initComp01()
  await route()
})
window.addEventListener('hashchange', route)
