import { supabase } from './supabase.js';

(async () => {
  const p = new URLSearchParams(location.hash.slice(1));
  if (p.get('type') === 'recovery' && p.get('access_token') && p.get('refresh_token')) {
    const { error } = await supabase.auth.setSession({
      access_token: p.get('access_token'),
      refresh_token: p.get('refresh_token'),
    });
    if (error) { console.error(error); return; }

    // tady si otevři dialog a po potvrzení volej:
    // await supabase.auth.updateUser({ password: noveHeslo })
  }
})();
