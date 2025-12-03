import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, getDateRangeForPeriod } from '@/lib/formatters';
import { transactionRepository } from '@/lib/repositories/transactionRepository';
import { laba } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';

type PeriodType = 'daily' | 'monthly' | 'yearly';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Laba',
        href: laba().url,
    },
];
export default function ProfitLoss() {
    const [periodType, setPeriodType] = useState<PeriodType>('monthly');
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split('T')[0],
    );

    const filteredTransactions = useMemo(() => {
        const date = new Date(selectedDate);
        const range = getDateRangeForPeriod(periodType, date);
        return transactionRepository.getByDateRange(range.start, range.end);
    }, [periodType, selectedDate]);

    const revenue = useMemo(() => {
        return filteredTransactions
            .filter((t) => t.type === 'income' && t.category === 'pendapatan')
            .reduce((sum, t) => sum + t.amount, 0);
    }, [filteredTransactions]);

    const costs = useMemo(() => {
        return filteredTransactions
            .filter((t) => t.type === 'expense' && t.category === 'biaya')
            .reduce((sum, t) => sum + t.amount, 0);
    }, [filteredTransactions]);

    const profit = revenue - costs;
    const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;

    const incomeBreakdown = useMemo(() => {
        const breakdown: Record<string, number> = {};
        filteredTransactions
            .filter((t) => t.type === 'income')
            .forEach((t) => {
                breakdown[t.category] = (breakdown[t.category] || 0) + t.amount;
            });
        return Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
    }, [filteredTransactions]);

    const expenseBreakdown = useMemo(() => {
        const breakdown: Record<string, number> = {};
        filteredTransactions
            .filter((t) => t.type === 'expense')
            .forEach((t) => {
                breakdown[t.category] = (breakdown[t.category] || 0) + t.amount;
            });
        return Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
    }, [filteredTransactions]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buku Kas" />
            <div className="animate-fade-in space-y-6">
                <div>
                    <h1 className="page-header">Laporan Laba Rugi</h1>
                    <p className="mt-1 text-muted-foreground">
                        Analisis pendapatan dan biaya bisnis Anda
                    </p>
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
                                <SelectItem value="monthly">Bulanan</SelectItem>
                                <SelectItem value="yearly">Tahunan</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Tanggal</Label>
                        <Input
                            type={
                                periodType === 'yearly'
                                    ? 'number'
                                    : periodType === 'monthly'
                                      ? 'month'
                                      : 'date'
                            }
                            value={
                                periodType === 'yearly'
                                    ? selectedDate.substring(0, 4)
                                    : periodType === 'monthly'
                                      ? selectedDate.substring(0, 7)
                                      : selectedDate
                            }
                            onChange={(e) => {
                                if (periodType === 'yearly') {
                                    setSelectedDate(`${e.target.value}-01-01`);
                                } else if (periodType === 'monthly') {
                                    setSelectedDate(`${e.target.value}-01`);
                                } else {
                                    setSelectedDate(e.target.value);
                                }
                            }}
                            className="w-[180px]"
                        />
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="stat-card stat-card-income">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Pendapatan
                                </p>
                                <p className="mt-2 text-2xl font-bold text-foreground">
                                    {formatCurrency(revenue)}
                                </p>
                            </div>
                            <div className="bg-success/10 rounded-lg p-2">
                                <TrendingUp className="text-success h-5 w-5" />
                            </div>
                        </div>
                    </div>

                    <div className="stat-card stat-card-expense">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Biaya
                                </p>
                                <p className="mt-2 text-2xl font-bold text-foreground">
                                    {formatCurrency(costs)}
                                </p>
                            </div>
                            <div className="rounded-lg bg-destructive/10 p-2">
                                <TrendingDown className="h-5 w-5 text-destructive" />
                            </div>
                        </div>
                    </div>

                    <div
                        className={`stat-card ${profit >= 0 ? 'stat-card-balance' : 'stat-card-expense'}`}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Laba/Rugi
                                </p>
                                <p
                                    className={`mt-2 text-2xl font-bold ${profit >= 0 ? 'text-accent' : 'text-destructive'}`}
                                >
                                    {formatCurrency(profit)}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Margin: {profitMargin.toFixed(1)}%
                                </p>
                            </div>
                            <div
                                className={`rounded-lg p-2 ${profit >= 0 ? 'bg-accent/10' : 'bg-destructive/10'}`}
                            >
                                <DollarSign
                                    className={`h-5 w-5 ${profit >= 0 ? 'text-accent' : 'text-destructive'}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Income Breakdown */}
                    <div className="rounded-xl border border-border bg-card p-6">
                        <h3 className="section-header mb-4">
                            Rincian Pendapatan
                        </h3>
                        {incomeBreakdown.length === 0 ? (
                            <p className="py-8 text-center text-muted-foreground">
                                Tidak ada data pendapatan
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {incomeBreakdown.map(([category, amount]) => (
                                    <div
                                        key={category}
                                        className="flex items-center justify-between"
                                    >
                                        <span className="text-muted-foreground capitalize">
                                            {category}
                                        </span>
                                        <span className="text-success font-medium">
                                            {formatCurrency(amount)}
                                        </span>
                                    </div>
                                ))}
                                <div className="flex items-center justify-between border-t border-border pt-4">
                                    <span className="font-semibold">
                                        Total Pendapatan
                                    </span>
                                    <span className="text-success font-bold">
                                        {formatCurrency(revenue)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Expense Breakdown */}
                    <div className="rounded-xl border border-border bg-card p-6">
                        <h3 className="section-header mb-4">Rincian Biaya</h3>
                        {expenseBreakdown.length === 0 ? (
                            <p className="py-8 text-center text-muted-foreground">
                                Tidak ada data biaya
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {expenseBreakdown.map(([category, amount]) => (
                                    <div
                                        key={category}
                                        className="flex items-center justify-between"
                                    >
                                        <span className="text-muted-foreground capitalize">
                                            {category}
                                        </span>
                                        <span className="font-medium text-destructive">
                                            {formatCurrency(amount)}
                                        </span>
                                    </div>
                                ))}
                                <div className="flex items-center justify-between border-t border-border pt-4">
                                    <span className="font-semibold">
                                        Total Biaya
                                    </span>
                                    <span className="font-bold text-destructive">
                                        {formatCurrency(costs)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Profit Statement */}
                <div className="rounded-xl border border-border bg-card p-6">
                    <h3 className="section-header mb-4">Laporan Laba Rugi</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between py-2">
                            <span>Total Pendapatan</span>
                            <span className="font-medium">
                                {formatCurrency(revenue)}
                            </span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span>Total Biaya</span>
                            <span className="font-medium">
                                ({formatCurrency(costs)})
                            </span>
                        </div>
                        <div className="flex justify-between border-t border-border pt-3">
                            <span className="text-lg font-bold">
                                Laba Bersih
                            </span>
                            <span
                                className={`text-lg font-bold ${profit >= 0 ? 'text-accent' : 'text-destructive'}`}
                            >
                                {formatCurrency(profit)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
