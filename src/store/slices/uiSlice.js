import { createSlice } from '@reduxjs/toolkit';

const loadTheme = () => {
  try { return localStorage.getItem('fin_theme') || 'dark'; } catch { return 'dark'; }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    role: 'admin',          
    theme: loadTheme(),    
    activeTab: 'dashboard', 
    sidebarOpen: true,
    modalOpen: false,
    toasts: [],
  },
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('fin_theme', state.theme); } catch {}
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    openModal: (state) => { state.modalOpen = true; },
    closeModal: (state) => { state.modalOpen = false; },
    addToast: (state, action) => {
      state.toasts.push({ id: Date.now(), ...action.payload });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
  },
});

export const {
  setRole, toggleTheme, setActiveTab,
  toggleSidebar, openModal, closeModal,
  addToast, removeToast,
} = uiSlice.actions;

export default uiSlice.reducer;
