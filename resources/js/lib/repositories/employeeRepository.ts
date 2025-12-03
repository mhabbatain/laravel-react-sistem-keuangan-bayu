export interface Employee {
  id: string;
  name: string;
  position: string;
  salaryType: 'fixed' | 'daily';
  baseSalary: number;
  createdAt: string;
}

const STORAGE_KEY = 'finance_employees';

const seedData: Employee[] = [
  { id: '1', name: 'Ahmad Wijaya', position: 'Manager', salaryType: 'fixed', baseSalary: 12000000, createdAt: '2024-01-01T10:00:00' },
  { id: '2', name: 'Siti Rahayu', position: 'Akuntan', salaryType: 'fixed', baseSalary: 8000000, createdAt: '2024-01-01T10:00:00' },
  { id: '3', name: 'Budi Santoso', position: 'Staff Marketing', salaryType: 'fixed', baseSalary: 6000000, createdAt: '2024-01-01T10:00:00' },
  { id: '4', name: 'Dewi Lestari', position: 'Admin', salaryType: 'fixed', baseSalary: 5000000, createdAt: '2024-01-01T10:00:00' },
  { id: '5', name: 'Rizki Pratama', position: 'Kurir', salaryType: 'daily', baseSalary: 150000, createdAt: '2024-01-01T10:00:00' },
];

const initializeStorage = (): Employee[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
    return seedData;
  }
  return JSON.parse(stored);
};

export const employeeRepository = {
  getAll: (): Employee[] => {
    return initializeStorage();
  },

  getById: (id: string): Employee | undefined => {
    const employees = initializeStorage();
    return employees.find(e => e.id === id);
  },

  create: (employee: Omit<Employee, 'id' | 'createdAt'>): Employee => {
    const employees = initializeStorage();
    const newEmployee: Employee = {
      ...employee,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    employees.push(newEmployee);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
    return newEmployee;
  },

  update: (id: string, updates: Partial<Omit<Employee, 'id' | 'createdAt'>>): Employee | null => {
    const employees = initializeStorage();
    const index = employees.findIndex(e => e.id === id);
    if (index === -1) return null;
    
    employees[index] = { ...employees[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
    return employees[index];
  },

  delete: (id: string): boolean => {
    const employees = initializeStorage();
    const filtered = employees.filter(e => e.id !== id);
    if (filtered.length === employees.length) return false;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },
};
