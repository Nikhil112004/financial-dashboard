import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from 'recharts';
import { useCategoryBreakdown, useTheme } from '../../hooks/useAppHooks';
import { categoryColors, categoryIcons } from '../../data/mockData';
import { formatCurrency } from '../../utils/formatters';

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 6}
        startAngle={startAngle} endAngle={endAngle} fill={fill} />
    </g>
  );
};

export default function CategoryChart() {
  const breakdown = useCategoryBreakdown();
  const dark = useTheme() === 'dark';
  const [activeIndex, setActiveIndex] = useState(null);

  const top6 = breakdown.slice(0, 6);

  return (
    <div className={`rounded-xl p-5 border animate-slide-up ${dark ? 'bg-surface-850 border-white/5' : 'bg-white border-gray-100 shadow-card'}`}>
      <div className="mb-4">
        <h2 className={`text-sm font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>Spending Breakdown</h2>
        <p className={`text-xs mt-0.5 ${dark ? 'text-white/30' : 'text-gray-400'}`}>By category</p>
      </div>

      {top6.length === 0 ? (
        <div className={`flex items-center justify-center h-32 text-sm ${dark ? 'text-white/30' : 'text-gray-400'}`}>
          No expense data available
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={top6}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                dataKey="amount"
                nameKey="category"
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                onMouseEnter={(_, i) => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {top6.map((entry) => (
                  <Cell key={entry.category} fill={categoryColors[entry.category] || '#6b7280'} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v, n) => [formatCurrency(v), n]}
                contentStyle={{
                  background: dark ? '#181825' : '#fff',
                  border: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '12px',
                  color: dark ? '#fff' : '#111',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="w-full sm:w-auto flex-shrink-0 space-y-1.5">
            {top6.map((item, i) => (
              <div
                key={item.category}
                className={`flex items-center gap-2 text-xs cursor-pointer transition-opacity
                  ${activeIndex !== null && activeIndex !== i ? 'opacity-40' : 'opacity-100'}`}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: categoryColors[item.category] || '#6b7280' }} />
                <span className={dark ? 'text-white/60' : 'text-gray-600'}>
                  {categoryIcons[item.category]} {item.category}
                </span>
                <span className={`ml-auto font-mono font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>
                  {item.pct.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
