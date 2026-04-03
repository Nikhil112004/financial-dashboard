import SummaryCards from './SummaryCards';
import TrendChart from './TrendChart';
import CategoryChart from './CategoryChart';
import RecentTransactions from './RecentTransactions';

export default function Dashboard() {
  return (
    <div className="space-y-5">
      <SummaryCards />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <TrendChart />
        </div>
        <div className="lg:col-span-2">
          <CategoryChart />
        </div>
      </div>

      <RecentTransactions />
    </div>
  );
}
