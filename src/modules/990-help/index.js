export async function renderModule(root, { kind, id }) {
  const c=(h)=>`<div class="card p-4">${h}</div>`
  return root.innerHTML = c(`
    <h3 class="font-semibold mb-2">🆘 Nápověda</h3>
    <ul class="list-disc ml-5 text-sm">
      <li>Jak přidat uživatele</li>
      <li>Jak vytvořit pronajímatele</li>
      <li>Často kladené dotazy…</li>
    </ul>
  `)
}
