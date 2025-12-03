import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Transaction } from '@/lib/repositories/transactionRepository';
import { useState } from 'react';

interface TransactionFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: Omit<Transaction, 'id' | 'createdAt'>) => void;
    initialData?: Transaction;
}

const categories = [
    { value: 'pendapatan', label: 'Pendapatan' },
    { value: 'biaya', label: 'Biaya' },
    { value: 'operasional', label: 'Operasional' },
    { value: 'investasi', label: 'Investasi' },
    { value: 'lainnya', label: 'Lainnya' },
];

export function TransactionForm({
    open,
    onOpenChange,
    onSubmit,
    initialData,
}: TransactionFormProps) {
    const getInitialFormData = () => {
        if (initialData) {
            return {
                date: initialData.date,
                category: initialData.category,
                description: initialData.description,
                amount: initialData.amount.toString(),
                type: initialData.type,
            };
        }
        return {
            date: new Date().toISOString().split('T')[0],
            category: '',
            description: '',
            amount: '',
            type: '' as 'income' | 'expense' | '',
        };
    };

    const [formData, setFormData] = useState(getInitialFormData);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.type) return;

        onSubmit({
            date: formData.date,
            category: formData.category,
            description: formData.description,
            amount: parseFloat(formData.amount),
            type: formData.type,
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? 'Edit Transaksi' : 'Tambah Transaksi'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="date">Tanggal</Label>
                        <Input
                            id="date"
                            type="date"
                            value={formData.date}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    date: e.target.value,
                                })
                            }
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type">Jenis Transaksi</Label>
                        <Select
                            value={formData.type}
                            onValueChange={(value: 'income' | 'expense') =>
                                setFormData({ ...formData, type: value })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih jenis transaksi" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="income">
                                    Kas Masuk
                                </SelectItem>
                                <SelectItem value="expense">
                                    Kas Keluar
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Kategori</Label>
                        <Select
                            value={formData.category}
                            onValueChange={(value) =>
                                setFormData({ ...formData, category: value })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem
                                        key={cat.value}
                                        value={cat.value}
                                    >
                                        {cat.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Deskripsi</Label>
                        <Input
                            id="description"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                            placeholder="Masukkan deskripsi"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="amount">Nominal (Rp)</Label>
                        <Input
                            id="amount"
                            type="number"
                            value={formData.amount}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    amount: e.target.value,
                                })
                            }
                            placeholder="0"
                            min="0"
                            required
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => onOpenChange(false)}
                        >
                            Batal
                        </Button>
                        <Button type="submit" className="flex-1">
                            {initialData ? 'Simpan' : 'Tambah'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
