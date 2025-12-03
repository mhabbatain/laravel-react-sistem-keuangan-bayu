export interface GajiKaryawanSlip {
    id: string;
    employeeId: string;
    employeeName: string;
    position: string;
    period: string;
    baseSalary: number;
    allowance: number;
    deduction: number;
    netSalary: number;
    createdAt: string;
}

const STORAGE_KEY = 'finance_GajiKaryawan';

const seedData: GajiKaryawanSlip[] = [
    {
        id: '1',
        employeeId: '1',
        employeeName: 'Ahmad Wijaya',
        position: 'Manager',
        period: '2024-01',
        baseSalary: 12000000,
        allowance: 2000000,
        deduction: 500000,
        netSalary: 13500000,
        createdAt: '2024-01-25T10:00:00',
    },
    {
        id: '2',
        employeeId: '2',
        employeeName: 'Siti Rahayu',
        position: 'Akuntan',
        period: '2024-01',
        baseSalary: 8000000,
        allowance: 1000000,
        deduction: 300000,
        netSalary: 8700000,
        createdAt: '2024-01-25T10:00:00',
    },
    {
        id: '3',
        employeeId: '3',
        employeeName: 'Budi Santoso',
        position: 'Staff Marketing',
        period: '2024-01',
        baseSalary: 6000000,
        allowance: 500000,
        deduction: 200000,
        netSalary: 6300000,
        createdAt: '2024-01-25T10:00:00',
    },
];

const initializeStorage = (): GajiKaryawanSlip[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
        return seedData;
    }
    return JSON.parse(stored);
};

export const GajiKaryawanRepository = {
    getAll: (): GajiKaryawanSlip[] => {
        return initializeStorage();
    },

    getById: (id: string): GajiKaryawanSlip | undefined => {
        const GajiKaryawans = initializeStorage();
        return GajiKaryawans.find((p) => p.id === id);
    },

    getByEmployeeId: (employeeId: string): GajiKaryawanSlip[] => {
        const GajiKaryawans = initializeStorage();
        return GajiKaryawans.filter((p) => p.employeeId === employeeId);
    },

    create: (
        GajiKaryawan: Omit<GajiKaryawanSlip, 'id' | 'createdAt'>,
    ): GajiKaryawanSlip => {
        const GajiKaryawans = initializeStorage();
        const newGajiKaryawan: GajiKaryawanSlip = {
            ...GajiKaryawan,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
        };
        GajiKaryawans.push(newGajiKaryawan);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(GajiKaryawans));
        return newGajiKaryawan;
    },

    delete: (id: string): boolean => {
        const GajiKaryawans = initializeStorage();
        const filtered = GajiKaryawans.filter((p) => p.id !== id);
        if (filtered.length === GajiKaryawans.length) return false;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        return true;
    },

    getTotalGajiKaryawanByPeriod: (period: string): number => {
        const GajiKaryawans = initializeStorage();
        return GajiKaryawans.filter((p) => p.period === period).reduce(
            (sum, p) => sum + p.netSalary,
            0,
        );
    },
};
