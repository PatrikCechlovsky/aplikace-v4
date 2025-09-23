import { supabase } from '../../../main.js'
const card = (h)=>`<div class="card p-4">${h}</div>`

export default async function render(root){
  const { data, error } = await supabase.from('profiles').select('role,status')
  if (error) return root.innerHTML = card('Chyba načtení.')

  const total = data.length
  const admins = data.filter(x=>x.role==='admin').length
  const blocked = data.filter(x=>x.status==='blocked').length

  root.innerHTML = card(`
    <h3 class="font-semibold mb-2">👥 Přehled uživatelů</h3>
    <ul class="text-sm text-slate-700 space-y-1">
      <li>Celkem: <b>${total}</b></li>
      <li>Adminů: <b>${admins}</b></li>
      <li>Blokovaných: <b>${blocked}</b></li>
    </ul>
  `)
}
