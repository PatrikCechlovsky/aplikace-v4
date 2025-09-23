// src/modules/020-muj-ucet/index.js
import { supabase } from '../../main.js'

const card = (html) => `<div class="card p-4 max-w-lg">${html}</div>`

export async function renderModule(root){
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return root.innerHTML = card(`<p>Přihlas se prosím.</p>`)
  }

  // načti svůj profil
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  root.innerHTML = card(`
    <h3 class="font-semibold mb-3">👤 Můj účet</h3>
    <div class="grid gap-2">
      <label class="text-sm">E-mail</label>
      <input class="border rounded p-2 bg-slate-100" value="${user.email||''}" disabled />

      <label class="text-sm">Jméno</label>
      <input id="fName" class="border rounded p-2" value="${profile?.full_name||''}" />

      <label class="text-sm">Role</label>
      <input class="border rounded p-2 bg-slate-100" value="${profile?.role||'user'}" disabled />

      <div class="flex gap-2 mt-2">
        <button id="btnSave" class="px-3 py-2 bg-slate-900 text-white rounded">Uložit</button>
      </div>
      <p id="msg" class="text-sm text-slate-600"></p>
    </div>
  `)

  const name = root.querySelector('#fName')
  const msg  = root.querySelector('#msg')
  root.querySelector('#btnSave').onclick = async ()=>{
    msg.textContent = 'Ukládám…'
    const { error } = await supabase.from('profiles').update({ full_name: name.value || null }).eq('id', user.id)
    msg.textContent = error ? ('Chyba: '+error.message) : 'Uloženo.'
  }
}
