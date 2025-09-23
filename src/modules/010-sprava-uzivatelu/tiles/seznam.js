import { supabase } from '../../../main.js'
const card = (h)=>`<div class="card p-4">${h}</div>`

export default async function render(root){
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, role, status, email')
    .order('full_name', { ascending: true })
  if (error) return root.innerHTML = card('Chyba načtení seznamu.')

  const rows = (data||[]).map(p => `
    <tr class="border-b">
      <td class="py-1 pr-2">${p.full_name || '—'}</td>
      <td class="py-1 pr-2">${p.email || '—'}</td>
      <td class="py-1 pr-2">${p.role}</td>
      <td class="py-1 pr-2">${p.status}</td>
      <td class="py-1 text-right">
        <a class="px-2 py-1 text-sm border rounded" href="#/m/010-sprava-uzivatelu/f/edit?id=${p.id}">Upravit</a>
      </td>
    </tr>
  `).join('')

  root.innerHTML = card(`
    <h3 class="font-semibold mb-3">📋 Seznam uživatelů</h3>
    <div class="mb-2">
      <a class="px-3 py-2 bg-slate-900 text-white rounded" href="#/m/010-sprava-uzivatelu/f/novy">+ Pozvat</a>
    </div>
    <table class="w-full text-sm">
      <thead><tr class="text-left text-slate-500"><th>Jméno</th><th>E-mail</th><th>Role</th><th>Stav</th><th></th></tr></thead>
      <tbody>${rows || '<tr><td colspan="5">Žádní uživatelé.</td></tr>'}</tbody>
    </table>
  `)
}
