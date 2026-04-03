import { useDispatch } from 'react-redux';
import { setFilter } from '../../store/slices/transactionsSlice';
import { useFilters, useTheme } from '../../hooks/useAppHooks';

const ranges = [
  { label: '7D', value: '7d' },
  { label: '1M', value: '1m' },
  { label: '3M', value: '3m' },
  { label: '6M', value: '6m' },
  { label: '1Y', value: '1y' },
];

export default function DateRangePicker() {
  const dispatch = useDispatch();
  const { dateRange } = useFilters();
  const dark = useTheme() === 'dark';

  return (
    <div className={`flex items-center gap-0.5 p-0.5 rounded-lg ${dark ? 'bg-white/5' : 'bg-gray-100'}`}>
      {ranges.map(r => (
        <button
          key={r.value}
          onClick={() => dispatch(setFilter({ dateRange: r.value }))}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all
            ${dateRange === r.value
              ? 'bg-brand-500 text-white shadow-sm'
              : dark ? 'text-white/50 hover:text-white' : 'text-gray-500 hover:text-gray-900'
            }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
