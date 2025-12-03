import { EmployeeForm } from '@/components/payroll/EmployeeForm';
import { GajiKaryawanSlipForm } from '@/components/payroll/GajiKaryawanSlipForm';
import { DataTable } from '@/components/shared/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { formatCurrency, formatPeriod } from '@/lib/formatters';
import {
    Employee,
    employeeRepository,
} from '@/lib/repositories/employeeRepository';
import {
    GajiKaryawanRepository,
    GajiKaryawanSlip,
} from '@/lib/repositories/gajiKaryawanRepository';
import { Edit2, FileText, Plus, Trash2, Users } from 'lucide-react';
import { useState } from 'react';

export default function GajiKaryawan() {
    const [employees, setEmployees] = useState<Employee[]>(() =>
        employeeRepository.getAll(),
    );
    const [GajiKaryawans, setGajiKaryawans] = useState<GajiKaryawanSlip[]>(() =>
        GajiKaryawanRepository.getAll(),
    );
    const [employeeFormOpen, setEmployeeFormOpen] = useState(false);
    const [GajiKaryawanFormOpen, setGajiKaryawanFormOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<
        Employee | undefined
    >();

    const loadData = () => {
        setEmployees(employeeRepository.getAll());
        setGajiKaryawans(GajiKaryawanRepository.getAll());
    };

    const handleEmployeeSubmit = (data: Omit<Employee, 'id' | 'createdAt'>) => {
        if (editingEmployee) {
            employeeRepository.update(editingEmployee.id, data);
            toast({
                title: 'Berhasil',
                description: 'Data karyawan berhasil diperbarui',
            });
        } else {
            employeeRepository.create(data);
            toast({
                title: 'Berhasil',
                description: 'Karyawan berhasil ditambahkan',
            });
        }
        loadData();
        setEditingEmployee(undefined);
    };

    const handleGajiKaryawanSubmit = (
        data: Omit<GajiKaryawanSlip, 'id' | 'createdAt'>,
    ) => {
        GajiKaryawanRepository.create(data);
        toast({ title: 'Berhasil', description: 'Slip gaji berhasil dibuat' });
        loadData();
    };

    const handleDeleteEmployee = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus karyawan ini?')) {
            employeeRepository.delete(id);
            toast({
                title: 'Berhasil',
                description: 'Karyawan berhasil dihapus',
            });
            loadData();
        }
    };

    const handleDeleteGajiKaryawan = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus slip gaji ini?')) {
            GajiKaryawanRepository.delete(id);
            toast({
                title: 'Berhasil',
                description: 'Slip gaji berhasil dihapus',
            });
            loadData();
        }
    };

    const handleEditEmployee = (employee: Employee) => {
        setEditingEmployee(employee);
        setEmployeeFormOpen(true);
    };

    const employeeColumns = [
        { key: 'name', header: 'Nama' },
        { key: 'position', header: 'Jabatan' },
        {
            key: 'salaryType',
            header: 'Tipe Gaji',
            render: (e: Employee) => (
                <Badge variant="outline">
                    {e.salaryType === 'fixed' ? 'Tetap' : 'Harian'}
                </Badge>
            ),
        },
        {
            key: 'baseSalary',
            header: 'Gaji Pokok',
            render: (e: Employee) => (
                <span className="font-medium">
                    {formatCurrency(e.baseSalary)}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'Aksi',
            render: (e: Employee) => (
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditEmployee(e)}
                    >
                        <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteEmployee(e.id)}
                    >
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
            ),
        },
    ];

    const GajiKaryawanColumns = [
        {
            key: 'period',
            header: 'Periode',
            render: (p: GajiKaryawanSlip) => formatPeriod(p.period),
        },
        { key: 'employeeName', header: 'Nama Karyawan' },
        { key: 'position', header: 'Jabatan' },
        {
            key: 'baseSalary',
            header: 'Gaji Pokok',
            render: (p: GajiKaryawanSlip) => formatCurrency(p.baseSalary),
        },
        {
            key: 'allowance',
            header: 'Tunjangan',
            render: (p: GajiKaryawanSlip) => (
                <span className="text-success">
                    {formatCurrency(p.allowance)}
                </span>
            ),
        },
        {
            key: 'deduction',
            header: 'Potongan',
            render: (p: GajiKaryawanSlip) => (
                <span className="text-destructive">
                    {formatCurrency(p.deduction)}
                </span>
            ),
        },
        {
            key: 'netSalary',
            header: 'Gaji Bersih',
            render: (p: GajiKaryawanSlip) => (
                <span className="font-bold text-accent">
                    {formatCurrency(p.netSalary)}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'Aksi',
            render: (p: GajiKaryawanSlip) => (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteGajiKaryawan(p.id)}
                >
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            ),
        },
    ];

    const totalGajiKaryawan = GajiKaryawans.reduce(
        (sum, p) => sum + p.netSalary,
        0,
    );

    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h1 className="page-header">GajiKaryawan</h1>
                <p className="mt-1 text-muted-foreground">
                    Kelola data karyawan dan penggajian
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                            <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Total Karyawan
                            </p>
                            <p className="text-xl font-bold">
                                {employees.length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-accent/10 p-2">
                            <FileText className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Total Slip Gaji
                            </p>
                            <p className="text-xl font-bold">
                                {GajiKaryawans.length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-success/10 rounded-lg p-2">
                            <FileText className="text-success h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Total Pengeluaran Gaji
                            </p>
                            <p className="text-success text-xl font-bold">
                                {formatCurrency(totalGajiKaryawan)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="employees" className="space-y-6">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="employees">Daftar Karyawan</TabsTrigger>
                    <TabsTrigger value="GajiKaryawans">Slip Gaji</TabsTrigger>
                </TabsList>

                <TabsContent value="employees" className="space-y-4">
                    <div className="flex justify-end">
                        <Button
                            onClick={() => {
                                setEditingEmployee(undefined);
                                setEmployeeFormOpen(true);
                            }}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Karyawan
                        </Button>
                    </div>
                    <DataTable
                        columns={employeeColumns}
                        data={employees}
                        emptyMessage="Tidak ada data karyawan"
                    />
                </TabsContent>

                <TabsContent value="GajiKaryawans" className="space-y-4">
                    <div className="flex justify-end">
                        <Button onClick={() => setGajiKaryawanFormOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Buat Slip Gaji
                        </Button>
                    </div>
                    <DataTable
                        columns={GajiKaryawanColumns}
                        data={GajiKaryawans.sort((a, b) =>
                            b.period.localeCompare(a.period),
                        )}
                        emptyMessage="Tidak ada slip gaji"
                    />
                </TabsContent>
            </Tabs>

            {/* Forms */}
            <EmployeeForm
                open={employeeFormOpen}
                onOpenChange={setEmployeeFormOpen}
                onSubmit={handleEmployeeSubmit}
                initialData={editingEmployee}
            />

            <GajiKaryawanSlipForm
                open={GajiKaryawanFormOpen}
                onOpenChange={setGajiKaryawanFormOpen}
                onSubmit={handleGajiKaryawanSubmit}
                employees={employees}
            />
        </div>
    );
}
