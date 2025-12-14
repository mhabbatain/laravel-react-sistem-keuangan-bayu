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
import { useState } from 'react';

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

interface TransactionFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (
        data: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>,
    ) => void;
    initialData?: Transaction;
}

const categories = [
    { value: 'pendapatan', label: 'Pendapatan' },
    { value: 'pengeluaran', label: 'Pengeluaran' },
    { value: 'operasional', label: 'Operasional' },
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
                tanggal: initialData.tanggal,
                kategori: initialData.kategori,
                deskripsi: initialData.deskripsi,
                jumlah: initialData.jumlah.toString(),
                tipe: initialData.tipe,
            };
        }
        return {
            tanggal: new Date().toISOString().split('T')[0],
            kategori: '',
            deskripsi: '',
            jumlah: '',
            tipe: '' as 'pemasukan' | 'pengeluaran' | '',
        };
    };

    const [formData, setFormData] = useState(getInitialFormData);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.tipe) return;

        onSubmit({
            tanggal: formData.tanggal,
            kategori: formData.kategori,
            deskripsi: formData.deskripsi,
            jumlah: parseFloat(formData.jumlah),
            tipe: formData.tipe,
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
                        <Label htmlFor="tanggal">Tanggal</Label>
                        <Input
                            id="tanggal"
                            type="date"
                            value={formData.tanggal}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    tanggal: e.target.value,
                                })
                            }
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tipe">Jenis Transaksi</Label>
                        <Select
                            value={formData.tipe}
                            onValueChange={(
                                value: 'pemasukan' | 'pengeluaran',
                            ) => setFormData({ ...formData, tipe: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih jenis transaksi" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pemasukan">
                                    Kas Masuk
                                </SelectItem>
                                <SelectItem value="pengeluaran">
                                    Kas Keluar
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="kategori">Kategori</Label>
                        <Select
                            value={formData.kategori}
                            onValueChange={(value) =>
                                setFormData({ ...formData, kategori: value })
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
                        <Label htmlFor="deskripsi">Deskripsi</Label>
                        <Input
                            id="deskripsi"
                            value={formData.deskripsi}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    deskripsi: e.target.value,
                                })
                            }
                            placeholder="Masukkan deskripsi"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="jumlah">Nominal (Rp)</Label>
                        <Input
                            id="jumlah"
                            type="number"
                            value={formData.jumlah}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    jumlah: e.target.value,
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
