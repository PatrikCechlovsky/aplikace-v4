export async function renderModule(root, { kind, id }) {
  const c = (h)=>`<div class="card p-4">${h}</div>`
  if (kind==='tile'){
    if (id==='prehled') return root.innerHTML = c('💰 Přehled plateb – grafy později.')
    if (id==='seznam')  return root.innerHTML = c('📋 Seznam plateb – tabulka později.')
    return root.innerHTML = c('Neznámá dlaždice.')
  }
  if (kind==='form' && id==='prijem'){
    return root.innerHTML = c(`
      <h3 class="font-semibold mb-3">➕ Nový příjem</h3>
      <div class="grid gap-3 max-w-md">
        <input class="border rounded p-2" placeholder="Částka" />
        <input class="border rounded p-2" placeholder="Poznámka" />
        <button class="px-3 py-2 bg-slate-900 text-white rounded">Uložit (demo)</button>
      </div>
    `)
  }
  return root.innerHTML = c('Neznámý formulář.')
}
