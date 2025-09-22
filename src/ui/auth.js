// src/ui/auth.js
// Přihlašovací UI – funguje s <dialog>, ale pokud chybí/nefunguje,
// vytvoří a použije vlastní overlay (fallback). Předávej supabase klient.

function el(id){ return document.getElementById(id) }

function ensureDialogExists(){
  let dlg = el('authDialog')
  if (dlg) return dlg

  // Fallback: vytvoříme vlastní modál
  const overlay = document.createElement('div')
  overlay.id = 'authOverlay'
  overlay.style.cssText = `
    position:fixed; inset:0; background:rgba(0,0,0,.4);
    display:none; align-items:center; justify-content:center; z-index:9999;`
  overlay.innerHTML = `
    <div class="card p-4 w-full max-w-sm bg-white">
      <h2 class="font-semibold mb-3">Přihlášení / Registrace</h2>
      <label class="block text-sm mb-2">Email</label>
      <input id="authEmail" class="w-full border rounded p-2 mb-3" type="email" required />
      <label class="block text-sm mb-2">Heslo</label>
      <input id="authPass" class="w-full border rounded p-2 mb-4" type="password" minlength="6" required />
      <div class="flex gap-2">
        <button id="btnDoLogin"  class="px-3 py-2 bg-slate-900 text-white rounded">Přihlásit</button>
        <button id="btnDoSignup" class="px-3 py-2 border rounded bg-white">Registrovat</button>
        <button id="btnCloseAuth" class="ml-auto px-3 py-2 border rounded bg-white">Zavří
