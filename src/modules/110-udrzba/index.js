export async function renderModule(root, { kind, id }) {
  const c = (h)=>`<div class="card p-4">${h}</div>`
  if (kind==='tile'){
    if (id==='prehled') return root.innerHTML = c('🔧 Přehled údržby – demo.')
    if (id==='seznam')  return root.innerHTML = c('📋 Požadavky – seznam.')
    return root.innerHTML = c('Neznámá dlaždice.')
  }
  if (kind==='form' && id==='nahlasit'){
    return root.innerHTML = c(`
      <h3 class="font-semibold mb-3">➕ Nahlásit závadu</h3>
      <div class="grid gap-3 max-w-md">
        <input class="border rounded p-2" placeholder="Název problému" />
        <textarea class="border rounded p-2" placeholder="Popis"></textarea>
        <button class="px-3 py-2 bg-slate-900 text-white rounded">Odeslat (demo)</button>
      </div>
    `)
  }
  return root.innerHTML = c('Neznámý formulář.')
}
