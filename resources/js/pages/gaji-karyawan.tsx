import { EmployeeForm } from '@/components/payroll/employee-form';
import { GajiKaryawanSlipForm } from '@/components/payroll/gaji-karyawan-slip-form';
import { DataTable } from '@/components/shared/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatPeriod } from '@/lib/formatters';
import gajiKaryawan from '@/routes/gaji-karyawan';
import karyawan from '@/routes/karyawan';
import slipGaji from '@/routes/slip-gaji';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Edit2, FileText, Plus, Trash2, Users } from 'lucide-react';
import { useState } from 'react';

interface Employee {
    id: number;
    nama: string;
    jabatan: string;
    tipe_gaji: 'tetap' | 'harian';
    gaji_pokok: number;
    created_at: string;
    updated_at: string;
}

interface SlipGaji {
    id: number;
    karyawan_id: number;
    nama_karyawan: string;
    jabatan: string;
    periode: string;
    gaji_pokok: number;
    tunjangan: number;
    potongan: number;
    gaji_bersih: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    karyawan: Employee[];
    slipGaji: SlipGaji[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gaji Karyawan',
        href: gajiKaryawan.index().url,
    },
];

export default function GajiKaryawan({
    karyawan: initialKaryawan,
    slipGaji: initialSlipGaji,
}: Props) {
    const [employeeFormOpen, setEmployeeFormOpen] = useState(false);
    const [GajiKaryawanFormOpen, setGajiKaryawanFormOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<
        Employee | undefined
    >();

    const handleEmployeeSubmit = (data: {
        nama: string;
        jabatan: string;
        tipe_gaji: 'tetap' | 'harian';
        gaji_pokok: number;
    }) => {
        if (editingEmployee) {
            router.put(karyawan.update(editingEmployee.id).url, data, {
                preserveScroll: true,
                onSuccess: () => {
                    setEmployeeFormOpen(false);
                    setEditingEmployee(undefined);
                    toast({
                        title: 'Berhasil',
                        description: 'Data karyawan berhasil diperbarui',
                    });
                },
            });
        } else {
            router.post(karyawan.store().url, data, {
                preserveScroll: true,
                onSuccess: () => {
                    setEmployeeFormOpen(false);
                    toast({
                        title: 'Berhasil',
                        description: 'Karyawan berhasil ditambahkan',
                    });
                },
            });
        }
    };

    const handleGajiKaryawanSubmit = (data: {
        karyawan_id: number;
        periode: string;
        gaji_pokok: number;
        gaji_bersih: number;
    }) => {
        router.post(slipGaji.store().url, data, {
            preserveScroll: true,
            onSuccess: () => {
                setGajiKaryawanFormOpen(false);
                toast({
                    title: 'Berhasil',
                    description: 'Slip gaji berhasil dibuat',
                });
            },
        });
    };

    const handleDeleteEmployee = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus karyawan ini?')) {
            router.delete(karyawan.destroy(id).url, {
                preserveScroll: true,
                onSuccess: () => {
                    toast({
                        title: 'Berhasil',
                        description: 'Karyawan berhasil dihapus',
                    });
                },
            });
        }
    };

    const handleDeleteGajiKaryawan = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus slip gaji ini?')) {
            router.delete(slipGaji.destroy(id).url, {
                preserveScroll: true,
                onSuccess: () => {
                    toast({
                        title: 'Berhasil',
                        description: 'Slip gaji berhasil dihapus',
                    });
                },
            });
        }
    };

    const handleEditEmployee = (employee: Employee) => {
        setEditingEmployee(employee);
        setEmployeeFormOpen(true);
    };

    const employeeColumns = [
        { key: 'nama', header: 'Nama' },
        { key: 'jabatan', header: 'Jabatan' },
        {
            key: 'tipe_gaji',
            header: 'Tipe Gaji',
            render: (e: Employee) => (
                <Badge variant="outline">
                    {e.tipe_gaji === 'tetap' ? 'Tetap' : 'Harian'}
                </Badge>
            ),
        },
        {
            key: 'gaji_pokok',
            header: 'Gaji',
            render: (e: Employee) => (
                <span className="font-medium">
                    {formatCurrency(e.gaji_pokok)}
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
            key: 'periode',
            header: 'Periode',
            render: (p: SlipGaji) => formatPeriod(p.periode),
        },
        { key: 'nama_karyawan', header: 'Nama Karyawan' },
        { key: 'jabatan', header: 'Jabatan' },
        {
            key: 'gaji_bersih',
            header: 'Gaji',
            render: (p: SlipGaji) => (
                <span className="font-semibold">
                    {formatCurrency(p.gaji_bersih)}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'Aksi',
            render: (p: SlipGaji) => (
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

    const totalGajiKaryawan = initialSlipGaji.reduce(
        (sum, p) => sum + (Number(p.gaji_bersih) || 0),
        0,
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gaji Karyawan" />
            <div className="animate-fade-in space-y-6">
                <div>
                    <h1 className="page-header">Gaji Karyawan</h1>
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
                                    {initialKaryawan.length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-500/10 p-2">
                                <FileText className="h-5 w-5 text-blue-900" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Slip Gaji
                                </p>
                                <p className="text-xl font-bold">
                                    {initialSlipGaji.length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-success/10 p-2">
                                <FileText className="h-5 w-5 text-success" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Pengeluaran Gaji
                                </p>
                                <p className="text-xl font-bold text-success">
                                    {formatCurrency(totalGajiKaryawan)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="employees" className="space-y-6">
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                        <TabsTrigger value="employees">
                            Daftar Karyawan
                        </TabsTrigger>
                        <TabsTrigger value="GajiKaryawans">
                            Slip Gaji
                        </TabsTrigger>
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
                        <DataTable<Employee>
                            columns={employeeColumns}
                            data={initialKaryawan}
                            emptyMessage="Tidak ada data karyawan"
                        />
                    </TabsContent>

                    <TabsContent value="GajiKaryawans" className="space-y-4">
                        <div className="flex justify-end">
                            <Button
                                onClick={() => setGajiKaryawanFormOpen(true)}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Buat Slip Gaji
                            </Button>
                        </div>
                        <DataTable<SlipGaji>
                            columns={GajiKaryawanColumns}
                            data={initialSlipGaji.sort((a, b) =>
                                b.periode.localeCompare(a.periode),
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
                    employees={initialKaryawan}
                />
            </div>
        </AppLayout>
    );
}
