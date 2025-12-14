import { DataTable } from '@/components/shared/data-table';
import { TransactionForm } from '@/components/transactions/transaction-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatShortDate } from '@/lib/formatters';
import transaksi from '@/routes/transaksi';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Edit2, Plus, Search, Trash2 } from 'lucide-react';
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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transaksi',
        href: transaksi.index().url,
    },
];

export default function Transaksi({
    transactions: initialTransactions,
}: Props) {
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [formOpen, setFormOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<
        Transaction | undefined
    >();

    const filteredTransactions = useMemo(() => {
        return initialTransactions
            .filter((t) => {
                const matchesSearch =
                    t.deskripsi.toLowerCase().includes(search.toLowerCase()) ||
                    t.kategori.toLowerCase().includes(search.toLowerCase());
                const matchesType =
                    typeFilter === 'all' || t.tipe === typeFilter;
                const matchesCategory =
                    categoryFilter === 'all' || t.kategori === categoryFilter;
                return matchesSearch && matchesType && matchesCategory;
            })
            .sort(
                (a, b) =>
                    new Date(b.tanggal).getTime() -
                    new Date(a.tanggal).getTime(),
            );
    }, [initialTransactions, search, typeFilter, categoryFilter]);

    const categories = useMemo(() => {
        return [...new Set(initialTransactions.map((t) => t.kategori))];
    }, [initialTransactions]);

    const handleSubmit = (
        data: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>,
    ) => {
        if (editingTransaction) {
            router.put(transaksi.update(editingTransaction.id).url, data, {
                preserveScroll: true,
                onSuccess: () => {
                    setFormOpen(false);
                    setEditingTransaction(undefined);
                    toast({
                        title: 'Berhasil',
                        description: 'Transaksi berhasil diperbarui',
                    });
                },
            });
        } else {
            router.post(transaksi.store().url, data, {
                preserveScroll: true,
                onSuccess: () => {
                    setFormOpen(false);
                    toast({
                        title: 'Berhasil',
                        description: 'Transaksi berhasil ditambahkan',
                    });
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
            router.delete(transaksi.destroy(id).url, {
                preserveScroll: true,
                onSuccess: () => {
                    toast({
                        title: 'Berhasil',
                        description: 'Transaksi berhasil dihapus',
                    });
                },
            });
        }
    };

    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setFormOpen(true);
    };

    const columns = [
        {
            key: 'tanggal',
            header: 'Tanggal',
            render: (t: Transaction) => formatShortDate(t.tanggal),
        },
        {
            key: 'tipe',
            header: 'Jenis',
            render: (t: Transaction) => (
                <Badge
                    variant={t.tipe === 'pemasukan' ? 'default' : 'destructive'}
                    className={
                        t.tipe === 'pemasukan'
                            ? 'bg-success hover:bg-success/80'
                            : ''
                    }
                >
                    {t.tipe === 'pemasukan' ? 'Kas Masuk' : 'Kas Keluar'}
                </Badge>
            ),
        },
        {
            key: 'kategori',
            header: 'Kategori',
            render: (t: Transaction) => (
                <span className="capitalize">{t.kategori}</span>
            ),
        },
        {
            key: 'deskripsi',
            header: 'Deskripsi',
        },
        {
            key: 'jumlah',
            header: 'Nominal',
            render: (t: Transaction) => (
                <span
                    className={`font-semibold ${t.tipe === 'pemasukan' ? 'text-success' : 'text-destructive'}`}
                >
                    {t.tipe === 'pemasukan' ? '+' : '-'}
                    {formatCurrency(t.jumlah)}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'Aksi',
            render: (t: Transaction) => (
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(t)}
                    >
                        <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(t.id)}
                    >
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transaksi Kas" />
            <div className="animate-fade-in space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="page-header">Transaksi Kas</h1>
                        <p className="mt-1 text-muted-foreground">
                            Kelola semua transaksi kas masuk dan keluar
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            setEditingTransaction(undefined);
                            setFormOpen(true);
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Transaksi
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari transaksi..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Jenis Transaksi" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Jenis</SelectItem>
                            <SelectItem value="pemasukan">Kas Masuk</SelectItem>
                            <SelectItem value="pengeluaran">
                                Kas Keluar
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={categoryFilter}
                        onValueChange={setCategoryFilter}
                    >
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Kategori</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem
                                    key={cat}
                                    value={cat}
                                    className="capitalize"
                                >
                                    {cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <DataTable<Transaction>
                    columns={columns}
                    data={filteredTransactions}
                    emptyMessage="Tidak ada transaksi"
                />

                {/* Form Modal */}
                <TransactionForm
                    open={formOpen}
                    onOpenChange={setFormOpen}
                    onSubmit={handleSubmit}
                    initialData={editingTransaction}
                />
            </div>
        </AppLayout>
    );
}
