export async function renderModule(root, { kind, id }) {
  const c = (h)=>`<div class="card p-4">${h}</div>`
  return root.innerHTML = c('💸 Finance – demo přehled.')
}
