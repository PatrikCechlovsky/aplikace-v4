// src/modules/010-sprava-uzivatelu/index.js
import { supabase } from '../../main.js'

const card = (html) => `<div class="card p-4">${html}</div>`

async function viewPrehled(root){
  // pár statistik
  const { data, error } = await supabase.from('profiles').select('id, role, status')
  if (error) return root.innerHTML = card('Chyba načtení.')
  const total = data.length
  const admins = data.filter(x => x.role === 'admin').length
  const blocked = data.filter(x => x.status === 'blocked').length
  root.innerHTML = card(`
    <h3 class="font-semibold mb-2">👥 Přehled uživatelů</h3>
    <div class="text-sm text-slate-600">Celkem: <b>${total}</b>, Adminů: <b>${admins}</b>, Blokovaných: <b>${blocked}</b></div>
  `)
}

async function viewSeznam(root){
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, role, status')
    .order('full_name', { ascending: true })
  if (error) return root.innerHTML = card('Chyba načtení seznamu.')

  const rows = (data||[]).map(p => `
    <tr class="border-b">
      <td class="py-1">${p.full_name || '—'}</td>
      <td class="py-1">${p.role}</td>
      <td class="py-1">${p.status}</td>
      <td class="py-1 text-right">
        <button class="px-2 py-1 text-sm border rounded" data-edit="${p.id}">Upravit</button>
      </td>
    </tr>
  `).join('')

  root.innerHTML = card(`
    <h3 class="font-semibold mb-3">📋 Seznam uživatelů</h3>
    <table class="w-full text-sm">
      <thead><tr class="text-left text-slate-500">
        <th>Jméno</th><th>Role</th><th>Status</th><th></th>
      </tr></thead>
      <tbody>${rows || '<tr><td colspan="4">Žádní uživatelé.</td></tr>'}</tbody>
    </table>
  `)

  root.querySelectorAll('[data-edit]').forEach(btn=>{
    btn.onclick = ()=> location.hash = `#/m/010-sprava-uzivatelu/f/edit?id=${btn.dataset.edit}`
  })
}

async function formNovy(root){
  root.innerHTML = card(`
    <h3 class="font-semibold mb-3">➕ Pozvat uživatele (magic link)</h3>
    <div class="grid gap-2 max-w-md">
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
      options: { emailRedirectTo: location.origin + '/#/m/010-sprava-uzivatelu/t/prehled', data: { full_name: name.value || null } }
    })
    msg.textContent = error ? ('Chyba: '+error.message) : 'Pozvánka odeslána. Zkontroluj e-mail.'
  }
}

async function formEdit(root, id){
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single()
  if (error || !data) return root.innerHTML = card('Uživatel nenalezen.')

  root.innerHTML = card(`
    <h3 class="font-semibold mb-3">✏️ Upravit uživatele</h3>
    <div class="grid gap-2 max-w-md">
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

export async function renderModule(root, { kind, id, params }){
  if (kind === 'tile'){
    if (id === 'prehled') return viewPrehled(root)
    if (id === 'seznam')  return viewSeznam(root)
    return root.innerHTML = card('Neznámá dlaždice.')
  }
  if (kind === 'form'){
    if (id === 'novy')    return formNovy(root)
    if (id === 'edit')    return formEdit(root, params.get('id'))
    return root.innerHTML = card('Neznámý formulář.')
  }
  root.innerHTML = card('Neznámý typ.')
}
