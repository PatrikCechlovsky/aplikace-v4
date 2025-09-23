// src/main.js
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../supabase.js'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

import { initAuthUI, signOut } from './ui/auth.js'
import { renderSidebar } from './ui/sidebar.js?v=44'
import { MODULES } from './app/modules.index.js'
import { getState, setModule, setUnsaved } from './app/state.js'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
})
// ---- ROUTER ----
function parseRoute() {
  const raw = (location.hash || '#/dashboard').slice(1)
  const seg = raw.split('/')
  if (seg[0] !== 'm') return { type: 'root' }
  return { type: 'module', mod: seg[1], kind: (seg[2] || 't'), id: seg[3] || null, params: new URLSearchParams(location.search) }
}
function syncModuleFromHash () {
  const r = parseRoute()
  setModule(r.type === 'module' ? r.mod : 'dashboard')
}

// ---- UI helpers ----
function renderChrome () {
  renderSidebar(document.getElementById('sidebar'))
}

function renderActionsBar (modConf) {
  const bar = document.getElementById('actions-bar')
  if (!bar) return
  if (!modConf) { bar.innerHTML = ''; return }

  const tiles = (modConf.tiles || []).map(t =>
    `<a class="chip tile px-3 py-1 text-sm" href="#/m/${modConf.id}/t/${t.id}">${t.icon || ''} ${t.label}</a>`
  )
  const main = (modConf.forms?.length)
    ? [`<a class="btn-primary text-sm px-3 py-1" href="#/m/${modConf.id}/f/${modConf.forms[0].id}">+ ${modConf.forms[0].label}</a>`]
    : []

  bar.innerHTML = [...tiles, ...main].join('')
}

function renderBreadcrumbs (modConf, item, kind) {
  const bc = document.getElementById('breadcrumbs')
  if (!bc) return
  if (!modConf) { bc.innerHTML = ''; return }

  const sep = `<span class="mx-2 text-slate-300">/</span>`
  const mod = `<span class="inline-flex items-center gap-1">${modConf.icon || ''} ${modConf.title}</span>`
  const it  = item ? `<span class="inline-flex items-center gap-1">${item.icon || ''} ${item.label}</span>` : ''

  bc.innerHTML = it ? `${mod} ${sep} ${it}` : mod
}

// ---- CONTENT ----
async function renderContent () {
  const route   = parseRoute()
  const content = document.getElementById('content')

  if (route.type === 'root') {
    document.getElementById('breadcrumbs').innerHTML = ''      // žádné drobečky na dashboardu
    document.getElementById('actions-bar').innerHTML = ''      // žádné akce
    content.innerHTML = `<div class="card p-8 text-sm muted">Dashboard – sem dáme 7 karet.</div>`
    return
  }

  const modConf = MODULES.find(m => m.id === route.mod)
  if (!modConf) {
    document.getElementById('breadcrumbs').innerHTML = ''
    document.getElementById('actions-bar').innerHTML = ''
    content.innerHTML = `<div class="card p-4">Neznámý modul.</div>`
    return
  }

  // připravíme item (dlaždice nebo formulář)
  const kind = route.kind === 'f' ? 'form' : 'tile'
  const fallbackId = kind === 'tile' ? modConf.defaultTile : modConf.forms?.[0]?.id
  const currId = route.id || fallbackId
  const item = (kind === 'tile'
    ? (modConf.tiles || []).find(t => t.id === currId)
    : (modConf.forms || []).find(f => f.id === currId)
  ) || null

  // breadcrumbs + actions bar
  renderBreadcrumbs(modConf, item, kind)
  renderActionsBar(modConf)

  // načti a vykresli modul
  const { renderModule } = await import(`./modules/${modConf.id}/index.js`)
  await renderModule(content, { kind, id: currId, params: route.params })
}

function wireUserName () {
  const el = document.getElementById('userName')
  const btnAuth = document.getElementById('btnAuth')
  if (!el || !btnAuth) return

  const set = (user) => {
    const name = user?.user_metadata?.full_name || user?.email || ''
    el.textContent = name ? `${name}` : ''
    btnAuth.classList.toggle('hidden', !!user)
  }

  // init
  supabase.auth.getUser().then(({ data }) => set(data?.user ?? null))
  // on change
  supabase.auth.onAuthStateChange((_e, session) => set(session?.user ?? null))
}

// ---- EVENTS ----
window.addEventListener('hashchange', () => {
  syncModuleFromHash()
  renderChrome()
  renderContent()
})

window.addEventListener('load', async () => {
  initAuthUI(supabase)
  wireUserName()

  const btnAcc = document.getElementById('btnAccount')
  if (btnAcc) btnAcc.onclick = () => { location.hash = '#/m/020-muj-ucet' }

  const tb = document.getElementById('toolbar')
  if (tb) {
    tb.innerHTML = `<button id="btnSignOut" class="px-3 py-1 rounded bg-white border text-sm hidden">Odhlásit</button>`
    const btn = document.getElementById('btnSignOut')
    btn.onclick = () => signOut(supabase)
    supabase.auth.onAuthStateChange((_e, s) => btn.classList.toggle('hidden', !s?.user))
  }

  document.getElementById('home-button')?.addEventListener('click', () => {
    const st = getState()
    if (st.unsaved && !confirm('Máte neuložené změny. Odejít bez uložení?')) return
    setUnsaved(false)
    location.hash = '#/dashboard'
  })

  syncModuleFromHash()
  renderChrome()
  renderContent()
})
