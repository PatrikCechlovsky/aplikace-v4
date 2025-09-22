import { setUnsaved } from '../../app/state.js'

export function render(root){
  setUnsaved(true)
  root.innerHTML = `
    <form id="frm" class="card p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="text-sm">Typ</label>
        <select name="typ" class="w-full border rounded p-2">
          <option>Osoba</option><option>OSVČ</option><option>Firma</option>
          <option>Spolek/Skupina</option><option>Zastupující osoba</option>
        </select>
      </div>
      <div>
        <label class="text-sm">Název/Jméno</label>
        <input name="nazev" class="w-full border rounded p-2" required>
      </div>
      <div class="md:col-span-2 flex gap-2">
        <button class="px-3 py-2 bg-slate-900 text-white rounded">Uložit</button>
        <a href="#/m/030-pronajimatel/t/list" class="px-3 py-2 border rounded bg-white">Zrušit</a>
      </div>
    </form>
  `
  const form = root.querySelector('#frm')
  form.onsubmit = (e) => {
    e.preventDefault()
    // TODO: uložit do Supabase
    setUnsaved(false)
    location.hash = '#/m/030-pronajimatel/t/list'
  }
}
