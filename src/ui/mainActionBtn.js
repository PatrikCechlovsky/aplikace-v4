import { getState } from '../app/state.js';

export function renderMainAction(root){
  const cur = getState().current;
  // sem dáme kontext – pro každý modul jiné primární tlačítko
  const map = {
    pronajimatel: `<a href="#/pronajimatel?new=1" class="px-3 py-1 bg-slate-900 text-white rounded text-sm">+ Přidat pronajímatele</a>`,
    nemovitosti:  `<a href="#/nemovitosti?new=1"  class="px-3 py-1 bg-slate-900 text-white rounded text-sm">+ Přidat nemovitost</a>`,
    najemnici:    `<a href="#/najemnici?new=1"    class="px-3 py-1 bg-slate-900 text-white rounded text-sm">+ Přidat nájemníka</a>`,
  };
  root.innerHTML = map[cur] || '';
}
