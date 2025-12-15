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
import { laporanKeuangan } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FileText } from 'lucide-react';
import { useMemo, useState } from 'react';

interface Transaction {
    id: number;
    tanggal: string;
    kategori: string;
    deskripsi: string;
    jumlah: number;
    tipe: 'pemasukan' | 'pengeluaran';
    created_at: string;
    updated_at: string;
}

interface Props {
    transactions: Transaction[];
}

type PeriodType = 'daily' | 'weekly' | 'monthly';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Laporan Keuangan',
        href: laporanKeuangan().url,
    },
];

export default function LaporanKeuangan({ transactions }: Props) {
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

        const filtered = transactions.filter((t) => {
            const transactionDate = new Date(t.tanggal);
            const startDate = new Date(range.start);
            const endDate = new Date(range.end);
            return transactionDate >= startDate && transactionDate <= endDate;
        });
        return { filteredTransactions: filtered, dateRange: range };
    }, [transactions, periodType, selectedDate]);

    const sortedTransactions = useMemo(() => {
        return [...filteredTransactions].sort(
            (a, b) =>
                new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime(),
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
                    (t.tipe === 'pemasukan'
                        ? Number(t.jumlah)
                        : -Number(t.jumlah));
                acc.push({ ...t, balance: currentBalance });
                return acc;
            },
            [],
        );
    }, [sortedTransactions]);

    const totalIncome = useMemo(() => {
        return filteredTransactions
            .filter((t) => t.tipe === 'pemasukan')
            .reduce((sum, t) => sum + Number(t.jumlah), 0);
    }, [filteredTransactions]);

    const totalExpense = useMemo(() => {
        return filteredTransactions
            .filter((t) => t.tipe === 'pengeluaran')
            .reduce((sum, t) => sum + Number(t.jumlah), 0);
    }, [filteredTransactions]);

    const finalBalance = totalIncome - totalExpense;

    const exportToPDF = () => {
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(18);
        doc.text('Laporan Keuangan', 14, 20);

        // Add period info
        doc.setFontSize(11);
        doc.text(
            `Periode: ${formatShortDate(dateRange.start)} - ${formatShortDate(dateRange.end)}`,
            14,
            30,
        );

        // Add summary
        doc.setFontSize(10);
        doc.text(`Total Kas Masuk: ${formatCurrency(totalIncome)}`, 14, 40);
        doc.text(
            `Total Kas Keluar: ${formatCurrency(totalExpense)}`,
            14,
            46,
        );
        doc.text(`Saldo Akhir: ${formatCurrency(finalBalance)}`, 14, 52);

        // Add table
        const tableData = transactionsWithBalance.map((t) => [
            formatShortDate(t.tanggal),
            t.deskripsi,
            t.kategori,
            t.tipe === 'pemasukan' ? formatCurrency(Number(t.jumlah)) : '-',
            t.tipe === 'pengeluaran' ? formatCurrency(Number(t.jumlah)) : '-',
            formatCurrency(t.balance),
        ]);

        autoTable(doc, {
            startY: 60,
            head: [
                [
                    'Tanggal',
                    'Deskripsi',
                    'Kategori',
                    'Kas Masuk',
                    'Kas Keluar',
                    'Saldo',
                ],
            ],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185] },
            styles: { fontSize: 8 },
            columnStyles: {
                0: { cellWidth: 25 },
                1: { cellWidth: 45 },
                2: { cellWidth: 30 },
                3: { cellWidth: 30 },
                4: { cellWidth: 30 },
                5: { cellWidth: 30 },
            },
        });

        // Save PDF
        doc.save(
            `laporan-keuangan-${dateRange.start}-${dateRange.end}.pdf`,
        );

        toast({
            title: 'Berhasil',
            description: 'File PDF berhasil diunduh',
        });
    };

    const columns = [
        {
            key: 'tanggal',
            header: 'Tanggal',
            render: (t: Transaction & { balance: number }) =>
                formatShortDate(t.tanggal),
        },
        {
            key: 'deskripsi',
            header: 'Deskripsi',
        },
        {
            key: 'kategori',
            header: 'Kategori',
            render: (t: Transaction & { balance: number }) => (
                <span className="capitalize">{t.kategori}</span>
            ),
        },
        {
            key: 'income',
            header: 'Kas Masuk',
            render: (t: Transaction & { balance: number }) =>
                t.tipe === 'pemasukan' ? (
                    <span className="font-medium text-success">
                        {formatCurrency(Number(t.jumlah))}
                    </span>
                ) : (
                    <span className="text-muted-foreground">-</span>
                ),
        },
        {
            key: 'expense',
            header: 'Kas Keluar',
            render: (t: Transaction & { balance: number }) =>
                t.tipe === 'pengeluaran' ? (
                    <span className="font-medium text-destructive">
                        {formatCurrency(Number(t.jumlah))}
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
            <Head title="Laporan Keuangan" />
            <div className="animate-fade-in space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="page-header">Laporan Keuangan</h1>
                        <p className="mt-1 text-muted-foreground">
                            Rekap transaksi berdasarkan periode (Pemasukan &
                            Pengeluaran)
                        </p>
                    </div>
                    <Button onClick={exportToPDF} variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        Export PDF
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
