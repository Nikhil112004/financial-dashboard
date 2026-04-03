import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';
import TransactionsPage from './components/transactions/TransactionsPage';
import InsightsPage from './components/insights/InsightsPage';
import TransactionModal from './components/transactions/TransactionModal';
import ToastContainer from './components/common/Toast';

export default function App() {
  const theme     = useSelector(s => s.ui.theme);
  const activeTab = useSelector(s => s.ui.activeTab);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const dark = theme === 'dark';

  return (
    <div className={`flex h-screen overflow-hidden font-body ${dark ? 'bg-surface-950' : 'bg-gray-50'}`}>
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header />

        <main className={`flex-1 overflow-y-auto p-5 lg:p-6 ${dark ? '' : ''}`}>
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard'    && <Dashboard />}
            {activeTab === 'transactions' && <TransactionsPage />}
            {activeTab === 'insights'     && <InsightsPage />}
          </div>
        </main>
      </div>

      <TransactionModal />
      <ToastContainer />
    </div>
  );
}
