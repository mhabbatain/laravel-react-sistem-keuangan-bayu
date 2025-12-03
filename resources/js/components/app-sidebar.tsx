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
import { beranda, bukuKas, laba } from '@/routes';
import gajiKaryawan from '@/routes/gaji-karyawan';
import transaksi from '@/routes/transaksi';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    ArrowLeftRight,
    BookOpen,
    Folder,
    LayoutGrid,
    TrendingUp,
    Users,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
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
        title: 'Buku Kas',
        href: bukuKas(),
        icon: BookOpen,
    },
    {
        title: 'Gaji Karyawan',
        href: gajiKaryawan.index(),
        icon: Users,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
];

export function AppSidebar() {
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
