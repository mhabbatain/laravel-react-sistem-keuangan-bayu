import { formatCurrency } from '@/lib/formatters';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: number;
    icon: LucideIcon;
    variant: 'income' | 'expense' | 'balance';
}

export function StatCard({ title, value, icon: Icon, variant }: StatCardProps) {
    const variantClasses = {
        income: 'stat-card-income',
        expense: 'stat-card-expense',
        balance: 'stat-card-balance',
    };

    const iconClasses = {
        income: 'text-success',
        expense: 'text-destructive',
        balance: 'text-blue-800',
    };

    return (
        <div
            className={`stat-card ${variantClasses[variant]} animate-slide-up`}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">
                        {title}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-foreground">
                        {formatCurrency(value)}
                    </p>
                </div>
                <div
                    className={`rounded-lg p-2 ${variant === 'income' ? 'bg-success/10' : variant === 'expense' ? 'bg-destructive/10' : 'bg-accent/10'}`}
                >
                    <Icon className={`h-5 w-5 ${iconClasses[variant]}`} />
                </div>
            </div>
        </div>
    );
}
