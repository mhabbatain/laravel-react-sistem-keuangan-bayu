import { StatCard } from '@/components/shared/stat-card';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatShortDate } from '@/lib/formatters';
import {
    Transaction,
    transactionRepository,
} from '@/lib/repositories/transactionRepository';
import { beranda } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    ArrowDownRight,
    ArrowUpRight,
    TrendingDown,
    TrendingUp,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Beranda',
        href: beranda().url,
    },
];

export default function Beranda() {
    const [transactions] = useState<Transaction[]>(() =>
        transactionRepository.getAll(),
    );

    const totalIncome = transactionRepository.getTotalIncome(transactions);
    const totalExpense = transactionRepository.getTotalExpense(transactions);
    const balance = transactionRepository.getBalance(transactions);

    // Group transactions by month for chart
    const chartData = transactions.reduce(
        (
            acc: Record<
                string,
                { month: string; income: number; expense: number }
            >,
            t,
        ) => {
            const month = t.date.substring(0, 7);
            if (!acc[month]) {
                acc[month] = { month, income: 0, expense: 0 };
            }
            if (t.type === 'income') {
                acc[month].income += t.amount;
            } else {
                acc[month].expense += t.amount;
            }
            return acc;
        },
        {},
    );

    const chartDataArray = Object.values(chartData).sort((a, b) =>
        a.month.localeCompare(b.month),
    );

    const recentTransactions = [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

    const chartColors = {
        income: '#22c55e', // green-500
        expense: '#ef4444', // red-500
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Beranda" />
            <div className="animate-fade-in space-y-8">
                <div>
                    <h1 className="page-header">Beranda</h1>
                    <p className="mt-1 text-muted-foreground">
                        Ringkasan keuangan Anda
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    <StatCard
                        title="Total Kas Masuk"
                        value={totalIncome}
                        icon={TrendingUp}
                        variant="income"
                    />
                    <StatCard
                        title="Total Kas Keluar"
                        value={totalExpense}
                        icon={TrendingDown}
                        variant="expense"
                    />
                    <StatCard
                        title="Saldo Akhir"
                        value={balance}
                        icon={Wallet}
                        variant="balance"
                    />
                </div>

                {/* Chart */}
                <div className="animate-slide-up rounded-xl border border-border bg-card p-6">
                    <h2 className="section-header mb-6">
                        Grafik Kas Masuk & Keluar
                    </h2>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartDataArray}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    className="stroke-border"
                                />
                                <XAxis
                                    dataKey="month"
                                    className="stroke-muted-foreground"
                                    fontSize={12}
                                />
                                <YAxis
                                    className="stroke-muted-foreground"
                                    fontSize={12}
                                    tickFormatter={(value) =>
                                        `${value / 1000000}jt`
                                    }
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'oklch(var(--card))',
                                        border: '1px solid oklch(var(--border))',
                                        borderRadius: '8px',
                                    }}
                                    formatter={(value: number) =>
                                        formatCurrency(value)
                                    }
                                />
                                <Legend />
                                <Bar
                                    dataKey="income"
                                    name="Kas Masuk"
                                    fill={chartColors.income}
                                    radius={[4, 4, 0, 0]}
                                />
                                <Bar
                                    dataKey="expense"
                                    name="Kas Keluar"
                                    fill={chartColors.expense}
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="animate-slide-up rounded-xl border border-border bg-card p-6">
                    <h2 className="section-header mb-6">Transaksi Terbaru</h2>
                    <div className="space-y-4">
                        {recentTransactions.map((t) => (
                            <div
                                key={t.id}
                                className="flex items-center justify-between border-b border-border py-3 last:border-0"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                                            t.type === 'income'
                                                ? 'bg-success/10'
                                                : 'bg-destructive/10'
                                        }`}
                                    >
                                        {t.type === 'income' ? (
                                            <ArrowUpRight className="h-5 w-5 text-success" />
                                        ) : (
                                            <ArrowDownRight className="h-5 w-5 text-destructive" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">
                                            {t.description}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {formatShortDate(t.date)}
                                        </p>
                                    </div>
                                </div>
                                <span
                                    className={`font-semibold ${t.type === 'income' ? 'text-success' : 'text-destructive'}`}
                                >
                                    {t.type === 'income' ? '+' : '-'}
                                    {formatCurrency(t.amount)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
