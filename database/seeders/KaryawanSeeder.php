<?php

namespace Database\Seeders;

use App\Models\Karyawan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class KaryawanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $karyawan = [
            [
                'nama' => 'Ahmad Wijaya',
                'jabatan' => 'Manager',
                'tipe_gaji' => 'tetap',
                'gaji_pokok' => 12000000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Siti Rahayu',
                'jabatan' => 'Akuntan',
                'tipe_gaji' => 'tetap',
                'gaji_pokok' => 8000000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Budi Santoso',
                'jabatan' => 'Staff Marketing',
                'tipe_gaji' => 'tetap',
                'gaji_pokok' => 6000000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Dewi Lestari',
                'jabatan' => 'Admin',
                'tipe_gaji' => 'tetap',
                'gaji_pokok' => 5000000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Rizki Pratama',
                'jabatan' => 'Kurir',
                'tipe_gaji' => 'harian',
                'gaji_pokok' => 150000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($karyawan as $data) {
            Karyawan::create($data);
        }
    }
}
