export async function renderModule(root, { kind, id }) {
  const card = (h)=>`<div class="card p-4">${h}</div>`
  if (kind==='tile'){
    if (id==='seznam') return root.innerHTML = card('📋 Seznam smluv – demo tabulka.')
    return root.innerHTML = card('Neznámá dlaždice.')
  }
  if (kind==='form' && id==='novy'){
    return root.innerHTML = card(`
      <h3 class="font-semibold mb-3">➕ Nová smlouva</h3>
      <div class="grid gap-3 max-w-md">
        <input class="border rounded p-2" placeholder="Číslo smlouvy" />
        <input class="border rounded p-2" placeholder="Pronajímatel / Nájemník" />
        <button class="px-3 py-2 bg-slate-900 text-white rounded">Uložit (demo)</button>
      </div>
    `)
  }
  return root.innerHTML = card('Neznámý formulář.')
}
