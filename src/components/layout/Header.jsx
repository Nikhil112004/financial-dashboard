import { useDispatch } from 'react-redux';
import { Plus, Menu, Shield, Eye } from 'lucide-react';
import { openModal, toggleSidebar } from '../../store/slices/uiSlice';
import { useActiveTab, useTheme, useRole, useIsAdmin } from '../../hooks/useAppHooks';
import DateRangePicker from '../common/DateRangePicker';

const tabTitles = {
  dashboard:    'Dashboard',
  transactions: 'Transactions',
  insights:     'Insights',
};

export default function Header() {
  const dispatch   = useDispatch();
  const activeTab  = useActiveTab();
  const theme      = useTheme();
  const role       = useRole();
  const isAdmin    = useIsAdmin();
  const dark       = theme === 'dark';

  return (
    <header className={`
      flex items-center gap-4 px-6 h-16 border-b flex-shrink-0
      ${dark ? 'bg-surface-900/80 backdrop-blur border-white/5' : 'bg-white/80 backdrop-blur border-gray-100'}
    `}>
      <button
        onClick={() => dispatch(toggleSidebar())}
        className={`lg:hidden p-1.5 rounded-md ${dark ? 'text-white/50 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <Menu size={20} />
      </button>

      <div>
        <h1 className={`text-lg font-display font-semibold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
          {tabTitles[activeTab]}
        </h1>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <DateRangePicker />

        <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
          ${role === 'admin'
            ? 'bg-brand-500/10 text-brand-400'
            : 'bg-blue-500/10 text-blue-400'
          }`}
        >
          {role === 'admin' ? <Shield size={11} /> : <Eye size={11} />}
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </div>

        {isAdmin && (
          <button
            onClick={() => dispatch(openModal())}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors shadow-glow"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Add</span>
          </button>
        )}
      </div>
    </header>
  );
}
