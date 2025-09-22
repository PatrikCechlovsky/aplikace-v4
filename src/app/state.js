const state = {
  current: 'dashboard',
  unsaved: false,
};
export const getState = () => state;
export const setModule = (id) => { state.current = id; };
export const setUnsaved = (v) => { state.unsaved = !!v; };

// varování při odchodu (reload, zavření)
window.addEventListener('beforeunload', (e) => {
  if (state.unsaved) { e.preventDefault(); e.returnValue = ''; }
});
