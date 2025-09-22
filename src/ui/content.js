import { getState, setUnsaved } from '../app/state.js';

export function renderContent(root){
  const cur = getState().current;
  // dočasný obsah
  root.innerHTML = `
    <div class="card p-4">
      <div class="text-sm text-slate-500 mb-2">Aktivní modul: <b>${cur}</b></div>
      <p class="text-sm">Tady bude seznam / formuláře / grafy podle modulu.</p>
      <div class="mt-3">
        <label class="text-sm mr-2">Simulovat rozdělanou práci:</label>
        <input type="checkbox" id="unsavedToggle"/>
      </div>
    </div>
  `;
  const chk = root.querySelector('#unsavedToggle');
  chk.onchange = () => setUnsaved(chk.checked);
}
