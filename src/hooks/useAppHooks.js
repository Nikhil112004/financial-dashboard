import { useSelector, useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { subDays, subMonths, parseISO, isAfter, format, startOfMonth } from 'date-fns';

export const useRole = () => useSelector(s => s.ui.role);
export const useTheme = () => useSelector(s => s.ui.theme);
export const useActiveTab = () => useSelector(s => s.ui.activeTab);
export const useSidebarOpen = () => useSelector(s => s.ui.sidebarOpen);
export const useModal = () => useSelector(s => s.ui.modalOpen);
export const useToasts = () => useSelector(s => s.ui.toasts);
export const useIsAdmin = () => useSelector(s => s.ui.role === 'admin');

export const useAllTransactions = () => useSelector(s => s.transactions.items);
export const useFilters = () => useSelector(s => s.transactions.filters);
export const useEditingId = () => useSelector(s => s.transactions.editingId);

const getDateThreshold = (range) => {
  const today = new Date();
  switch (range) {
    case '7d':  return subDays(today, 7);
    case '1m':  return subMonths(today, 1);
    case '3m':  return subMonths(today, 3);
    case '6m':  return subMonths(today, 6);
    case '1y':  return subMonths(today, 12);
    default:    return subMonths(today, 6);
  }
};

export const useFilteredTransactions = () => {
  const items = useAllTransactions();
  const filters = useFilters();

  return useMemo(() => {
    let result = [...items];
    const threshold = getDateThreshold(filters.dateRange);

    result = result.filter(t => isAfter(parseISO(t.date), threshold));

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(t =>
        t.merchant.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.note?.toLowerCase().includes(q)
      );
    }

    if (filters.category !== 'all') result = result.filter(t => t.category === filters.category);
    if (filters.type !== 'all') result = result.filter(t => t.type === filters.type);

    result.sort((a, b) => {
      let valA, valB;
      if (filters.sortBy === 'amount') { valA = a.amount; valB = b.amount; }
      else if (filters.sortBy === 'category') { valA = a.category; valB = b.category; }
      else if (filters.sortBy === 'merchant') { valA = a.merchant; valB = b.merchant; }
      else { valA = a.date; valB = b.date; }

      if (valA < valB) return filters.sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [items, filters]);
};

export const useSummaryStats = () => {
  const items = useAllTransactions();
  const filters = useFilters();

  return useMemo(() => {
    const threshold = getDateThreshold(filters.dateRange);
    const filtered = items.filter(t => isAfter(parseISO(t.date), threshold));

    const income   = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const balance  = income - expenses;
    const savings  = income > 0 ? ((income - expenses) / income) * 100 : 0;

    return { income, expenses, balance, savings, count: filtered.length };
  }, [items, filters]);
};

export const useMonthlyTrend = () => {
  const items = useAllTransactions();

  return useMemo(() => {
    const months = {};
    const threshold = subMonths(new Date(), 6);

    items.filter(t => isAfter(parseISO(t.date), threshold)).forEach(t => {
      const key = format(parseISO(t.date), 'MMM yy');
      if (!months[key]) months[key] = { month: key, income: 0, expenses: 0, balance: 0 };
      if (t.type === 'income')   months[key].income   += t.amount;
      if (t.type === 'expense')  months[key].expenses += t.amount;
    });

    return Object.values(months).map(m => ({
      ...m,
      balance: m.income - m.expenses,
    })).sort((a, b) => {
      const parse = s => { const [mon, yr] = s.split(' '); return new Date(`${mon} 20${yr}`); };
      return parse(a.month) - parse(b.month);
    });
  }, [items]);
};

export const useCategoryBreakdown = () => {
  const items = useAllTransactions();
  const filters = useFilters();

  return useMemo(() => {
    const threshold = getDateThreshold(filters.dateRange);
    const expenses = items.filter(t =>
      t.type === 'expense' && isAfter(parseISO(t.date), threshold)
    );

    const totals = {};
    expenses.forEach(t => {
      totals[t.category] = (totals[t.category] || 0) + t.amount;
    });

    const total = Object.values(totals).reduce((s, v) => s + v, 0);
    return Object.entries(totals)
      .map(([category, amount]) => ({ category, amount, pct: total > 0 ? (amount / total) * 100 : 0 }))
      .sort((a, b) => b.amount - a.amount);
  }, [items, filters]);
};

export const useInsights = () => {
  const items = useAllTransactions();

  return useMemo(() => {
    const now = new Date();
    const thisMonth = items.filter(t => {
      const d = parseISO(t.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const lastMonth = items.filter(t => {
      const d = parseISO(t.date);
      const lm = subMonths(now, 1);
      return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear();
    });

    const thisExpenses  = thisMonth.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const lastExpenses  = lastMonth.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const thisIncome    = thisMonth.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const lastIncome    = lastMonth.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);

    const catTotals = {};
    items.filter(t => t.type === 'expense' && isAfter(parseISO(t.date), subMonths(now, 1))).forEach(t => {
      catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
    });
    const topCategory = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];

    const expenseDelta = lastExpenses > 0 ? ((thisExpenses - lastExpenses) / lastExpenses) * 100 : 0;
    const incomeDelta  = lastIncome   > 0 ? ((thisIncome  - lastIncome)   / lastIncome)   * 100 : 0;

    return {
      thisExpenses, lastExpenses, thisIncome, lastIncome,
      expenseDelta, incomeDelta,
      topCategory: topCategory ? { name: topCategory[0], amount: topCategory[1] } : null,
      avgDailySpend: thisExpenses / now.getDate(),
    };
  }, [items]);
};

export const useAppDispatch = useDispatch;
