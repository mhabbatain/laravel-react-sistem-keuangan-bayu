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
    Legend,
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
                                    wrapperClassName="font-semibold bg-white border-2 rounded-lg"
                                    // contentStyle={{}}
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
