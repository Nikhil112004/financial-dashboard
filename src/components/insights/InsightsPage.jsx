import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';
import {
  TrendingUp, TrendingDown, Zap, Award, AlertTriangle, CheckCircle
} from 'lucide-react';
import {
  useInsights, useCategoryBreakdown, useMonthlyTrend,
  useTheme, useSummaryStats
} from '../../hooks/useAppHooks';
import { categoryColors, categoryIcons } from '../../data/mockData';
import { formatCurrency, formatPct } from '../../utils/formatters';

function InsightCard({ icon: Icon, color, title, value, sub, dark }) {
  const colorMap = {
    green:  { bg: 'bg-green-500/10',  text: 'text-green-400',  ring: 'ring-green-500/20'  },
    red:    { bg: 'bg-red-500/10',    text: 'text-red-400',    ring: 'ring-red-500/20'    },
    amber:  { bg: 'bg-amber-500/10',  text: 'text-amber-400',  ring: 'ring-amber-500/20'  },
    brand:  { bg: 'bg-brand-500/10',  text: 'text-brand-400',  ring: 'ring-brand-500/20'  },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', ring: 'ring-purple-500/20' },
  };
  const c = colorMap[color] || colorMap.brand;

  return (
    <div className={`rounded-xl p-5 border animate-slide-up
      ${dark ? 'bg-surface-850 border-white/5' : 'bg-white border-gray-100 shadow-card'}`}>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ring-1 mb-3 ${c.bg} ${c.ring}`}>
        <Icon size={17} className={c.text} />
      </div>
      <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${dark ? 'text-white/30' : 'text-gray-400'}`}>{title}</p>
      <p className={`text-xl font-display font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{value}</p>
      {sub && <p className={`text-xs mt-1 ${dark ? 'text-white/30' : 'text-gray-400'}`}>{sub}</p>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label, dark }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={`rounded-xl p-3 border text-sm shadow-xl ${dark ? 'bg-surface-850 border-white/10 text-white' : 'bg-white border-gray-200'}`}>
      <p className={`font-medium mb-2 ${dark ? 'text-white/50' : 'text-gray-500'}`}>{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
          <span className={dark ? 'text-white/50' : 'text-gray-400'}>{p.name}</span>
          <span className="ml-2 font-mono">{formatCurrency(p.value, true)}</span>
        </div>
      ))}
    </div>
  );
};

export default function InsightsPage() {
  const insights   = useInsights();
  const breakdown  = useCategoryBreakdown();
  const monthly    = useMonthlyTrend();
  const dark       = useTheme() === 'dark';
  const stats      = useSummaryStats();

  const expenseTrend  = insights.expenseDelta;
  const incomeTrend   = insights.incomeDelta;
  const savingsRate   = stats.savings;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <InsightCard
          icon={expenseTrend >= 0 ? TrendingUp : TrendingDown}
          color={expenseTrend >= 0 ? 'red' : 'green'}
          title="Spending vs Last Month"
          value={formatPct(expenseTrend)}
          sub={`${expenseTrend >= 0 ? 'Up' : 'Down'} from ${formatCurrency(insights.lastExpenses, true)}`}
          dark={dark}
        />
        <InsightCard
          icon={incomeTrend >= 0 ? TrendingUp : TrendingDown}
          color={incomeTrend >= 0 ? 'green' : 'red'}
          title="Income vs Last Month"
          value={formatPct(incomeTrend)}
          sub={`From ${formatCurrency(insights.lastIncome, true)}`}
          dark={dark}
        />
        <InsightCard
          icon={Award}
          color="brand"
          title="Top Spending Category"
          value={insights.topCategory ? insights.topCategory.name : 'N/A'}
          sub={insights.topCategory ? formatCurrency(insights.topCategory.amount, true) + ' this month' : ''}
          dark={dark}
        />
        <InsightCard
          icon={Zap}
          color="amber"
          title="Avg Daily Spend"
          value={formatCurrency(insights.avgDailySpend, true)}
          sub="This month"
          dark={dark}
        />
      </div>


      <div className={`rounded-xl p-5 border ${dark ? 'bg-surface-850 border-white/5' : 'bg-white border-gray-100 shadow-card'}`}>
        <div className="mb-4">
          <h2 className={`text-sm font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>Monthly Comparison</h2>
          <p className={`text-xs mt-0.5 ${dark ? 'text-white/30' : 'text-gray-400'}`}>Income vs Expenses per month</p>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthly} barGap={4} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'} vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: dark ? 'rgba(255,255,255,0.3)' : '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={v => formatCurrency(v, true)} tick={{ fontSize: 10, fill: dark ? 'rgba(255,255,255,0.3)' : '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip dark={dark} />} />
            <Bar dataKey="income"   name="Income"   fill="#14b8a6" radius={[4,4,0,0]} maxBarSize={28} />
            <Bar dataKey="expenses" name="Expenses" fill="#f97316" radius={[4,4,0,0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        <div className={`rounded-xl p-5 border ${dark ? 'bg-surface-850 border-white/5' : 'bg-white border-gray-100 shadow-card'}`}>
          <h2 className={`text-sm font-semibold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>Top Spending Categories</h2>
          {breakdown.length === 0 ? (
            <p className={`text-sm ${dark ? 'text-white/30' : 'text-gray-400'}`}>No expense data in range</p>
          ) : (
            <div className="space-y-3">
              {breakdown.slice(0, 7).map((item, i) => (
                <div key={item.category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-medium flex items-center gap-1.5 ${dark ? 'text-white/70' : 'text-gray-700'}`}>
                      {categoryIcons[item.category]} {item.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono ${dark ? 'text-white/40' : 'text-gray-400'}`}>
                        {formatCurrency(item.amount, true)}
                      </span>
                      <span className={`text-xs font-medium w-8 text-right ${dark ? 'text-white' : 'text-gray-900'}`}>
                        {item.pct.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div className={`h-1.5 rounded-full overflow-hidden ${dark ? 'bg-white/5' : 'bg-gray-100'}`}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${item.pct}%`,
                        background: categoryColors[item.category] || '#6b7280',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

  
        <div className={`rounded-xl p-5 border ${dark ? 'bg-surface-850 border-white/5' : 'bg-white border-gray-100 shadow-card'}`}>
          <h2 className={`text-sm font-semibold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>Financial Health</h2>
          <div className="space-y-3">
            {[
              {
                label: 'Savings Rate',
                value: `${savingsRate.toFixed(1)}%`,
                ok: savingsRate >= 20,
                msg: savingsRate >= 20 ? 'Healthy — above 20% target' : 'Below recommended 20%',
              },
              {
                label: 'Spending Trend',
                value: formatPct(expenseTrend),
                ok: expenseTrend <= 0,
                msg: expenseTrend <= 0 ? 'Spending decreased this month' : 'Spending increased this month',
              },
              {
                label: 'Income Trend',
                value: formatPct(incomeTrend),
                ok: incomeTrend >= 0,
                msg: incomeTrend >= 0 ? 'Income is growing' : 'Income decreased this month',
              },
              {
                label: 'Expense/Income Ratio',
                value: stats.income > 0 ? `${((stats.expenses / stats.income) * 100).toFixed(0)}%` : 'N/A',
                ok: stats.income > 0 && stats.expenses / stats.income < 0.8,
                msg: stats.income > 0 && stats.expenses / stats.income < 0.8
                  ? 'Within healthy 80% threshold'
                  : 'Expenses exceed 80% of income',
              },
            ].map(signal => (
              <div key={signal.label}
                className={`flex items-center justify-between p-3 rounded-lg
                  ${dark ? 'bg-white/[0.03]' : 'bg-gray-50'}`}
              >
                <div className="flex items-center gap-2">
                  {signal.ok
                    ? <CheckCircle size={15} className="text-green-400 flex-shrink-0" />
                    : <AlertTriangle size={15} className="text-amber-400 flex-shrink-0" />
                  }
                  <div>
                    <p className={`text-xs font-medium ${dark ? 'text-white' : 'text-gray-700'}`}>{signal.label}</p>
                    <p className={`text-xs ${dark ? 'text-white/30' : 'text-gray-400'}`}>{signal.msg}</p>
                  </div>
                </div>
                <span className={`text-sm font-mono font-bold flex-shrink-0 ml-3
                  ${signal.ok ? 'text-green-400' : 'text-amber-400'}`}
                >
                  {signal.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
