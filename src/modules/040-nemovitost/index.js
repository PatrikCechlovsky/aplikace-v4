export async function renderModule(root, { kind, id }) {
  const card = (h) => `<div class="card p-4">${h}</div>`
  if (kind==='tile'){
    if (id==='prehled') return root.innerHTML = card('🏘️ Přehled nemovitostí – demo.')
    if (id==='seznam')  return root.innerHTML = card('📋 Seznam nemovitostí – tabulka později.')
    return root.innerHTML = card('Neznámá dlaždice.')
  }
  if (kind==='form' && id==='novy'){
    return root.innerHTML = card(`
      <h3 class="font-semibold mb-3">➕ Nová nemovitost</h3>
      <div class="grid gap-3 max-w-md">
        <input class="border rounded p-2" placeholder="Název / Adresa" />
        <input class="border rounded p-2" placeholder="Typ (byt, dům…)" />
        <button class="px-3 py-2 bg-slate-900 text-white rounded">Uložit (demo)</button>
      </div>
    `)
  }
  return root.innerHTML = card('Neznámý formulář.')
}
