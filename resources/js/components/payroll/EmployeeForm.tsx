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
import { Employee } from '@/lib/repositories/employeeRepository';
import { useState } from 'react';

interface EmployeeFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: Omit<Employee, 'id' | 'createdAt'>) => void;
    initialData?: Employee;
}

export function EmployeeForm({
    open,
    onOpenChange,
    onSubmit,
    initialData,
}: EmployeeFormProps) {
    const getInitialFormData = () => ({
        name: initialData?.name || '',
        position: initialData?.position || '',
        salaryType: (initialData?.salaryType || '') as 'fixed' | 'daily' | '',
        baseSalary: initialData?.baseSalary.toString() || '',
    });

    const [formData, setFormData] = useState(getInitialFormData());
    const [prevInitialData, setPrevInitialData] = useState(initialData);

    if (initialData !== prevInitialData) {
        setPrevInitialData(initialData);
        setFormData(getInitialFormData());
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.salaryType) return;

        onSubmit({
            name: formData.name,
            position: formData.position,
            salaryType: formData.salaryType,
            baseSalary: parseFloat(formData.baseSalary),
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
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            placeholder="Masukkan nama karyawan"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="position">Jabatan</Label>
                        <Input
                            id="position"
                            value={formData.position}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    position: e.target.value,
                                })
                            }
                            placeholder="Masukkan jabatan"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="salaryType">Tipe Gaji</Label>
                        <Select
                            value={formData.salaryType}
                            onValueChange={(value: 'fixed' | 'daily') =>
                                setFormData({ ...formData, salaryType: value })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih tipe gaji" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="fixed">
                                    Gaji Tetap (Bulanan)
                                </SelectItem>
                                <SelectItem value="daily">
                                    Gaji Harian
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="baseSalary">
                            {formData.salaryType === 'daily'
                                ? 'Gaji per Hari (Rp)'
                                : 'Gaji Pokok (Rp)'}
                        </Label>
                        <Input
                            id="baseSalary"
                            type="number"
                            value={formData.baseSalary}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    baseSalary: e.target.value,
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
