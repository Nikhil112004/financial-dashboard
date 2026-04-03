import { useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank } from 'lucide-react';
import { useSummaryStats, useTheme } from '../../hooks/useAppHooks';
import { formatCurrency, formatPct } from '../../utils/formatters';

const cards = [
  {
    key: 'balance',
    label: 'Net Balance',
    icon: DollarSign,
    color: 'brand',
    gradient: 'from-brand-500 to-brand-700',
    highlight: true,
  },
  {
    key: 'income',
    label: 'Total Income',
    icon: TrendingUp,
    color: 'green',
  },
  {
    key: 'expenses',
    label: 'Total Expenses',
    icon: TrendingDown,
    color: 'red',
  },
  {
    key: 'savings',
    label: 'Savings Rate',
    icon: PiggyBank,
    color: 'purple',
    isSavings: true,
  },
];

const colorMap = {
  brand:  { bg: 'bg-brand-500/10',  text: 'text-brand-400',  ring: 'ring-brand-500/20'  },
  green:  { bg: 'bg-green-500/10',  text: 'text-green-400',  ring: 'ring-green-500/20'  },
  red:    { bg: 'bg-red-500/10',    text: 'text-red-400',    ring: 'ring-red-500/20'    },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', ring: 'ring-purple-500/20' },
};

function AnimatedNumber({ value, format }) {
  const ref = useRef(null);
  const prevRef = useRef(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const start = prevRef.current;
    const end = value;
    const duration = 600;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;
      el.textContent = format(current);
      if (progress < 1) requestAnimationFrame(animate);
      else prevRef.current = end;
    };
    requestAnimationFrame(animate);
  }, [value, format]);

  return <span ref={ref}>{format(value)}</span>;
}

export default function SummaryCards() {
  const stats = useSummaryStats();
  const dark = useTheme() === 'dark';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map(({ key, label, icon: Icon, color, highlight, isSavings }, i) => {
        const raw = stats[key];
        const c = colorMap[color];

        return (
          <div
            key={key}
            className={`
              relative rounded-xl p-5 overflow-hidden animate-slide-up
              ${dark
                ? 'bg-surface-850 border border-white/5'
                : 'bg-white border border-gray-100 shadow-card'
              }
            `}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {highlight && (
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent pointer-events-none" />
            )}

            <div className="flex items-start justify-between mb-4">
              <p className={`text-xs font-medium uppercase tracking-wider ${dark ? 'text-white/40' : 'text-gray-400'}`}>
                {label}
              </p>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ring-1 ${c.bg} ${c.ring}`}>
                <Icon size={15} className={c.text} />
              </div>
            </div>

            <div className={`text-2xl font-display font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
              {isSavings
                ? <AnimatedNumber value={raw} format={v => `${v.toFixed(1)}%`} />
                : <AnimatedNumber value={raw} format={v => formatCurrency(v, true)} />
              }
            </div>

            {key === 'balance' && (
              <p className={`mt-1 text-xs ${dark ? 'text-white/30' : 'text-gray-400'}`}>
                {stats.count} transactions
              </p>
            )}
            {key === 'expenses' && (
              <p className={`mt-1 text-xs ${dark ? 'text-white/30' : 'text-gray-400'}`}>
                Avg {formatCurrency(stats.expenses / 30, true)}/day
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
