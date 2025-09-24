// src/components/comp01.js
const OPEN_KEY = 'ui:openModule' // stejné, jaké používá sidebar.js

export function initComp01() {
  const el = document.getElementById('app-logo')
  if (!el) return

  el.addEventListener('click', (e) => {
    e.preventDefault()

    // 1) zavři rozbalený modul v sidebaru
    localStorage.removeItem(OPEN_KEY)

    // 2) skoč na dashboard (hlavní stránka)
    location.hash = '#/dashboard'

    // 3) volitelně: vyčisti případné dialogy/flash zprávy atd. (pokud nějaké máš)
    // document.getElementById('authDialog')?.close?.()
  })
}
