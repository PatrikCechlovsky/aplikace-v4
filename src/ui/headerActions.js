export function renderHeaderActions(root){
  root.innerHTML = `
    <button class="text-sm" title="Hledat">🔎</button>
    <button class="text-sm" title="Notifikace">🔔</button>
    <a href="#/profil" class="text-sm" title="Můj účet">👤</a>
    <button class="text-sm" id="helpBtn" title="Nápověda">❓</button>
  `;
}
