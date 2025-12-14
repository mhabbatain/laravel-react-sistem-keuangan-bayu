<?php

namespace Database\Seeders;

use App\Models\SlipGaji;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SlipGajiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $slipGaji = [
            [
                'karyawan_id' => 1, // Ahmad Wijaya
                'periode' => '2024-01',
                'gaji_pokok' => 12000000,
                'tunjangan' => 2000000,
                'potongan' => 500000,
                'gaji_bersih' => 13500000,
                'created_at' => now()->subMonths(2),
                'updated_at' => now()->subMonths(2),
            ],
            [
                'karyawan_id' => 2, // Siti Rahayu
                'periode' => '2024-01',
                'gaji_pokok' => 8000000,
                'tunjangan' => 1000000,
                'potongan' => 300000,
                'gaji_bersih' => 8700000,
                'created_at' => now()->subMonths(2),
                'updated_at' => now()->subMonths(2),
            ],
            [
                'karyawan_id' => 3, // Budi Santoso
                'periode' => '2024-01',
                'gaji_pokok' => 6000000,
                'tunjangan' => 500000,
                'potongan' => 200000,
                'gaji_bersih' => 6300000,
                'created_at' => now()->subMonths(2),
                'updated_at' => now()->subMonths(2),
            ],
            [
                'karyawan_id' => 1, // Ahmad Wijaya
                'periode' => '2024-02',
                'gaji_pokok' => 12000000,
                'tunjangan' => 2000000,
                'potongan' => 500000,
                'gaji_bersih' => 13500000,
                'created_at' => now()->subMonth(),
                'updated_at' => now()->subMonth(),
            ],
            [
                'karyawan_id' => 2, // Siti Rahayu
                'periode' => '2024-02',
                'gaji_pokok' => 8000000,
                'tunjangan' => 1000000,
                'potongan' => 300000,
                'gaji_bersih' => 8700000,
                'created_at' => now()->subMonth(),
                'updated_at' => now()->subMonth(),
            ],
        ];

        foreach ($slipGaji as $data) {
            SlipGaji::create($data);
        }
    }
}
