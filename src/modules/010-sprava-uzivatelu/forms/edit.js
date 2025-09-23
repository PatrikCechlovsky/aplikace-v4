import { supabase } from '../../../main.js'
const card = (h)=>`<div class="card p-4 max-w-md">${h}</div>`

export default async function render(root, { params }){
  const id = params.get('id')
  if (!id) return root.innerHTML = card('Chybí ID.')

  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single()
  if (error || !data) return root.innerHTML = card('Uživatel nenalezen.')

  root.innerHTML = card(`
    <h3 class="font-semibold mb-3">✏️ Upravit uživatele</h3>
    <div class="grid gap-2">
      <label class="text-sm">Jméno</label>
      <input id="fName" class="border rounded p-2" value="${data.full_name||''}" />
      <label class="text-sm">Role</label>
      <select id="fRole" class="border rounded p-2">
        ${['admin','manager','user'].map(r=>`<option ${data.role===r?'selected':''}>${r}</option>`).join('')}
      </select>
      <label class="text-sm">Status</label>
      <select id="fStatus" class="border rounded p-2">
        ${['active','blocked','archived'].map(s=>`<option ${data.status===s?'selected':''}>${s}</option>`).join('')}
      </select>
      <div class="flex gap-2 mt-2">
        <button id="btnSave" class="px-3 py-2 bg-slate-900 text-white rounded">Uložit</button>
        <a class="px-3 py-2 border rounded bg-white" href="#/m/010-sprava-uzivatelu/t/seznam">Zpět</a>
      </div>
      <p id="msg" class="text-sm text-slate-600"></p>
    </div>
  `)

  const f = {
    name:  root.querySelector('#fName'),
    role:  root.querySelector('#fRole'),
    status:root.querySelector('#fStatus'),
    msg:   root.querySelector('#msg'),
  }
  root.querySelector('#btnSave').onclick = async ()=>{
    f.msg.textContent = 'Ukládám…'
    const { error } = await supabase.from('profiles').update({
      full_name: f.name.value || null,
      role: f.role.value,
      status: f.status.value
    }).eq('id', id)
    f.msg.textContent = error ? ('Chyba: '+error.message) : 'Uloženo.'
  }
}
