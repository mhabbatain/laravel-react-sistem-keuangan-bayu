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
import { formatCurrency, getCurrentPeriod } from '@/lib/formatters';
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

interface GajiKaryawanSlipFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: {
        karyawan_id: number;
        periode: string;
        gaji_pokok: number;
        gaji_bersih: number;
    }) => void;
    employees: Employee[];
}

export function GajiKaryawanSlipForm({
    open,
    onOpenChange,
    onSubmit,
    employees,
}: GajiKaryawanSlipFormProps) {
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [period, setPeriod] = useState(getCurrentPeriod());

    const selectedEmployee = employees.find(
        (e) => e.id.toString() === selectedEmployeeId,
    );
    const baseSalary = selectedEmployee?.gaji_pokok || 0;

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            setSelectedEmployeeId('');
            setPeriod(getCurrentPeriod());
        }
        onOpenChange(newOpen);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEmployee) return;

        onSubmit({
            karyawan_id: selectedEmployee.id,
            periode: period,
            gaji_pokok: selectedEmployee.gaji_pokok,
            gaji_bersih: selectedEmployee.gaji_pokok,
        });
        handleOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Buat Slip Gaji</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="employee">Karyawan</Label>
                        <Select
                            value={selectedEmployeeId}
                            onValueChange={setSelectedEmployeeId}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih karyawan" />
                            </SelectTrigger>
                            <SelectContent>
                                {employees.map((emp) => (
                                    <SelectItem
                                        key={emp.id}
                                        value={emp.id.toString()}
                                    >
                                        {emp.nama} - {emp.jabatan}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="period">Periode</Label>
                        <Input
                            id="period"
                            type="month"
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            required
                        />
                    </div>

                    {selectedEmployee && (
                        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Gaji Bersih</span>
                                <span className="text-xl font-bold text-primary">
                                    {formatCurrency(baseSalary)}
                                </span>
                            </div>
                        </div>
                    )}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleOpenChange(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={!selectedEmployee}
                        >
                            Buat Slip Gaji
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
