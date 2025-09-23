import { MODULES } from '../app/modules.index.js';
import { getState } from '../app/state.js';

export function renderBreadcrumbs(root){
  const cur = getState().current;
  const currentModule = MODULES.find(m => m.id===cur);
  const trail = ['Hlavní panel'];
  if (currentModule && currentModule.id!=='dashboard') trail.push(currentModule.title);
  root.textContent = trail.join(' › ');
}
