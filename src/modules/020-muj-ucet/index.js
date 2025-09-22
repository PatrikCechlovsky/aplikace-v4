export async function renderModule(root, { kind, id }) {
  const card = (html) => `<div class="card p-4">${html}</div>`
  // jen jedna dlaždice
  return root.innerHTML = card(`
    <h3 class="font-semibold mb-2">👤 Můj účet</h3>
    <p class="text-sm text-slate-600">Zde později přidáme nastavení profilu, vzhled, hustotu atd.</p>
  `)
}
