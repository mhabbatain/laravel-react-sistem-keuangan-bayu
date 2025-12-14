<?php

namespace Database\Seeders;

use App\Models\Transaksi;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TransaksiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $transaksi = [
            // Pemasukan
            [
                'tanggal' => now()->subDays(10)->format('Y-m-d'),
                'kategori' => 'Penjualan',
                'deskripsi' => 'Penjualan produk ke PT ABC',
                'jumlah' => 15000000,
                'tipe' => 'pemasukan',
                'created_at' => now()->subDays(10),
                'updated_at' => now()->subDays(10),
            ],
            [
                'tanggal' => now()->subDays(9)->format('Y-m-d'),
                'kategori' => 'Jasa',
                'deskripsi' => 'Pendapatan jasa konsultasi',
                'jumlah' => 5000000,
                'tipe' => 'pemasukan',
                'created_at' => now()->subDays(9),
                'updated_at' => now()->subDays(9),
            ],
            [
                'tanggal' => now()->subDays(7)->format('Y-m-d'),
                'kategori' => 'Penjualan',
                'deskripsi' => 'Penjualan retail',
                'jumlah' => 8500000,
                'tipe' => 'pemasukan',
                'created_at' => now()->subDays(7),
                'updated_at' => now()->subDays(7),
            ],
            [
                'tanggal' => now()->subDays(5)->format('Y-m-d'),
                'kategori' => 'Investasi',
                'deskripsi' => 'Dividen investasi',
                'jumlah' => 3000000,
                'tipe' => 'pemasukan',
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(5),
            ],
            // Pengeluaran
            [
                'tanggal' => now()->subDays(8)->format('Y-m-d'),
                'kategori' => 'Operasional',
                'deskripsi' => 'Pembelian alat tulis kantor',
                'jumlah' => 750000,
                'tipe' => 'pengeluaran',
                'created_at' => now()->subDays(8),
                'updated_at' => now()->subDays(8),
            ],
            [
                'tanggal' => now()->subDays(6)->format('Y-m-d'),
                'kategori' => 'Utilitas',
                'deskripsi' => 'Pembayaran listrik dan air',
                'jumlah' => 2500000,
                'tipe' => 'pengeluaran',
                'created_at' => now()->subDays(6),
                'updated_at' => now()->subDays(6),
            ],
            [
                'tanggal' => now()->subDays(4)->format('Y-m-d'),
                'kategori' => 'Pembelian',
                'deskripsi' => 'Pembelian stok barang',
                'jumlah' => 12000000,
                'tipe' => 'pengeluaran',
                'created_at' => now()->subDays(4),
                'updated_at' => now()->subDays(4),
            ],
            [
                'tanggal' => now()->subDays(3)->format('Y-m-d'),
                'kategori' => 'Gaji',
                'deskripsi' => 'Pembayaran gaji karyawan bulan ini',
                'jumlah' => 31000000,
                'tipe' => 'pengeluaran',
                'created_at' => now()->subDays(3),
                'updated_at' => now()->subDays(3),
            ],
            [
                'tanggal' => now()->subDays(2)->format('Y-m-d'),
                'kategori' => 'Transportasi',
                'deskripsi' => 'Biaya pengiriman barang',
                'jumlah' => 1500000,
                'tipe' => 'pengeluaran',
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2),
            ],
            [
                'tanggal' => now()->subDay()->format('Y-m-d'),
                'kategori' => 'Pemasaran',
                'deskripsi' => 'Biaya iklan online',
                'jumlah' => 3500000,
                'tipe' => 'pengeluaran',
                'created_at' => now()->subDay(),
                'updated_at' => now()->subDay(),
            ],
            [
                'tanggal' => now()->format('Y-m-d'),
                'kategori' => 'Penjualan',
                'deskripsi' => 'Penjualan hari ini',
                'jumlah' => 6500000,
                'tipe' => 'pemasukan',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($transaksi as $data) {
            Transaksi::create($data);
        }
    }
}
