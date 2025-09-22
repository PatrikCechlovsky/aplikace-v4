// src/app/state.js
const state = {
  current: 'dashboard', // id modulu nebo 'dashboard'
  unsaved: false,
};

export const getState   = () => state;
export const setModule  = (id) => { state.current = id; };
export const setUnsaved = (v)  => { state.unsaved = !!v; };

// varování při odchodu, pokud jsou neuložené změny
window.addEventListener('beforeunload', (e) => {
  if (state.unsaved) { e.preventDefault(); e.returnValue = ''; }
});
