export async function renderModule(root, { kind, id }) {
  const card = (html) => `<div class="card p-4">${html}</div>`

  if (kind === 'tile') {
    if (id === 'prehled')   return root.innerHTML = card('👥 Přehled uživatelů – demo obsah.')
    if (id === 'seznam')    return root.innerHTML = card('📋 Seznam uživatelů – sem přijde tabulka.')
    return root.innerHTML = card('Neznámá dlaždice.')
  }

  if (kind === 'form') {
    if (id === 'novy') {
      return root.innerHTML = card(`
        <h3 class="font-semibold mb-3">➕ Nový uživatel</h3>
        <div class="grid gap-3 max-w-md">
          <input class="border rounded p-2" placeholder="Jméno a příjmení" />
          <input type="email" class="border rounded p-2" placeholder="E-mail" />
          <input type="password" class="border rounded p-2" placeholder="Heslo" />
          <button class="px-3 py-2 bg-slate-900 text-white rounded">Uložit (demo)</button>
        </div>
      `)
    }
    return root.innerHTML = card('Neznámý formulář.')
  }

  root.innerHTML = card('Neznámý typ zobrazení.')
}
