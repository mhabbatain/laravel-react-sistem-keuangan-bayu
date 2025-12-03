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
import { Employee } from '@/lib/repositories/employeeRepository';
import { GajiKaryawanSlip } from '@/lib/repositories/gajiKaryawanRepository';
import { useState } from 'react';

interface GajiKaryawanSlipFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: Omit<GajiKaryawanSlip, 'id' | 'createdAt'>) => void;
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
    const [allowance, setAllowance] = useState('0');
    const [deduction, setDeduction] = useState('0');

    const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId);
    const baseSalary = selectedEmployee?.baseSalary || 0;
    const netSalary =
        baseSalary +
        parseFloat(allowance || '0') -
        parseFloat(deduction || '0');

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            setSelectedEmployeeId('');
            setPeriod(getCurrentPeriod());
            setAllowance('0');
            setDeduction('0');
        }
        onOpenChange(newOpen);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEmployee) return;

        onSubmit({
            employeeId: selectedEmployee.id,
            employeeName: selectedEmployee.name,
            position: selectedEmployee.position,
            period,
            baseSalary: selectedEmployee.baseSalary,
            allowance: parseFloat(allowance || '0'),
            deduction: parseFloat(deduction || '0'),
            netSalary,
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
                                    <SelectItem key={emp.id} value={emp.id}>
                                        {emp.name} - {emp.position}
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
                        <div className="space-y-2 rounded-lg bg-muted p-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Gaji Pokok
                                </span>
                                <span className="font-medium">
                                    {formatCurrency(baseSalary)}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="allowance">Tunjangan (Rp)</Label>
                        <Input
                            id="allowance"
                            type="number"
                            value={allowance}
                            onChange={(e) => setAllowance(e.target.value)}
                            placeholder="0"
                            min="0"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="deduction">Potongan (Rp)</Label>
                        <Input
                            id="deduction"
                            type="number"
                            value={deduction}
                            onChange={(e) => setDeduction(e.target.value)}
                            placeholder="0"
                            min="0"
                        />
                    </div>

                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                        <div className="flex items-center justify-between">
                            <span className="font-medium">Gaji Bersih</span>
                            <span className="text-xl font-bold text-primary">
                                {formatCurrency(netSalary)}
                            </span>
                        </div>
                    </div>
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
