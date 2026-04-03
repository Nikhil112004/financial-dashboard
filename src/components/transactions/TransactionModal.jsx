import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { X } from 'lucide-react';
import { addTransaction, updateTransaction } from '../../store/slices/transactionsSlice';
import { closeModal, addToast } from '../../store/slices/uiSlice';
import { useModal, useTheme, useEditingId, useAllTransactions } from '../../hooks/useAppHooks';
import { categories, categoryIcons } from '../../data/mockData';
import { format } from 'date-fns';

const expenseCategories = categories.filter(c => !['Salary', 'Freelance', 'Investment'].includes(c));
const incomeCategories  = ['Salary', 'Freelance', 'Investment'];

export default function TransactionModal() {
  const dispatch   = useDispatch();
  const isOpen     = useModal();
  const dark       = useTheme() === 'dark';
  const editingId  = useEditingId();
  const allTxns    = useAllTransactions();

  const editing = editingId ? allTxns.find(t => t.id === editingId) : null;

  const [form, setForm] = useState({
    type: 'expense', category: 'Food & Dining',
    amount: '', merchant: '', note: '',
    date: format(new Date(), 'yyyy-MM-dd'),
  });

  useEffect(() => {
    if (editing) {
      setForm({
        type: editing.type,
        category: editing.category,
        amount: editing.amount.toString(),
        merchant: editing.merchant,
        note: editing.note || '',
        date: editing.date,
      });
    } else {
      setForm({
        type: 'expense', category: 'Food & Dining',
        amount: '', merchant: '', note: '',
        date: format(new Date(), 'yyyy-MM-dd'),
      });
    }
  }, [editing, isOpen]);

  const catList = form.type === 'income' ? incomeCategories : expenseCategories;

  const set = (k, v) => setForm(f => ({
    ...f,
    [k]: v,
    ...(k === 'type' ? { category: v === 'income' ? 'Salary' : 'Food & Dining' } : {}),
  }));

  const handleSubmit = () => {
    if (!form.amount || !form.merchant) return;
    if (editing) {
      dispatch(updateTransaction({ id: editing.id, ...form }));
      dispatch(addToast({ type: 'success', message: 'Transaction updated.' }));
    } else {
      dispatch(addTransaction(form));
      dispatch(addToast({ type: 'success', message: 'Transaction added.' }));
    }
    dispatch(closeModal());
  };

  if (!isOpen) return null;

  const inputCls = `w-full px-3 py-2 rounded-lg text-sm outline-none transition-colors
    ${dark
      ? 'bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-brand-500'
      : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-brand-500'
    }`;

  const labelCls = `block text-xs font-medium mb-1.5 ${dark ? 'text-white/50' : 'text-gray-500'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => dispatch(closeModal())} />
      <div className={`relative w-full max-w-md rounded-2xl border shadow-2xl animate-slide-up
        ${dark ? 'bg-surface-850 border-white/10' : 'bg-white border-gray-200'}`}
      >
        <div className={`flex items-center justify-between px-5 py-4 border-b ${dark ? 'border-white/5' : 'border-gray-100'}`}>
          <h2 className={`font-display font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>
            {editing ? 'Edit Transaction' : 'New Transaction'}
          </h2>
          <button onClick={() => dispatch(closeModal())}
            className={`p-1 rounded-md transition-colors ${dark ? 'text-white/40 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}>
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className={labelCls}>Type</label>
            <div className={`flex gap-1 p-1 rounded-lg ${dark ? 'bg-white/5' : 'bg-gray-100'}`}>
              {['expense', 'income'].map(t => (
                <button key={t} onClick={() => set('type', t)}
                  className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all capitalize
                    ${form.type === t
                      ? t === 'income' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      : dark ? 'text-white/40 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                    }`}
                >{t}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Amount (₹)</label>
              <input type="number" placeholder="0.00" value={form.amount}
                onChange={e => set('amount', e.target.value)}
                className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Date</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
                className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Merchant / Description</label>
            <input type="text" placeholder="e.g., Swiggy, Amazon…" value={form.merchant}
              onChange={e => set('merchant', e.target.value)} className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Category</label>
            <div className="grid grid-cols-3 gap-1.5">
              {catList.map(cat => (
                <button key={cat} onClick={() => set('category', cat)}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-all text-left
                    ${form.category === cat
                      ? 'bg-brand-500 text-white'
                      : dark ? 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10' : 'bg-gray-50 text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <span>{categoryIcons[cat]}</span>
                  <span className="truncate">{cat}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelCls}>Note (optional)</label>
            <input type="text" placeholder="Add a note…" value={form.note}
              onChange={e => set('note', e.target.value)} className={inputCls} />
          </div>
        </div>

        <div className={`px-5 pb-5 flex gap-2`}>
          <button onClick={() => dispatch(closeModal())}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors border
              ${dark ? 'border-white/10 text-white/50 hover:text-white hover:bg-white/5' : 'border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
            Cancel
          </button>
          <button onClick={handleSubmit}
            disabled={!form.amount || !form.merchant}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white transition-colors">
            {editing ? 'Update' : 'Add Transaction'}
          </button>
        </div>
      </div>
    </div>
  );
}
