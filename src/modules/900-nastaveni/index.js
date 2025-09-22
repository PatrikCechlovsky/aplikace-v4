export async function renderModule(root, { kind, id }) {
  const c=(h)=>`<div class="card p-4">${h}</div>`
  return root.innerHTML = c(`
    <h3 class="font-semibold mb-2">⚙️ Nastavení</h3>
    <p class="text-sm text-slate-600">Sem přesuneme přepínač vzhledu, hustoty a další volby.</p>
  `)
}
