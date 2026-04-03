import { useDispatch } from 'react-redux';
import { ArrowRight } from 'lucide-react';
import { setActiveTab } from '../../store/slices/uiSlice';
import { useAllTransactions, useTheme } from '../../hooks/useAppHooks';
import { categoryColors, categoryIcons } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function RecentTransactions() {
  const dispatch = useDispatch();
  const allTxns = useAllTransactions();
  const dark = useTheme() === 'dark';
  const recent = allTxns.slice(0, 6);

  return (
    <div className={`rounded-xl border animate-slide-up ${dark ? 'bg-surface-850 border-white/5' : 'bg-white border-gray-100 shadow-card'}`}>
      <div className={`flex items-center justify-between px-5 py-4 border-b ${dark ? 'border-white/5' : 'border-gray-50'}`}>
        <div>
          <h2 className={`text-sm font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>Recent Transactions</h2>
        </div>
        <button
          onClick={() => dispatch(setActiveTab('transactions'))}
          className={`flex items-center gap-1 text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors`}
        >
          View all <ArrowRight size={12} />
        </button>
      </div>

      <div className="divide-y divide-dashed">
        {recent.length === 0 ? (
          <p className={`text-center py-8 text-sm ${dark ? 'text-white/30' : 'text-gray-400'}`}>No transactions yet</p>
        ) : (
          recent.map(txn => (
            <div key={txn.id} className={`flex items-center gap-3 px-5 py-3 transition-colors
              ${dark ? 'divide-white/5 hover:bg-white/[0.02]' : 'divide-gray-50 hover:bg-gray-50/50'}`}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                style={{ background: (categoryColors[txn.category] || '#6b7280') + '20' }}
              >
                {categoryIcons[txn.category] || '💰'}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium truncate ${dark ? 'text-white' : 'text-gray-900'}`}>
                  {txn.merchant}
                </p>
                <p className={`text-xs truncate ${dark ? 'text-white/30' : 'text-gray-400'}`}>
                  {txn.category} · {formatDate(txn.date)}
                </p>
              </div>
              <span className={`text-xs font-mono font-semibold flex-shrink-0
                ${txn.type === 'income' ? 'text-green-400' : dark ? 'text-white/80' : 'text-gray-800'}`}
              >
                {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount, true)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
