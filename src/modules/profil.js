// src/modules/profil.js
import { supabase } from '../ui/auth.js'

export async function renderProfil(root) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    root.innerHTML = `<div class="p-6 bg-white card">
      <h1 class="text-xl font-semibold mb-2">Profil</h1>
      <p class="text-sm">Pro zobrazení profilu se prosím přihlas.</p>
    </div>`
    return
  }

  // zjištění úrovně a faktorů
  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel().catch(()=>({data:null}))
  const { data: factors } = await supabase.auth.mfa.listFactors().catch(()=>({data:{totp:[]}}))
  const hasTOTP = (factors?.totp?.length || 0) > 0

  root.innerHTML = `
    <div class="p-6 bg-white card">
      <h1 class="text-xl font-semibold mb-4">Můj účet</h1>
      <div class="mb-3 text-sm">Email: <b>${user.email}</b></div>
      <div class="mb-6 text-sm">MFA (TOTP): <b>${hasTOTP ? 'Zapnuto' : 'Vypnuto'}</b> ${aal ? `(AAL: ${aal.currentLevel} → ${aal.nextLevel})` : ''}</div>

      <div id="mfaBlock" class="space-y-3">
        ${!hasTOTP ? `
          <button id="btnEnroll" class="px-3 py-2 bg-slate-900 text-white rounded">Zapnout 2FA</button>
          <div id="qrWrap" class="hidden">
            <p class="text-sm mb-2">Naskenuj QR kód v aplikaci (Google/Microsoft Authenticator) a zadej 6-místný kód:</p>
            <div id="qrBox" class="mb-2"></div>
            <input id="code" class="border rounded p-2" placeholder="123456" />
            <button id="btnVerify" class="px-3 py-2 border rounded">Ověřit a zapnout</button>
            <div id="mfaMsg" class="text-sm text-slate-500 mt-2"></div>
          </div>
        ` : `
          <button id="btnMFAChallenge" class="px-3 py-2 border rounded">Ověřit kódem (challenge)</button>
          <button id="btnDisable" class="px-3 py-2 border rounded">Vypnout 2FA</button>
          <div id="mfaMsg" class="text-sm text-slate-500 mt-2"></div>
        `}
      </div>
    </div>
  `

  // ENROLL → CHALLENGE → VERIFY (zapnutí)
  document.getElementById('btnEnroll')?.addEventListener('click', async () => {
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' })
    if (error) { alert(error.message); return }
    document.getElementById('qrWrap').classList.remove('hidden')
    // Supabase vrací SVG QR kód
    document.getElementById('qrBox').innerHTML = data.totp.qr_code

    document.getElementById('btnVerify').onclick = async () => {
      const { data: challenge, error: chErr } = await supabase.auth.mfa.challenge({ factorId: data.id })
      if (chErr) { alert(chErr.message); return }
      const code = document.getElementById('code').value.trim()
      const { error: vErr } = await supabase.auth.mfa.verify({
        factorId: data.id,
        challengeId: challenge.id,
        code
      })
      document.getElementById('mfaMsg').textContent = vErr ? ('Chyba: ' + vErr.message) : '2FA zapnuto.'
      if (!vErr) setTimeout(()=>location.reload(), 800)
    }
  })

  // CHALLENGE během přihlášené session (ověření kódem)
  document.getElementById('btnMFAChallenge')?.addEventListener('click', async () => {
    const { data: list } = await supabase.auth.mfa.listFactors()
    const factor = list.totp?.[0]
    if (!factor) return alert('Žádný TOTP faktor')
    const { data: challenge, error } = await supabase.auth.mfa.challenge({ factorId: factor.id })
    if (error) return alert(error.message)
    const code = prompt('Zadej 6-místný kód z aplikace:')
    if (!code) return
    const { error: vErr } = await supabase.auth.mfa.verify({ factorId: factor.id, challengeId: challenge.id, code: code.trim() })
    alert(vErr ? ('Chyba: ' + vErr.message) : 'Ověřeno.')
  })

  // Vypnutí 2FA (unenroll)
  document.getElementById('btnDisable')?.addEventListener('click', async () => {
    const { data: list } = await supabase.auth.mfa.listFactors()
    const factor = list.totp?.[0]
    if (!factor) return alert('Žádný TOTP faktor')
    if (!confirm('Opravdu vypnout 2FA?')) return
    const { error } = await supabase.auth.mfa.unenroll({ factorId: factor.id })
    alert(error ? ('Chyba: ' + error.message) : '2FA vypnuto.')
    if (!error) location.reload()
  })
}
