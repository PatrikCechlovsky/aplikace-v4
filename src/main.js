import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../supabase.js'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { initAuthUI, signOut } from './ui/auth.js'
import { initThemeUI } from './ui/theme.js'
import { renderSidebar } from './ui/sidebar.js'
import { renderBreadcrumbs } from './ui/breadcrumbs.js'
import { renderHeaderActions } from './ui/headerActions.js'
import { renderMainAction } from './ui/mainActionBtn.js'
import { renderTiles } from './ui/tiles.js'
import { renderContent } from './ui/content.js'
import { MODULES } from './app/modules.js'
import { getState, setModule, getState as state, setUnsaved } from './app/state.js'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

function go(route){
  // potvrzení, když je rozdělaná práce
  if (state().unsaved && !confirm('Máte neuložené změny. Odejít bez uložení?')) return;
  location.hash = route;
}

function syncFromHash(){
  const hash = (location.hash || '#/dashboard').replace('#/','');
  const mod = MODULES.find(m => m.id===hash) ? hash : 'dashboard';
  setModule(mod);
}

function renderAll(){
  const s = getState();
  renderSidebar(document.getElementById('sidebar'));
  renderBreadcrumbs(document.getElementById('breadcrumbs'));
  renderHeaderActions(document.getElementById('header-actions'));
  renderMainAction(document.getElementById('main-action-btn'));
  renderTiles(document.getElementById('module-tiles'));
  renderContent(document.getElementById('content'));
}

window.addEventListener('hashchange', () => { syncFromHash(); renderAll(); });

window.addEventListener('load', async () => {
  initAuthUI();
  // theme
  const themeMount = document.getElementById('themePicker');
  if (themeMount) initThemeUI(themeMount);
  // odhlášení
  const tb = document.getElementById('toolbar');
  if (tb) {
    tb.innerHTML = `<button id="btnSignOut" class="px-3 py-1 rounded bg-white border text-sm hidden">Odhlásit</button>`;
    const btn = document.getElementById('btnSignOut');
    btn.onclick = signOut;
    supabase.auth.onAuthStateChange((_e, s) => btn.classList.toggle('hidden', !s?.user));
  }
  // home-button (#1)
  document.getElementById('home-button')?.addEventListener('click', () => {
    setUnsaved(false);
    go('#/dashboard');
  });

  syncFromHash();
  renderAll();
});
