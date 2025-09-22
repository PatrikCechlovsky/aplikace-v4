export function render(root){
  root.innerHTML = `
    <div class="card p-4">
      <div class="flex items-center justify-between mb-3">
        <h2 class="font-semibold">Seznam pronajímatelů</h2>
        <a href="#/m/030-pronajimatel/f/create" class="px-3 py-1 bg-slate-900 text-white rounded text-sm">+ Nový</a>
      </div>
      <p class="text-sm muted">Zatím statické. Napojíme na Supabase později.</p>
    </div>
  `
}
