# PRAVIDLA PROJEKTU (Aplikace pronajímatel)

## 0. Cíl
- Web-only aplikace (statická), **bez buildu**, vše přes ESM a CDN.
- Backend: **Supabase** (Auth + Postgres) s **RLS**. Frontend používá **jen ANON key**.
- UI: pevný **7zónový layout** + přepínatelná témata (light/dark/gray).

## 1. Layout (7 zón)
1) **home-button** – návrat na `#/dashboard`, varuje při `unsaved=true`.
2) **breadcrumbs** – „Hlavní panel › …“ (modul/dlaždice/form).
3) **module-tiles** – dlaždice/sekce aktuálního modulu (rychlé přepínače).
4) **header-actions** – globální akce (můj účet, notifikace, hledat, help…).
5) **main-action-btn** – kontextové primární tlačítko dle modulu/sekce.
6) **content** – pracovní plocha (seznamy, formuláře, grafy…).
7) **sidebar** – dynamický seznam modulů podle centrální konfigurace.

## 2. Moduly a routing
- Název modulu: `<ORD>-<slug>` (např. `030-pronajimatel`).
- Složka: `src/modules/<ORD>-<slug>/`
- Povinné soubory:
  - `module.config.js` – metadata + seznam `tiles[]` a `forms[]` (lazy import).
  - `index.js` – funkce `renderModule(root, route)` a `getConfig()`.
  - `tiles/*.js` – export `render(root, params)`.
  - `forms/*.js` – export `render(root, params)`; během editace nastavuje `unsaved=true`.
- **Routy**:
  - Modul: `#/m/<mod>`
  - Dlaždice: `#/m/<mod>/t/<tile>`
  - Formulář: `#/m/<mod>/f/<form>` (+ `?id=...`)
- **Unsaved guard**: při přechodu, pokud `unsaved=true` → confirm.

## 3. Sidebar (dynamicky)
- Žádné ruční psaní HTML. Sidebar se generuje z **`src/app/modules.index.js`**:
  ```js
  export const MODULES = [
    { id:'010-user-mgmt',   title:'Správa uživatelů', icon:'👥' },
    { id:'020-my-account',  title:'Můj účet',         icon:'👤' },
    { id:'030-pronajimatel',title:'Pronajímatel',     icon:'🏠' },
    // …
  ]
## Ikony modulů
- Každý modul má SVG v `docs/icons/<ID>.svg` (např. `030-pronajimatel.svg`).
- Pokud SVG chybí, použije se fallback emoji definovaný v `src/app/modules.index.js`.

## Akce (tlačítka)
- Centrální katalog akcí: `src/app/action-catalog.js` (odpovídá `docs/common-actions.md`).
- Vykreslení tlačítka: `src/ui/actions.js` → `actionBtn('add'|'edit'|...)`.
- V headeru a u kontextových akcí používat výhradně tento katalog.
- Ikony akcí (volitelné SVG): `docs/icons/actions/<id>.svg`. Když chybí, použije se emoji fallback.
