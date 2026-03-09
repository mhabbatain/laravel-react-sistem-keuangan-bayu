<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Owner user
        User::firstOrCreate(
            ['email' => 'byuu@sistem.com'],
            [
                'name' => 'Owner',
                'password' => 'password',
                'email_verified_at' => now(),
                'role' => 'owner',
            ]
        );

        // Admin Karyawan user
        User::firstOrCreate(
            ['email' => 'admin@sistem.com'],
            [
                'name' => 'Admin Karyawan',
                'password' => 'password',
                'email_verified_at' => now(),
                'role' => 'admin_karyawan',
            ]
        );

        // Seed data untuk sistem keuangan
        $this->call([
            KaryawanSeeder::class,
            SlipGajiSeeder::class,
            TransaksiSeeder::class,
        ]);
    }
}
D:\PROGRAMMING\LARAVEL\laravel-react-sistem-keuangan-bayu\database\seeders\DatabaseSeeder.php
