import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Search, SlidersHorizontal, ArrowUpDown, Pencil, Trash2,
  ChevronUp, ChevronDown, Download, X
} from 'lucide-react';
import { setFilter, deleteTransaction, setEditingId } from '../../store/slices/transactionsSlice';
import { openModal, addToast } from '../../store/slices/uiSlice';
import {
  useFilteredTransactions, useFilters, useTheme,
  useIsAdmin, useAllTransactions
} from '../../hooks/useAppHooks';
import { categories, categoryColors, categoryIcons } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../utils/formatters';

const PAGE_SIZE = 15;

function ExportButton({ dark }) {
  const allTxns = useAllTransactions();
  const filtered = useFilteredTransactions();

  const exportCSV = () => {
    const headers = ['Date', 'Merchant', 'Category', 'Type', 'Amount', 'Status', 'Note'];
    const rows = filtered.map(t => [
      t.date, t.merchant, t.category, t.type, t.amount, t.status, t.note || ''
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'transactions.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={exportCSV}
      title="Export CSV"
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
        ${dark
          ? 'border-white/10 text-white/50 hover:text-white hover:bg-white/5'
          : 'border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`}
    >
      <Download size={13} /> Export
    </button>
  );
}

export default function TransactionsPage() {
  const dispatch  = useDispatch();
  const txns      = useFilteredTransactions();
  const filters   = useFilters();
  const dark      = useTheme() === 'dark';
  const isAdmin   = useIsAdmin();
  const [page, setPage]               = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const totalPages = Math.ceil(txns.length / PAGE_SIZE);
  const paged      = txns.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const setF = (k, v) => { dispatch(setFilter({ [k]: v })); setPage(1); };

  const toggleSort = (col) => {
    if (filters.sortBy === col) {
      setF('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      dispatch(setFilter({ sortBy: col, sortOrder: 'desc' }));
      setPage(1);
    }
  };

  const SortIcon = ({ col }) => {
    if (filters.sortBy !== col) return <ArrowUpDown size={12} className="opacity-30" />;
    return filters.sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  };

  const handleDelete = (id) => {
    dispatch(deleteTransaction(id));
    dispatch(addToast({ type: 'success', message: 'Transaction deleted.' }));
  };

  const handleEdit = (id) => {
    dispatch(setEditingId(id));
    dispatch(openModal());
  };

  const inputCls = `px-3 py-1.5 rounded-lg text-sm outline-none transition-colors
    ${dark
      ? 'bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-brand-500'
      : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-brand-500 shadow-sm'
    }`;

  const thCls = `px-4 py-3 text-left text-xs font-medium uppercase tracking-wider
    ${dark ? 'text-white/30' : 'text-gray-400'}`;

  const activeFiltersCount = [
    filters.category !== 'all',
    filters.type !== 'all',
    filters.search !== '',
  ].filter(Boolean).length;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${dark ? 'text-white/30' : 'text-gray-400'}`} />
          <input
            type="text"
            placeholder="Search transactions…"
            value={filters.search}
            onChange={e => setF('search', e.target.value)}
            className={`${inputCls} pl-8 w-full`}
          />
          {filters.search && (
            <button onClick={() => setF('search', '')}
              className={`absolute right-2 top-1/2 -translate-y-1/2 ${dark ? 'text-white/30 hover:text-white' : 'text-gray-300 hover:text-gray-600'}`}>
              <X size={14} />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(f => !f)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors relative
            ${showFilters || activeFiltersCount > 0
              ? 'border-brand-500 text-brand-400 bg-brand-500/5'
              : dark
                ? 'border-white/10 text-white/50 hover:text-white hover:bg-white/5'
                : 'border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
        >
          <SlidersHorizontal size={13} /> Filters
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-500 text-white text-xs rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>

        <ExportButton dark={dark} />

        <span className={`ml-auto text-xs ${dark ? 'text-white/30' : 'text-gray-400'}`}>
          {txns.length} result{txns.length !== 1 ? 's' : ''}
        </span>
      </div>

      {showFilters && (
        <div className={`flex flex-wrap gap-3 p-4 rounded-xl border animate-slide-up
          ${dark ? 'bg-white/[0.02] border-white/5' : 'bg-gray-50/80 border-gray-100'}`}>

          <div>
            <label className={`block text-xs mb-1 ${dark ? 'text-white/30' : 'text-gray-400'}`}>Type</label>
            <div className={`flex gap-0.5 p-0.5 rounded-lg ${dark ? 'bg-white/5' : 'bg-white border border-gray-200'}`}>
              {['all', 'income', 'expense'].map(t => (
                <button key={t} onClick={() => setF('type', t)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all capitalize
                    ${filters.type === t
                      ? 'bg-brand-500 text-white'
                      : dark ? 'text-white/40 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                    }`}>{t}</button>
              ))}
            </div>
          </div>

          <div>
            <label className={`block text-xs mb-1 ${dark ? 'text-white/30' : 'text-gray-400'}`}>Category</label>
            <select value={filters.category} onChange={e => setF('category', e.target.value)}
              className={`${inputCls} pr-8`}
            >
              <option value="all">All categories</option>
              {categories.map(c => <option key={c} value={c}>{categoryIcons[c]} {c}</option>)}
            </select>
          </div>

          <div>
            <label className={`block text-xs mb-1 ${dark ? 'text-white/30' : 'text-gray-400'}`}>Sort by</label>
            <select value={filters.sortBy} onChange={e => setF('sortBy', e.target.value)}
              className={`${inputCls} pr-8`}
            >
              {[['date','Date'],['amount','Amount'],['category','Category'],['merchant','Merchant']].map(([v,l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => dispatch({ type: 'transactions/resetFilters' })}
            className={`self-end px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
              ${dark ? 'text-white/40 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
          >
            Clear all
          </button>
        </div>
      )}

      <div className={`rounded-xl border overflow-hidden ${dark ? 'bg-surface-850 border-white/5' : 'bg-white border-gray-100 shadow-card'}`}>
        {paged.length === 0 ? (
          <div className={`flex flex-col items-center justify-center py-16 ${dark ? 'text-white/30' : 'text-gray-400'}`}>
            <Search size={32} className="mb-3 opacity-50" />
            <p className="text-sm font-medium">No transactions found</p>
            <p className="text-xs mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto hidden sm:block">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${dark ? 'border-white/5' : 'border-gray-50'}`}>
                    <th className={thCls}>
                      <button className="flex items-center gap-1" onClick={() => toggleSort('date')}>
                        Date <SortIcon col="date" />
                      </button>
                    </th>
                    <th className={thCls}>
                      <button className="flex items-center gap-1" onClick={() => toggleSort('merchant')}>
                        Merchant <SortIcon col="merchant" />
                      </button>
                    </th>
                    <th className={thCls}>
                      <button className="flex items-center gap-1" onClick={() => toggleSort('category')}>
                        Category <SortIcon col="category" />
                      </button>
                    </th>
                    <th className={thCls}>Type</th>
                    <th className={`${thCls} text-right`}>
                      <button className="flex items-center gap-1 ml-auto" onClick={() => toggleSort('amount')}>
                        Amount <SortIcon col="amount" />
                      </button>
                    </th>
                    <th className={thCls}>Status</th>
                    {isAdmin && <th className={thCls} />}
                  </tr>
                </thead>
                <tbody>
                  {paged.map((txn, i) => (
                    <tr key={txn.id}
                      className={`border-b last:border-0 transition-colors
                        ${dark ? 'border-white/[0.03] hover:bg-white/[0.02]' : 'border-gray-50 hover:bg-gray-50/50'}`}
                    >
                      <td className={`px-4 py-3 text-xs ${dark ? 'text-white/40' : 'text-gray-400'}`}>
                        {formatDate(txn.date)}
                      </td>
                      <td className="px-4 py-3">
                        <p className={`text-sm font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>{txn.merchant}</p>
                        {txn.note && <p className={`text-xs ${dark ? 'text-white/30' : 'text-gray-400'}`}>{txn.note}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-md font-medium`}
                          style={{
                            background: (categoryColors[txn.category] || '#6b7280') + '18',
                            color: categoryColors[txn.category] || '#6b7280',
                          }}
                        >
                          {categoryIcons[txn.category]} {txn.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                          ${txn.type === 'income'
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-red-500/10 text-red-400'
                          }`}
                        >
                          {txn.type}
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-right text-sm font-mono font-semibold
                        ${txn.type === 'income' ? 'text-green-400' : dark ? 'text-white' : 'text-gray-800'}`}
                      >
                        {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                          ${txn.status === 'completed'
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-yellow-500/10 text-yellow-400'
                          }`}
                        >
                          {txn.status}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => handleEdit(txn.id)}
                              className={`p-1.5 rounded-md transition-colors ${dark ? 'text-white/30 hover:text-white hover:bg-white/5' : 'text-gray-300 hover:text-gray-600 hover:bg-gray-100'}`}>
                              <Pencil size={13} />
                            </button>
                            <button onClick={() => handleDelete(txn.id)}
                              className={`p-1.5 rounded-md transition-colors text-red-400/40 hover:text-red-400 ${dark ? 'hover:bg-red-500/10' : 'hover:bg-red-50'}`}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="sm:hidden divide-y">
              {paged.map(txn => (
                <div key={txn.id} className={`p-4 ${dark ? 'divide-white/5' : 'divide-gray-100'}`}>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                      style={{ background: (categoryColors[txn.category] || '#6b7280') + '20' }}>
                      {categoryIcons[txn.category]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <p className={`text-sm font-medium truncate ${dark ? 'text-white' : 'text-gray-900'}`}>{txn.merchant}</p>
                        <span className={`text-sm font-mono font-semibold flex-shrink-0
                          ${txn.type === 'income' ? 'text-green-400' : dark ? 'text-white' : 'text-gray-800'}`}>
                          {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount, true)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs" style={{ color: categoryColors[txn.category] }}>
                          {categoryIcons[txn.category]} {txn.category}
                        </span>
                        <span className={`text-xs ${dark ? 'text-white/30' : 'text-gray-400'}`}>· {formatDate(txn.date)}</span>
                      </div>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-2 mt-2 ml-12">
                      <button onClick={() => handleEdit(txn.id)}
                        className={`text-xs px-2 py-1 rounded-md transition-colors ${dark ? 'text-white/40 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(txn.id)}
                        className="text-xs px-2 py-1 rounded-md text-red-400/60 hover:text-red-400 transition-colors">
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className={`flex items-center justify-between px-4 py-3 border-t ${dark ? 'border-white/5' : 'border-gray-50'}`}>
                <span className={`text-xs ${dark ? 'text-white/30' : 'text-gray-400'}`}>
                  Page {page} of {totalPages}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-30
                      ${dark ? 'text-white/50 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}>
                    Prev
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let p;
                    if (totalPages <= 5) p = i + 1;
                    else if (page <= 3) p = i + 1;
                    else if (page >= totalPages - 2) p = totalPages - 4 + i;
                    else p = page - 2 + i;
                    return (
                      <button key={p} onClick={() => setPage(p)}
                        className={`w-7 h-7 rounded-lg text-xs font-medium transition-all
                          ${p === page
                            ? 'bg-brand-500 text-white'
                            : dark ? 'text-white/40 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                      >{p}</button>
                    );
                  })}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-30
                      ${dark ? 'text-white/50 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}>
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
