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

interface Employee {
    id: number;
    nama: string;
    jabatan: string;
    tipe_gaji: 'tetap' | 'harian';
    gaji_pokok: number;
    created_at: string;
    updated_at: string;
}

interface EmployeeFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: {
        nama: string;
        jabatan: string;
        tipe_gaji: 'tetap' | 'harian';
        gaji_pokok: number;
    }) => void;
    initialData?: Employee;
}

export function EmployeeForm({
    open,
    onOpenChange,
    onSubmit,
    initialData,
}: EmployeeFormProps) {
    const getInitialFormData = () => ({
        nama: initialData?.nama || '',
        jabatan: initialData?.jabatan || '',
        tipe_gaji: (initialData?.tipe_gaji || '') as 'tetap' | 'harian' | '',
        gaji_pokok: initialData?.gaji_pokok.toString() || '',
    });

    const [formData, setFormData] = useState(getInitialFormData());
    const [prevInitialData, setPrevInitialData] = useState(initialData);

    if (initialData !== prevInitialData) {
        setPrevInitialData(initialData);
        setFormData(getInitialFormData());
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.tipe_gaji) return;

        onSubmit({
            nama: formData.nama,
            jabatan: formData.jabatan,
            tipe_gaji: formData.tipe_gaji,
            gaji_pokok: parseFloat(formData.gaji_pokok),
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? 'Edit Karyawan' : 'Tambah Karyawan'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="nama">Nama Lengkap</Label>
                        <Input
                            id="nama"
                            value={formData.nama}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    nama: e.target.value,
                                })
                            }
                            placeholder="Masukkan nama karyawan"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="jabatan">Jabatan</Label>
                        <Input
                            id="jabatan"
                            value={formData.jabatan}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    jabatan: e.target.value,
                                })
                            }
                            placeholder="Masukkan jabatan"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tipe_gaji">Tipe Gaji</Label>
                        <Select
                            value={formData.tipe_gaji}
                            onValueChange={(value: 'tetap' | 'harian') =>
                                setFormData({ ...formData, tipe_gaji: value })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih tipe gaji" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="tetap">
                                    Gaji Tetap (Bulanan)
                                </SelectItem>
                                <SelectItem value="harian">
                                    Gaji Harian
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="gaji_pokok">
                            {formData.tipe_gaji === 'harian'
                                ? 'Gaji per Hari (Rp)'
                                : 'Gaji Pokok (Rp)'}
                        </Label>
                        <Input
                            id="gaji_pokok"
                            type="number"
                            value={formData.gaji_pokok}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    gaji_pokok: e.target.value,
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
