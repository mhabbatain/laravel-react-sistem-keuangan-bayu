import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { beranda, laba, laporanKeuangan } from '@/routes';
import gajiKaryawan from '@/routes/gaji-karyawan';
import transaksi from '@/routes/transaksi';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    ArrowLeftRight,
    BookOpen,
    Folder,
    LayoutGrid,
    TrendingUp,
    Users,
} from 'lucide-react';
import { useMemo } from 'react';
import AppLogo from './app-logo';

const allNavItems: NavItem[] = [
    {
        title: 'Beranda',
        href: beranda(),
        icon: LayoutGrid,
    },
    {
        title: 'Transaksi Kas',
        href: transaksi.index(),
        icon: ArrowLeftRight,
    },
    {
        title: 'Laporan Laba Rugi',
        href: laba(),
        icon: TrendingUp,
    },
    {
        title: 'Laporan Keuangan',
        href: laporanKeuangan(),
        icon: BookOpen,
    },
    {
        title: 'Gaji Karyawan',
        href: gajiKaryawan.index(),
        icon: Users,
    },
];

// Menu items accessible by Admin Karyawan
const adminKaryawanAllowedItems = ['Beranda', 'Transaksi Kas', 'Laporan Keuangan'];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/mhabbatain/laravel-react-sistem-keuangan-bayu',
        icon: Folder,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const userRole = auth.user?.role;

    const mainNavItems = useMemo(() => {
        // Owner can access all menu items
        if (userRole === 'owner') {
            return allNavItems;
        }

        // Admin Karyawan can only access specific menu items
        if (userRole === 'admin_karyawan') {
            return allNavItems.filter((item) =>
                adminKaryawanAllowedItems.includes(item.title)
            );
        }

        // Default: show all items (for when role is undefined during loading)
        return allNavItems;
    }, [userRole]);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={beranda()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
