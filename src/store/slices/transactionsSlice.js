import { createSlice, nanoid } from '@reduxjs/toolkit';
import { generateTransactions } from '../../data/mockData';
import { format } from 'date-fns';

const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem('fin_transactions');
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
};

const saveToStorage = (transactions) => {
  try { localStorage.setItem('fin_transactions', JSON.stringify(transactions)); } catch {}
};

const initialTransactions = loadFromStorage() || generateTransactions();

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: {
    items: initialTransactions,
    filters: {
      search: '',
      category: 'all',
      type: 'all',
      dateRange: '6m',
      sortBy: 'date',
      sortOrder: 'desc',
    },
    editingId: null,
  },
  reducers: {
    addTransaction: (state, action) => {
      const txn = {
        id: nanoid(),
        date: format(new Date(), 'yyyy-MM-dd'),
        status: 'completed',
        note: '',
        ...action.payload,
        amount: parseFloat(action.payload.amount),
      };
      state.items.unshift(txn);
      saveToStorage(state.items);
    },
    updateTransaction: (state, action) => {
      const idx = state.items.findIndex(t => t.id === action.payload.id);
      if (idx !== -1) {
        state.items[idx] = { ...state.items[idx], ...action.payload, amount: parseFloat(action.payload.amount) };
        saveToStorage(state.items);
      }
      state.editingId = null;
    },
    deleteTransaction: (state, action) => {
      state.items = state.items.filter(t => t.id !== action.payload);
      saveToStorage(state.items);
    },
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setEditingId: (state, action) => {
      state.editingId = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {
        search: '',
        category: 'all',
        type: 'all',
        dateRange: '6m',
        sortBy: 'date',
        sortOrder: 'desc',
      };
    },
    resetData: (state) => {
      state.items = generateTransactions();
      saveToStorage(state.items);
    },
  },
});

export const {
  addTransaction, updateTransaction, deleteTransaction,
  setFilter, setEditingId, resetFilters, resetData,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
