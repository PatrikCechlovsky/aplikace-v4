// src/modules/010-sprava-uzivatelu/index.js
function card(html){ return `<div class="card p-4">${html}</div>` }

function getParams(){
  const h = (location.hash || '')
  const q = h.split('?')[1] || ''
  return new URLSearchParams(q)
}

async function load(kind, id){
  if (kind === 'tile')  return await import(`./tiles/${id}.js`).then(m => m.default || m.render)
  if (kind === 'form')  return await import(`./forms/${id}.js`).then(m => m.default || m.render)
  throw new Error('Unknown kind')
}

export async function renderModule(root, { kind, id }){
  try {
    const render = await load(kind, id)
    const params = getParams()
    await render(root, { params })
  } catch (e) {
    console.error(e)
    root.innerHTML = card('Sekce nenalezena.')
  }
}
