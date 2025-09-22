export async function renderModule(root, { kind, id }) {
  const c = (h)=>`<div class="card p-4">${h}</div>`
  if (kind==='tile'){
    if (id==='prehled') return root.innerHTML = c('🛠️ Přehled služeb – demo.')
    if (id==='seznam')  return root.innerHTML = c('📋 Seznam služeb – tabulka později.')
    return root.innerHTML = c('Neznámá dlaždice.')
  }
  if (kind==='form' && id==='novy'){
    return root.innerHTML = c(`
      <h3 class="font-semibold mb-3">➕ Nová služba</h3>
      <div class="grid gap-3 max-w-md">
        <input class="border rounded p-2" placeholder="Název služby" />
        <button class="px-3 py-2 bg-slate-900 text-white rounded">Uložit (demo)</button>
      </div>
    `)
  }
  return root.innerHTML = c('Neznámý formulář.')
}
