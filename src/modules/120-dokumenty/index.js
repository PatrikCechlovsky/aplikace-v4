export async function renderModule(root, { kind, id }) {
  const c=(h)=>`<div class="card p-4">${h}</div>`
  if (kind==='tile'){
    if (id==='seznam') return root.innerHTML = c('📁 Seznam dokumentů – demo.')
    return root.innerHTML = c('Neznámá dlaždice.')
  }
  if (kind==='form' && id==='novy'){
    return root.innerHTML = c(`
      <h3 class="font-semibold mb-3">➕ Nahrát dokument</h3>
      <input type="file" class="border rounded p-2" />
      <button class="px-3 py-2 mt-3 bg-slate-900 text-white rounded">Nahrát (demo)</button>
    `)
  }
  return root.innerHTML = c('Neznámý formulář.')
}
