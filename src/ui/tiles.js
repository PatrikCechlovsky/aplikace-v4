import { getState } from '../app/state.js';

export function renderTiles(root){
  const cur = getState().current;
  // zatím jen placeholder – později doplníme skutečné „dlaždice“ modulu
  const tiles = {
    dashboard: ['Statistiky','Rychlé akce','Nedávné změny'],
    pronajimatel: ['Seznam','Import','Export','Filtry'],
    nemovitosti: ['Seznam','Mapa','Typy'],
    najemnici: ['Seznam','Dlužníci','Komunikace'],
  }[cur] || [];
  root.innerHTML = tiles.map(t => `<span class="tile">${t}</span>`).join('');
}
