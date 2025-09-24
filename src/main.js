// src/main.js
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../supabase.js'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

import { initComp01 } from './components/comp01.js'
import { MODULES } from './app/modules.index.js'
import { renderSidebar } from './ui/sidebar.js'
import { renderBreadcrumbs } from './ui/breadcrumbs.js'
import { renderTiles } from './ui/tiles.js'
import { renderMainAction } from './ui/mainActionBtn.js'
import { initAuthUI } from './ui/auth.js'
import { initThemeUI } from './ui/theme.js'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

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
  initThemeUI($('toolbar'))
  renderSidebar($('sidebar'))
}

async function route(){
  const h = parseHash()
  await paintStatic()

  // DASHBOARD
  if (h.view === 'dashboard') {
    $('breadcrumbs').innerHTML = ''
    $('actions-bar').innerHTML = ''
    $('content').innerHTML = `<div class="card p-4">Dashboard – sem dáme 7 karet.</div>`
    return
  }

  // MODUL
  const mod = findModule(h.mod)
  if (!mod){
    $('content').innerHTML = `<div class="card p-4">Neznámý modul.</div>`
    return
  }

  // jakou dlaždici/form zobrazit
  const activeTile = h.kind === 'tile'
    ? (h.id || mod.defaultTile || mod.tiles?.[0]?.id || null)
    : (mod.defaultTile || mod.tiles?.[0]?.id || null)

  // BREADCRUMBS + CHIPS + DYNAMIC MAIN ACTION
  renderBreadcrumbs($('breadcrumbs'), { mod, kind:h.kind, id: h.kind==='tile' ? activeTile : h.id })
  renderTiles($('actions-bar'), { mod, activeTileId: activeTile })

  // načti modul (kvůli akcím i renderu)
  try{
    const modImpl = await loadModule(mod.id)
    const getActions = typeof modImpl.getActions === 'function' ? modImpl.getActions : null
    const dynamicActions = getActions ? (await getActions({ kind: h.kind, id: h.kind==='tile' ? activeTile : h.id, params: h.params })) || [] : []
    renderMainAction($('actions-bar'), { mod, kind: h.kind, actions: dynamicActions })

    // OBSAH
    const { renderModule } = modImpl
    await renderModule($('content'), { kind: h.kind, id: h.kind==='tile' ? activeTile : h.id, params: h.params })
  }catch(err){
    console.error(err)
    $('content').innerHTML = `<div class="card p-4">Chyba načtení modulu.</div>`
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  initAuthUI(supabase)
  const homeBtn = $('home-button'); if (homeBtn) homeBtn.onclick = ()=> location.hash = '#/dashboard'
  await route()
})
window.addEventListener('hashchange', route)
