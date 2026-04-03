# FinTrack — Finance Dashboard

A clean, interactive personal finance dashboard built with **React**, **Redux Toolkit**, and **TailwindCSS**.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Open [http://localhost:3000] in your browser.

---

## 🏗️ Architecture Overview

```
src/
├── components/
│   ├── common/          # Reusable UI (DateRangePicker, Toast)
│   ├── dashboard/       # Dashboard page components
│   ├── insights/        # Insights & analytics page
│   ├── layout/          # Sidebar, Header
│   └── transactions/    # Transactions table, Add/Edit modal
├── data/
│   └── mockData.js      # Mock data generator (6 months, INR)
├── hooks/
│   └── useAppHooks.js   # Custom selectors & derived data hooks
├── store/
│   ├── store.js         # Redux store config
│   └── slices/
│       ├── transactionsSlice.js  # CRUD + filters state
│       └── uiSlice.js            # Role, theme, navigation
└── utils/
    └── formatters.js    # Currency, date, percentage formatters
```

### Design Decisions

| Concern | Choice | Reason |
|---|---|---|
| State management | Redux Toolkit | Predictable, devtools support, scales well |
| Styling | TailwindCSS | Utility-first, dark mode via `dark:` prefix |
| Charts | Recharts | Composable, responsive, React-native |
| Data persistence | localStorage | No backend needed; survives page refresh |
| Date utilities | date-fns | Lightweight, tree-shakeable |

---

## ✨ Features

### Dashboard Overview
- **Summary Cards** — Net Balance, Total Income, Total Expenses, Savings Rate with animated number counters
- **Cash Flow Trend** — Area chart showing income vs expenses over 6 months
- **Spending Breakdown** — Interactive donut chart with category legend
- **Recent Transactions** — Last 6 transactions with quick-link to full list

### Transactions
- Full paginated table (15 per page) with mobile card layout
- **Search** across merchant, category, note
- **Filters** — by type (income/expense), category, date range
- **Sort** by date, amount, category, merchant (asc/desc)
- **Export to CSV** — downloads filtered transactions
- Admin-only Edit & Delete actions

### Role-Based UI (RBAC simulation)
- **Admin** — full CRUD: add, edit, delete transactions; role badge shown
- **Viewer** — read-only: no add/edit/delete buttons rendered
- Switch via sidebar dropdown or header badge; persists in session

### Insights
- Month-over-month expense & income delta
- Top spending category this month
- Average daily spend
- Category bar chart with % breakdown
- Financial health signals (savings rate, spending ratio, trend alerts)

### UX Details
- **Dark / Light theme** — toggle in sidebar; persists to localStorage
- **Collapsible sidebar** — saves screen real estate on smaller displays
- **Date range filter** — 7D / 1M / 3M / 6M / 1Y applies across all views
- **Toast notifications** — success/error feedback for all mutations
- **Empty states** — graceful messaging when no data matches filters
- **Responsive** — table → cards on mobile, grid adapts to viewport
- **Data reset** — regenerate fresh 6-month mock dataset anytime

---

## 📦 Dependencies

```json
{
  "react": "^18",
  "@reduxjs/toolkit": "^2",
  "react-redux": "^9",
  "recharts": "^2",
  "date-fns": "^3",
  "lucide-react": "^0.363",
  "tailwindcss": "^3"
}
```

---

## 💡 Assumptions & Notes

- All monetary values are in **Indian Rupees (₹)**
- Mock data covers ~6 months of realistic transactions (salary, freelance, food, transport, etc.)
- No backend — data lives in Redux store, persisted to `localStorage`
- RBAC is purely frontend UI gating; no auth tokens or protected routes
- The "Viewer" role can still see all data, just cannot mutate it
