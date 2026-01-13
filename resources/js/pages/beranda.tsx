import { StatCard } from '@/components/shared/stat-card';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatShortDate } from '@/lib/formatters';
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
import { useMemo } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Beranda',
        href: beranda().url,
    },
];

const CHART_COLORS = {
    income: '#22c55e', // green-500
    expense: '#ef4444', // red-500
};

// Category colors for pie charts
const CATEGORY_COLORS = [
    '#22c55e', // green-500
    '#3b82f6', // blue-500
    '#f59e0b', // amber-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
    '#14b8a6', // teal-500
    '#f97316', // orange-500
    '#6366f1', // indigo-500
];

export default function Beranda({ transactions }: Props) {
    const totalIncome = useMemo(() => {
        return transactions
            .filter((t) => t.tipe === 'pemasukan')
            .reduce((sum, t) => sum + Number(t.jumlah), 0);
    }, [transactions]);

    const totalExpense = useMemo(() => {
        return transactions
            .filter((t) => t.tipe === 'pengeluaran')
            .reduce((sum, t) => sum + Number(t.jumlah), 0);
    }, [transactions]);

    const balance = useMemo(() => {
        return totalIncome - totalExpense;
    }, [totalIncome, totalExpense]);

    // Group transactions by month for chart
    const chartData = useMemo(() => {
        return transactions.reduce(
            (
                acc: Record<
                    string,
                    { month: string; income: number; expense: number }
                >,
                t,
            ) => {
                const month = t.tanggal.substring(0, 7);
                if (!acc[month]) {
                    acc[month] = { month, income: 0, expense: 0 };
                }
                if (t.tipe === 'pemasukan') {
                    acc[month].income += Number(t.jumlah);
                } else {
                    acc[month].expense += Number(t.jumlah);
                }
                return acc;
            },
            {},
        );
    }, [transactions]);

    const chartDataArray = useMemo(() => {
        return Object.values(chartData).sort((a, b) =>
            a.month.localeCompare(b.month),
        );
    }, [chartData]);

    const recentTransactions = useMemo(() => {
        return [...transactions]
            .sort(
                (a, b) =>
                    new Date(b.tanggal).getTime() -
                    new Date(a.tanggal).getTime(),
            )
            .slice(0, 5);
    }, [transactions]);

    // Group transactions by category for income
    const incomeByCategoryData = useMemo(() => {
        const grouped = transactions
            .filter((t) => t.tipe === 'pemasukan')
            .reduce((acc: Record<string, number>, t) => {
                if (!acc[t.kategori]) {
                    acc[t.kategori] = 0;
                }
                acc[t.kategori] += Number(t.jumlah);
                return acc;
            }, {});

        return Object.entries(grouped).map(([name, value], index) => ({
            name,
            value,
            color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
        }));
    }, [transactions]);

    // Group transactions by category for expense
    const expenseByCategoryData = useMemo(() => {
        const grouped = transactions
            .filter((t) => t.tipe === 'pengeluaran')
            .reduce((acc: Record<string, number>, t) => {
                if (!acc[t.kategori]) {
                    acc[t.kategori] = 0;
                }
                acc[t.kategori] += Number(t.jumlah);
                return acc;
            }, {});

        return Object.entries(grouped).map(([name, value], index) => ({
            name,
            value,
            color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
        }));
    }, [transactions]);

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
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="animate-slide-up rounded-xl border border-border bg-card p-6 lg:col-span-2">
                        <h2 className="section-header mb-6">
                            Grafik Kas Masuk & Keluar per Bulan
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
                                        wrapperClassName="font-semibold bg-white border-2 rounded-lg"
                                        formatter={(value: number) =>
                                            formatCurrency(value)
                                        }
                                    />
                                    <Legend />
                                    <Bar
                                        dataKey="income"
                                        name="Kas Masuk"
                                        fill={CHART_COLORS.income}
                                        radius={[4, 4, 0, 0]}
                                    />
                                    <Bar
                                        dataKey="expense"
                                        name="Kas Keluar"
                                        fill={CHART_COLORS.expense}
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="animate-slide-up rounded-xl border border-border bg-card p-6">
                        <h2 className="section-header mb-6">
                            Total Distribusi Kas
                        </h2>
                        <div className="h-[300px]">
                            {totalIncome > 0 || totalExpense > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[
                                                {
                                                    name: 'Kas Masuk',
                                                    value: totalIncome,
                                                    color: CHART_COLORS.income,
                                                },
                                                {
                                                    name: 'Kas Keluar',
                                                    value: totalExpense,
                                                    color: CHART_COLORS.expense,
                                                },
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={90}
                                            paddingAngle={3}
                                            dataKey="value"
                                            label={({ name, percent }) =>
                                                `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
                                            }
                                            labelLine={false}
                                        >
                                            <Cell fill={CHART_COLORS.income} />
                                            <Cell fill={CHART_COLORS.expense} />
                                        </Pie>
                                        <Tooltip
                                            wrapperClassName="font-semibold bg-white border-2 rounded-lg"
                                            formatter={(value: number) =>
                                                formatCurrency(value)
                                            }
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center text-muted-foreground">
                                    Belum ada data transaksi
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Category Charts */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="animate-slide-up rounded-xl border border-border bg-card p-6">
                        <h2 className="section-header mb-6">
                            Kas Masuk per Kategori
                        </h2>
                        <div className="h-[300px]">
                            {incomeByCategoryData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={incomeByCategoryData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={90}
                                            paddingAngle={3}
                                            dataKey="value"
                                            label={({ name, percent }) =>
                                                `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
                                            }
                                            labelLine={false}
                                        >
                                            {incomeByCategoryData.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-income-${index}`}
                                                        fill={entry.color}
                                                    />
                                                ),
                                            )}
                                        </Pie>
                                        <Tooltip
                                            wrapperClassName="font-semibold bg-white border-2 rounded-lg"
                                            formatter={(value: number) =>
                                                formatCurrency(value)
                                            }
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center text-muted-foreground">
                                    Belum ada data kas masuk
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="animate-slide-up rounded-xl border border-border bg-card p-6">
                        <h2 className="section-header mb-6">
                            Kas Keluar per Kategori
                        </h2>
                        <div className="h-[300px]">
                            {expenseByCategoryData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={expenseByCategoryData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={90}
                                            paddingAngle={3}
                                            dataKey="value"
                                            label={({ name, percent }) =>
                                                `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
                                            }
                                            labelLine={false}
                                        >
                                            {expenseByCategoryData.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-expense-${index}`}
                                                        fill={entry.color}
                                                    />
                                                ),
                                            )}
                                        </Pie>
                                        <Tooltip
                                            wrapperClassName="font-semibold bg-white border-2 rounded-lg"
                                            formatter={(value: number) =>
                                                formatCurrency(value)
                                            }
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center text-muted-foreground">
                                    Belum ada data kas keluar
                                </div>
                            )}
                        </div>
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
                                            t.tipe === 'pemasukan'
                                                ? 'bg-success/10'
                                                : 'bg-destructive/10'
                                        }`}
                                    >
                                        {t.tipe === 'pemasukan' ? (
                                            <ArrowUpRight className="h-5 w-5 text-success" />
                                        ) : (
                                            <ArrowDownRight className="h-5 w-5 text-destructive" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">
                                            {t.deskripsi}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {formatShortDate(t.tanggal)}
                                        </p>
                                    </div>
                                </div>
                                <span
                                    className={`font-semibold ${t.tipe === 'pemasukan' ? 'text-success' : 'text-destructive'}`}
                                >
                                    {t.tipe === 'pemasukan' ? '+' : '-'}
                                    {formatCurrency(t.jumlah)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
