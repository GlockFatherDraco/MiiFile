// ┌─────────────┐
// │ Storage     │
// └─────────────┘
export const get = key => localStorage.getItem(key);
export const set = (key, val) => localStorage.setItem(key, val);
export const remove = key => localStorage.removeItem(key);
export const getJSON = key => {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
};
export const setJSON = (key, val) => localStorage.setItem(key, JSON.stringify(val)); 