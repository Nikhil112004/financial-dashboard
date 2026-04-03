import { useDispatch } from 'react-redux';
import {
  LayoutDashboard, ArrowLeftRight, Lightbulb,
  ChevronLeft, ChevronRight, Moon, Sun,
  Shield, Eye, RefreshCw
} from 'lucide-react';
import { setActiveTab, toggleTheme, setRole, toggleSidebar } from '../../store/slices/uiSlice';
import { resetData } from '../../store/slices/transactionsSlice';
import { useActiveTab, useTheme, useRole, useSidebarOpen } from '../../hooks/useAppHooks';
import { addToast } from '../../store/slices/uiSlice';

const navItems = [
  { id: 'dashboard',    label: 'Dashboard',     icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions',  icon: ArrowLeftRight   },
  { id: 'insights',     label: 'Insights',      icon: Lightbulb        },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const activeTab   = useActiveTab();
  const theme       = useTheme();
  const role        = useRole();
  const sidebarOpen = useSidebarOpen();

  const dark = theme === 'dark';

  const handleReset = () => {
    dispatch(resetData());
    dispatch(addToast({ type: 'success', message: 'Data reset to defaults.' }));
  };

  return (
    <aside className={`
      flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out z-30
      ${sidebarOpen ? 'w-60' : 'w-16'}
      ${dark ? 'bg-surface-900 border-r border-white/5' : 'bg-white border-r border-gray-100'}
    `}>
      <div className={`flex items-center gap-3 px-4 h-16 border-b ${dark ? 'border-white/5' : 'border-gray-100'}`}>
        <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center flex-shrink-0 shadow-glow">
          <span className="text-white font-bold text-sm font-mono">₹</span>
        </div>
        {sidebarOpen && (
          <span className={`font-display font-semibold text-base tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
            FinTrack
          </span>
        )}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className={`ml-auto p-1 rounded-md transition-colors ${dark ? 'text-white/40 hover:text-white/80 hover:bg-white/5' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
        >
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => dispatch(setActiveTab(id))}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                ${active
                  ? 'bg-brand-500 text-white shadow-glow'
                  : dark
                    ? 'text-white/50 hover:text-white hover:bg-white/5'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
              title={!sidebarOpen ? label : undefined}
            >
              <Icon size={18} className="flex-shrink-0" />
              {sidebarOpen && <span>{label}</span>}
            </button>
          );
        })}
      </nav>

      <div className={`p-3 space-y-2 border-t ${dark ? 'border-white/5' : 'border-gray-100'}`}>
        {sidebarOpen ? (
          <div className={`rounded-lg p-2 ${dark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-xs font-medium mb-1.5 px-1 ${dark ? 'text-white/30' : 'text-gray-400'}`}>ROLE</p>
            <div className="flex gap-1">
              {['admin', 'viewer'].map(r => (
                <button
                  key={r}
                  onClick={() => dispatch(setRole(r))}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded text-xs font-medium transition-all
                    ${role === r
                      ? r === 'admin' ? 'bg-brand-500 text-white' : 'bg-blue-500 text-white'
                      : dark ? 'text-white/40 hover:text-white/70' : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  {r === 'admin' ? <Shield size={11} /> : <Eye size={11} />}
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <button
            onClick={() => dispatch(setRole(role === 'admin' ? 'viewer' : 'admin'))}
            title={`Role: ${role}`}
            className={`w-full flex items-center justify-center p-2 rounded-lg transition-colors
              ${role === 'admin'
                ? 'text-brand-400 hover:bg-brand-500/10'
                : 'text-blue-400 hover:bg-blue-500/10'
              }`}
          >
            {role === 'admin' ? <Shield size={16} /> : <Eye size={16} />}
          </button>
        )}

        <div className="flex gap-1">
          <button
            onClick={() => dispatch(toggleTheme())}
            title="Toggle theme"
            className={`flex-1 flex items-center justify-center p-2 rounded-lg transition-colors
              ${dark ? 'text-white/40 hover:text-white/70 hover:bg-white/5' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button
            onClick={handleReset}
            title="Reset data"
            className={`flex-1 flex items-center justify-center p-2 rounded-lg transition-colors
              ${dark ? 'text-white/40 hover:text-white/70 hover:bg-white/5' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
