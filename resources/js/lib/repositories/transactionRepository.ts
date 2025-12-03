export interface Transaction {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  createdAt: string;
}

const STORAGE_KEY = 'finance_transactions';

const seedData: Transaction[] = [
  { id: '1', date: '2024-01-15', category: 'pendapatan', description: 'Penjualan Produk A', amount: 5000000, type: 'income', createdAt: '2024-01-15T10:00:00' },
  { id: '2', date: '2024-01-16', category: 'biaya', description: 'Pembelian Bahan Baku', amount: 2000000, type: 'expense', createdAt: '2024-01-16T11:00:00' },
  { id: '3', date: '2024-01-17', category: 'pendapatan', description: 'Penjualan Jasa Konsultasi', amount: 3500000, type: 'income', createdAt: '2024-01-17T09:00:00' },
  { id: '4', date: '2024-01-18', category: 'biaya', description: 'Biaya Listrik', amount: 500000, type: 'expense', createdAt: '2024-01-18T14:00:00' },
  { id: '5', date: '2024-01-19', category: 'biaya', description: 'Gaji Karyawan', amount: 8000000, type: 'expense', createdAt: '2024-01-19T08:00:00' },
  { id: '6', date: '2024-01-20', category: 'pendapatan', description: 'Penjualan Online', amount: 2500000, type: 'income', createdAt: '2024-01-20T15:00:00' },
  { id: '7', date: '2024-01-21', category: 'biaya', description: 'Biaya Transportasi', amount: 300000, type: 'expense', createdAt: '2024-01-21T12:00:00' },
  { id: '8', date: '2024-01-22', category: 'pendapatan', description: 'Komisi Penjualan', amount: 1500000, type: 'income', createdAt: '2024-01-22T10:00:00' },
  { id: '9', date: '2024-02-01', category: 'pendapatan', description: 'Penjualan Produk B', amount: 4200000, type: 'income', createdAt: '2024-02-01T09:00:00' },
  { id: '10', date: '2024-02-05', category: 'biaya', description: 'Biaya Sewa Kantor', amount: 3000000, type: 'expense', createdAt: '2024-02-05T10:00:00' },
];

const initializeStorage = (): Transaction[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
    return seedData;
  }
  return JSON.parse(stored);
};

export const transactionRepository = {
  getAll: (): Transaction[] => {
    return initializeStorage();
  },

  getById: (id: string): Transaction | undefined => {
    const transactions = initializeStorage();
    return transactions.find(t => t.id === id);
  },

  create: (transaction: Omit<Transaction, 'id' | 'createdAt'>): Transaction => {
    const transactions = initializeStorage();
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    transactions.push(newTransaction);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    return newTransaction;
  },

  update: (id: string, updates: Partial<Omit<Transaction, 'id' | 'createdAt'>>): Transaction | null => {
    const transactions = initializeStorage();
    const index = transactions.findIndex(t => t.id === id);
    if (index === -1) return null;
    
    transactions[index] = { ...transactions[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    return transactions[index];
  },

  delete: (id: string): boolean => {
    const transactions = initializeStorage();
    const filtered = transactions.filter(t => t.id !== id);
    if (filtered.length === transactions.length) return false;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  getByDateRange: (startDate: string, endDate: string): Transaction[] => {
    const transactions = initializeStorage();
    return transactions.filter(t => t.date >= startDate && t.date <= endDate);
  },

  getTotalIncome: (transactions?: Transaction[]): number => {
    const data = transactions || initializeStorage();
    return data.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  },

  getTotalExpense: (transactions?: Transaction[]): number => {
    const data = transactions || initializeStorage();
    return data.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  },

  getBalance: (transactions?: Transaction[]): number => {
    const data = transactions || initializeStorage();
    return transactionRepository.getTotalIncome(data) - transactionRepository.getTotalExpense(data);
  },
};
