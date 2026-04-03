import { subDays, format } from 'date-fns';

const categories = ['Food & Dining', 'Transport', 'Shopping', 'Entertainment', 'Healthcare', 'Utilities', 'Housing', 'Education', 'Travel', 'Salary', 'Freelance', 'Investment'];

const categoryColors = {
  'Food & Dining':  '#f97316',
  'Transport':      '#3b82f6',
  'Shopping':       '#ec4899',
  'Entertainment':  '#a855f7',
  'Healthcare':     '#ef4444',
  'Utilities':      '#6b7280',
  'Housing':        '#14b8a6',
  'Education':      '#0ea5e9',
  'Travel':         '#f59e0b',
  'Salary':         '#22c55e',
  'Freelance':      '#10b981',
  'Investment':     '#8b5cf6',
};

const categoryIcons = {
  'Food & Dining':  '🍔',
  'Transport':      '🚗',
  'Shopping':       '🛍️',
  'Entertainment':  '🎬',
  'Healthcare':     '💊',
  'Utilities':      '⚡',
  'Housing':        '🏠',
  'Education':      '📚',
  'Travel':         '✈️',
  'Salary':         '💼',
  'Freelance':      '💻',
  'Investment':     '📈',
};

const merchants = {
  'Food & Dining':  ['Swiggy', 'Zomato', 'McDonald\'s', 'Starbucks', 'Domino\'s', 'Pizza Hut', 'Local Dhaba', 'Café Coffee Day'],
  'Transport':      ['Ola', 'Uber', 'IRCTC', 'MakeMyTrip', 'Rapido', 'Bus Pass', 'Metro Card', 'Petrol Station'],
  'Shopping':       ['Amazon', 'Flipkart', 'Myntra', 'Ajio', 'Meesho', 'Nykaa', 'Decathlon', 'H&M'],
  'Entertainment':  ['Netflix', 'Spotify', 'BookMyShow', 'Disney+', 'Prime Video', 'Sony LIV', 'JioCinema'],
  'Healthcare':     ['Apollo Pharmacy', 'Medplus', 'Practo', '1mg', 'Netmeds', 'City Hospital'],
  'Utilities':      ['BSNL', 'Jio', 'Airtel', 'BESCOM', 'Water Board', 'Gas Agency'],
  'Housing':        ['House Rent', 'Society Maintenance', 'Home Loan EMI', 'Interior Work'],
  'Education':      ['Coursera', 'Udemy', 'BYJU\'S', 'Unacademy', 'School Fees', 'Books'],
  'Travel':         ['MakeMyTrip', 'Goibibo', 'Airbnb', 'OYO', 'IRCTC', 'IndiGo Airlines'],
  'Salary':         ['Employer Corp', 'TCS', 'Infosys', 'Wipro', 'Accenture', 'Startup Inc'],
  'Freelance':      ['Upwork', 'Fiverr', 'Toptal', 'Client Payment', 'Consulting Fee'],
  'Investment':     ['Zerodha', 'Groww', 'Paytm Money', 'SIP Returns', 'FD Maturity', 'Dividend'],
};

let idCounter = 1;
const makeId = () => `txn_${String(idCounter++).padStart(4, '0')}`;

const rand = (min, max) => Math.random() * (max - min) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const generateTransactions = () => {
  const transactions = [];
  const today = new Date();

  for (let daysAgo = 180; daysAgo >= 0; daysAgo--) {
    const date = subDays(today, daysAgo);
    const dayOfMonth = date.getDate();

    if (dayOfMonth === 1) {
      transactions.push({
        id: makeId(),
        date: format(date, 'yyyy-MM-dd'),
        amount: parseFloat(rand(65000, 95000).toFixed(2)),
        category: 'Salary',
        type: 'income',
        merchant: pick(merchants['Salary']),
        note: 'Monthly salary credit',
        status: 'completed',
      });
    }

    if (Math.random() < 0.08) {
      transactions.push({
        id: makeId(),
        date: format(date, 'yyyy-MM-dd'),
        amount: parseFloat(rand(5000, 25000).toFixed(2)),
        category: 'Freelance',
        type: 'income',
        merchant: pick(merchants['Freelance']),
        note: 'Freelance project payment',
        status: 'completed',
      });
    }

    if (dayOfMonth === 15 && Math.random() < 0.4) {
      transactions.push({
        id: makeId(),
        date: format(date, 'yyyy-MM-dd'),
        amount: parseFloat(rand(1000, 8000).toFixed(2)),
        category: 'Investment',
        type: 'income',
        merchant: pick(merchants['Investment']),
        note: 'Returns / Dividend',
        status: 'completed',
      });
    }

    const expenseCategories = ['Food & Dining', 'Transport', 'Shopping', 'Entertainment', 'Healthcare', 'Utilities', 'Housing', 'Education', 'Travel'];
    const expenseAmounts = {
      'Food & Dining': [100, 800],
      'Transport': [50, 600],
      'Shopping': [500, 5000],
      'Entertainment': [200, 1500],
      'Healthcare': [200, 3000],
      'Utilities': [500, 2500],
      'Housing': [8000, 25000],
      'Education': [500, 5000],
      'Travel': [1000, 15000],
    };

    const numExpenses = Math.floor(rand(0, 4));
    for (let i = 0; i < numExpenses; i++) {
      const cat = pick(expenseCategories.filter(c => {
        if (c === 'Housing') return dayOfMonth === 5 && Math.random() < 0.8;
        if (c === 'Travel') return Math.random() < 0.05;
        if (c === 'Education') return Math.random() < 0.1;
        return true;
      }));
      if (!cat) continue;
      const [min, max] = expenseAmounts[cat];
      transactions.push({
        id: makeId(),
        date: format(date, 'yyyy-MM-dd'),
        amount: parseFloat(rand(min, max).toFixed(2)),
        category: cat,
        type: 'expense',
        merchant: pick(merchants[cat]),
        note: '',
        status: Math.random() > 0.05 ? 'completed' : 'pending',
      });
    }
  }

  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export { categoryColors, categoryIcons, categories };
