// src/main.js
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../supabase.js'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

import { initAuthUI, signOut, hardResetAuth } from './ui/auth.js'
import { renderSidebar } from './ui/sidebar.js'
import { MODULES } from './app/modules.index.js'
import { getState, setModule, setUnsaved } from './app/state.js'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
console.log('main.js loaded')

// ---- ROUTER ----
function parseRoute() {
  const raw = (location.hash || '#/dashboard').slice(1)
  const seg = raw.split('/')
  if (seg[0] !== 'm') return { type: 'root' }
  return { type:'module', mod:seg[1], kind:(seg[2]||'t'), id:seg[3]||null, params:new URLSearchParams(location.search) }
}
function syncModuleFromHash(){ const r=parseRoute(); setModule(r.type==='module'?r.mod:'dashboard') }

// ---- RENDER ----
function renderChrome(){
  renderSidebar(document.getElementById('sidebar'))
}

function renderActionsBar(modConf){
  const bar = document.getElementById('actions-bar')
  if (!bar) return

  // tiles → malé "chip" odkazy
  const tiles = (modConf?.tiles || []).map(t =>
    `<a class="chip tile px-3 py-1 text-sm" href="#/m/${modConf.id}/t/${t.id}">${t.icon || ''} ${t.label}</a>`
  )

  // hlavní akce → "+ První formulář" jako primární mini tlačítko
  const main = (modConf?.forms?.length)
    ? [`<a class="btn-primary text-sm px-3 py-1" href="#/m/${modConf.id}/f/${modConf.forms[0].id}">+ ${modConf.forms[0].label}</a>`]
    : []

  bar.innerHTML = [...tiles, ...main].join('')
}

async function renderContent(){
  const route     = parseRoute()
  const content   = document.getElementById('content')
  const bcEl      = document.getElementById('breadcrumbs')

  if (route.type === 'root') {
    bcEl.textContent = 'Hlavní panel'
    document.getElementById('actions-bar').innerHTML = ''
    content.innerHTML = `<div class="card p-8 text-sm muted">Dashboard – sem dáme 7 karet.</div>`
    return
  }

  const modConf = MODULES.find(m => m.id === route.mod)
  if (!modConf) {
    bcEl.textContent = 'Hlavní panel'
    document.getElementById('actions-bar').innerHTML = ''
    content.innerHTML = `<div class="card p-4">Neznámý modul.</div>`
    return
  }

  bcEl.textContent = `Hlavní panel › ${modConf.title}`
  renderActionsBar(modConf)

  const { renderModule } = await import(`./modules/${modConf.id}/index.js`)
  const kind = route.kind === 'f' ? 'form' : 'tile'
  const id = route.id || (kind==='tile' ? modConf.defaultTile : modConf.forms?.[0]?.id)
  await renderModule(content, { kind, id, params: route.params })
}

// ---- EVENTS ----
window.addEventListener('hashchange', () => { syncModuleFromHash(); renderChrome(); renderContent() })

window.addEventListener('load', async () => {
  initAuthUI(supabase)

  // „Můj účet“ ikona
  const btnAcc = document.getElementById('btnAccount')
  if (btnAcc) btnAcc.onclick = () => { location.hash = '#/m/020-muj-ucet' }

  // Odhlásit
  // … ve window.load:
  const tb = document.getElementById('toolbar')
  if (tb) {
    tb.innerHTML = `
      <button id="btnSignOut" class="px-3 py-1 rounded bg-white border text-sm hidden">Odhlásit</button>
      <button id="btnResetAuth" class="px-2 py-1 text-xs border rounded bg-white ml-2">Reset přihlášení</button>
    `
    const btn = document.getElementById('btnSignOut')
    btn.onclick = () => signOut(supabase)
    document.getElementById('btnResetAuth').onclick = () => hardResetAuth(supabase)
    supabase.auth.onAuthStateChange((_e, s) => btn.classList.toggle('hidden', !s?.user))
  }
  // home button
  document.getElementById('home-button')?.addEventListener('click', () => {
    const st = getState()
    if (st.unsaved && !confirm('Máte neuložené změny. Odejít bez uložení?')) return
    setUnsaved(false); location.hash = '#/dashboard'
  })

  syncModuleFromHash()
  renderChrome()
  renderContent()
})
