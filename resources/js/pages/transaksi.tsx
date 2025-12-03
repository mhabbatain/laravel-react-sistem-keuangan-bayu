import { DataTable } from '@/components/shared/data-table';
import { TransactionForm } from '@/components/transactions/TransactionForm';
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
import { formatCurrency, formatShortDate } from '@/lib/formatters';
import {
    Transaction,
    transactionRepository,
} from '@/lib/repositories/transactionRepository';
import { Edit2, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export default function Transactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [formOpen, setFormOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<
        Transaction | undefined
    >();

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = () => {
        setTransactions(transactionRepository.getAll());
    };

    const filteredTransactions = useMemo(() => {
        return transactions
            .filter((t) => {
                const matchesSearch =
                    t.description
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                    t.category.toLowerCase().includes(search.toLowerCase());
                const matchesType =
                    typeFilter === 'all' || t.type === typeFilter;
                const matchesCategory =
                    categoryFilter === 'all' || t.category === categoryFilter;
                return matchesSearch && matchesType && matchesCategory;
            })
            .sort(
                (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime(),
            );
    }, [transactions, search, typeFilter, categoryFilter]);

    const categories = useMemo(() => {
        return [...new Set(transactions.map((t) => t.category))];
    }, [transactions]);

    const handleSubmit = (data: Omit<Transaction, 'id' | 'createdAt'>) => {
        if (editingTransaction) {
            transactionRepository.update(editingTransaction.id, data);
            toast({
                title: 'Berhasil',
                description: 'Transaksi berhasil diperbarui',
            });
        } else {
            transactionRepository.create(data);
            toast({
                title: 'Berhasil',
                description: 'Transaksi berhasil ditambahkan',
            });
        }
        loadTransactions();
        setEditingTransaction(undefined);
    };

    const handleDelete = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
            transactionRepository.delete(id);
            toast({
                title: 'Berhasil',
                description: 'Transaksi berhasil dihapus',
            });
            loadTransactions();
        }
    };

    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setFormOpen(true);
    };

    const columns = [
        {
            key: 'date',
            header: 'Tanggal',
            render: (t: Transaction) => formatShortDate(t.date),
        },
        {
            key: 'type',
            header: 'Jenis',
            render: (t: Transaction) => (
                <Badge
                    variant={t.type === 'income' ? 'default' : 'destructive'}
                    className={
                        t.type === 'income'
                            ? 'bg-success hover:bg-success/80'
                            : ''
                    }
                >
                    {t.type === 'income' ? 'Kas Masuk' : 'Kas Keluar'}
                </Badge>
            ),
        },
        {
            key: 'category',
            header: 'Kategori',
            render: (t: Transaction) => (
                <span className="capitalize">{t.category}</span>
            ),
        },
        {
            key: 'description',
            header: 'Deskripsi',
        },
        {
            key: 'amount',
            header: 'Nominal',
            render: (t: Transaction) => (
                <span
                    className={`font-semibold ${t.type === 'income' ? 'text-success' : 'text-destructive'}`}
                >
                    {t.type === 'income' ? '+' : '-'}
                    {formatCurrency(t.amount)}
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
                        <SelectItem value="income">Kas Masuk</SelectItem>
                        <SelectItem value="expense">Kas Keluar</SelectItem>
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
            <DataTable
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
    );
}
