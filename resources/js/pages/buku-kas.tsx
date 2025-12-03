import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import {
    formatCurrency,
    formatShortDate,
    getDateRangeForPeriod,
} from '@/lib/formatters';
import {
    Transaction,
    transactionRepository,
} from '@/lib/repositories/transactionRepository';
import { bukuKas } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { FileSpreadsheet } from 'lucide-react';
import { useMemo, useState } from 'react';

type PeriodType = 'daily' | 'weekly' | 'monthly';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Buku Kas',
        href: bukuKas().url,
    },
];

export default function BukuKas() {
    const [periodType, setPeriodType] = useState<PeriodType>('monthly');
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split('T')[0],
    );

    const { filteredTransactions, dateRange } = useMemo(() => {
        const date = new Date(selectedDate);
        let range: { start: string; end: string };

        if (periodType === 'weekly') {
            const startOfWeek = new Date(date);
            startOfWeek.setDate(date.getDate() - date.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            range = {
                start: startOfWeek.toISOString().split('T')[0],
                end: endOfWeek.toISOString().split('T')[0],
            };
        } else {
            range = getDateRangeForPeriod(
                periodType === 'daily' ? 'daily' : 'monthly',
                date,
            );
        }

        const filtered = transactionRepository.getByDateRange(
            range.start,
            range.end,
        );
        return { filteredTransactions: filtered, dateRange: range };
    }, [periodType, selectedDate]);

    const sortedTransactions = useMemo(() => {
        return [...filteredTransactions].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );
    }, [filteredTransactions]);

    // Calculate running balance
    const transactionsWithBalance = useMemo(() => {
        return sortedTransactions.reduce<(Transaction & { balance: number })[]>(
            (acc, t) => {
                const previousBalance =
                    acc.length > 0 ? acc[acc.length - 1].balance : 0;
                const currentBalance =
                    previousBalance +
                    (t.type === 'income' ? t.amount : -t.amount);
                acc.push({ ...t, balance: currentBalance });
                return acc;
            },
            [],
        );
    }, [sortedTransactions]);

    const totalIncome =
        transactionRepository.getTotalIncome(filteredTransactions);
    const totalExpense =
        transactionRepository.getTotalExpense(filteredTransactions);
    const finalBalance = totalIncome - totalExpense;

    const exportToCSV = () => {
        const headers = [
            'Tanggal',
            'Deskripsi',
            'Kategori',
            'Kas Masuk',
            'Kas Keluar',
            'Saldo',
        ];
        const rows = transactionsWithBalance.map((t) => [
            formatShortDate(t.date),
            t.description,
            t.category,
            t.type === 'income' ? t.amount : '',
            t.type === 'expense' ? t.amount : '',
            t.balance,
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map((row) => row.join(',')),
            '',
            `Total Kas Masuk,,,,${totalIncome}`,
            `Total Kas Keluar,,,,,${totalExpense}`,
            `Saldo Akhir,,,,,,${finalBalance}`,
        ].join('\n');

        const blob = new Blob([csvContent], {
            type: 'text/csv;charset=utf-8;',
        });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `buku-kas-${dateRange.start}-${dateRange.end}.csv`;
        link.click();

        toast({ title: 'Berhasil', description: 'File CSV berhasil diunduh' });
    };

    const columns = [
        {
            key: 'date',
            header: 'Tanggal',
            render: (t: Transaction & { balance: number }) =>
                formatShortDate(t.date),
        },
        {
            key: 'description',
            header: 'Deskripsi',
        },
        {
            key: 'category',
            header: 'Kategori',
            render: (t: Transaction & { balance: number }) => (
                <span className="capitalize">{t.category}</span>
            ),
        },
        {
            key: 'income',
            header: 'Kas Masuk',
            render: (t: Transaction & { balance: number }) =>
                t.type === 'income' ? (
                    <span className="font-medium text-success">
                        {formatCurrency(t.amount)}
                    </span>
                ) : (
                    <span className="text-muted-foreground">-</span>
                ),
        },
        {
            key: 'expense',
            header: 'Kas Keluar',
            render: (t: Transaction & { balance: number }) =>
                t.type === 'expense' ? (
                    <span className="font-medium text-destructive">
                        {formatCurrency(t.amount)}
                    </span>
                ) : (
                    <span className="text-muted-foreground">-</span>
                ),
        },
        {
            key: 'balance',
            header: 'Saldo',
            render: (t: Transaction & { balance: number }) => (
                <span
                    className={`font-semibold ${t.balance >= 0 ? 'text-blue-500' : 'text-destructive'}`}
                >
                    {formatCurrency(t.balance)}
                </span>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buku Kas" />
            <div className="animate-fade-in space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="page-header">Buku Kas</h1>
                        <p className="mt-1 text-muted-foreground">
                            Rekap transaksi berdasarkan periode
                        </p>
                    </div>
                    <Button onClick={exportToCSV} variant="outline">
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                </div>

                {/* Period Selection */}
                <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row">
                    <div className="space-y-2">
                        <Label>Periode</Label>
                        <Select
                            value={periodType}
                            onValueChange={(v: PeriodType) => setPeriodType(v)}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="daily">Harian</SelectItem>
                                <SelectItem value="weekly">Mingguan</SelectItem>
                                <SelectItem value="monthly">Bulanan</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Tanggal</Label>
                        <Input
                            type={periodType === 'monthly' ? 'month' : 'date'}
                            value={
                                periodType === 'monthly'
                                    ? selectedDate.substring(0, 7)
                                    : selectedDate
                            }
                            onChange={(e) => {
                                if (periodType === 'monthly') {
                                    setSelectedDate(`${e.target.value}-01`);
                                } else {
                                    setSelectedDate(e.target.value);
                                }
                            }}
                            className="w-[180px]"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Rentang</Label>
                        <p className="pt-2 text-sm text-muted-foreground">
                            {formatShortDate(dateRange.start)} -{' '}
                            {formatShortDate(dateRange.end)}
                        </p>
                    </div>
                </div>

                {/* Summary */}
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg border border-border bg-card p-4">
                        <p className="text-sm text-muted-foreground">
                            Total Kas Masuk
                        </p>
                        <p className="text-xl font-bold text-success">
                            {formatCurrency(totalIncome)}
                        </p>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-4">
                        <p className="text-sm text-muted-foreground">
                            Total Kas Keluar
                        </p>
                        <p className="text-xl font-bold text-destructive">
                            {formatCurrency(totalExpense)}
                        </p>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-4">
                        <p className="text-sm text-muted-foreground">
                            Saldo Akhir
                        </p>
                        <p
                            className={`text-xl font-bold ${finalBalance >= 0 ? 'text-blue-800' : 'text-destructive'}`}
                        >
                            {formatCurrency(finalBalance)}
                        </p>
                    </div>
                </div>

                {/* Table */}
                <DataTable
                    columns={columns}
                    data={transactionsWithBalance}
                    emptyMessage="Tidak ada transaksi pada periode ini"
                />
            </div>
        </AppLayout>
    );
}
