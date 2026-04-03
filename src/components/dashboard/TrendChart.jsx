import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useMonthlyTrend, useTheme } from '../../hooks/useAppHooks';
import { formatCurrency } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label, dark }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={`rounded-xl p-3 border text-sm shadow-xl ${dark ? 'bg-surface-850 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-800'}`}>
      <p className={`font-medium mb-2 ${dark ? 'text-white/60' : 'text-gray-500'}`}>{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className={dark ? 'text-white/50' : 'text-gray-400'}>{p.name}</span>
          <span className="ml-auto font-mono font-medium">{formatCurrency(p.value, true)}</span>
        </div>
      ))}
    </div>
  );
};

export default function TrendChart() {
  const data = useMonthlyTrend();
  const dark = useTheme() === 'dark';

  return (
    <div className={`rounded-xl p-5 border animate-slide-up ${dark ? 'bg-surface-850 border-white/5' : 'bg-white border-gray-100 shadow-card'}`}>
      <div className="mb-4">
        <h2 className={`text-sm font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>Cash Flow Trend</h2>
        <p className={`text-xs mt-0.5 ${dark ? 'text-white/30' : 'text-gray-400'}`}>Income vs Expenses over time</p>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#14b8a6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}   />
            </linearGradient>
            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#f97316" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0}   />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: dark ? 'rgba(255,255,255,0.3)' : '#9ca3af' }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tickFormatter={v => formatCurrency(v, true)}
            tick={{ fontSize: 10, fill: dark ? 'rgba(255,255,255,0.3)' : '#9ca3af' }}
            axisLine={false} tickLine={false}
          />
          <Tooltip content={<CustomTooltip dark={dark} />} />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
            formatter={(v) => <span style={{ color: dark ? 'rgba(255,255,255,0.5)' : '#6b7280' }}>{v}</span>}
          />
          <Area type="monotone" dataKey="income"   name="Income"   stroke="#14b8a6" strokeWidth={2} fill="url(#colorIncome)"   dot={false} />
          <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f97316" strokeWidth={2} fill="url(#colorExpenses)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
