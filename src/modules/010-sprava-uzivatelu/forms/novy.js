import { supabase } from '../../../main.js'
const card = (h)=>`<div class="card p-4 max-w-md">${h}</div>`

export default async function render(root){
  root.innerHTML = card(`
    <h3 class="font-semibold mb-3">➕ Pozvat uživatele</h3>
    <div class="grid gap-2">
      <input id="fEmail" type="email" class="border rounded p-2" placeholder="E-mail" required />
      <input id="fName"  class="border rounded p-2" placeholder="Jméno (volitelné)" />
      <button id="btnInvite" class="px-3 py-2 bg-slate-900 text-white rounded">Odeslat pozvánku</button>
      <p id="msg" class="text-sm text-slate-600"></p>
    </div>
  `)
  const email = root.querySelector('#fEmail')
  const name  = root.querySelector('#fName')
  const msg   = root.querySelector('#msg')

  root.querySelector('#btnInvite').onclick = async ()=>{
    msg.textContent = 'Odesílám…'
    const { error } = await supabase.auth.signInWithOtp({
      email: (email.value||'').trim(),
      options: {
        emailRedirectTo: location.origin + '/#/m/010-sprava-uzivatelu/t/seznam',
        data: { full_name: name.value || null }
      }
    })
    msg.textContent = error ? ('Chyba: '+error.message) : 'Pozvánka odeslána (zkontroluj e-mail).'
  }
}
