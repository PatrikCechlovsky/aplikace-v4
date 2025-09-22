// seznam modulů – sidebar se generuje z tohohle (bez přepisování kódu)
export const MODULES = [
  { id: 'dashboard',  title: 'Přehled',         icon: '🏠', route: '#/dashboard' },
  { id: 'pronajimatel', title: 'Pronajímatelé', icon: '👤', route: '#/pronajimatel' },
  { id: 'nemovitosti',  title: 'Nemovitosti',   icon: '🏢', route: '#/nemovitosti' },
  { id: 'najemnici',    title: 'Nájemníci',     icon: '🧑‍🦱', route: '#/najemnici' },
  // přidáš jen další řádek a sidebar se sám rozšíří
];
