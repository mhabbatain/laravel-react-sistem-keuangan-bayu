<?php

use App\Http\Controllers\BerandaController;
use App\Http\Controllers\LaporanKeuanganController;
use App\Http\Controllers\GajiKaryawanController;
use App\Http\Controllers\KaryawanController;
use App\Http\Controllers\LabaController;
use App\Http\Controllers\SlipGajiController;
use App\Http\Controllers\TransaksiController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    // Routes accessible by all authenticated users
    Route::get('beranda', [BerandaController::class, 'index'])->name('beranda');
    Route::get('laporan-keuangan', [LaporanKeuanganController::class, 'index'])->name('laporan-keuangan');
    Route::resource('transaksi', TransaksiController::class);

    // Routes only accessible by Owner
    Route::middleware(['role:owner'])->group(function () {
        Route::get('laba', [LabaController::class, 'index'])->name('laba');
        Route::resource('gaji-karyawan', GajiKaryawanController::class);

        // Karyawan routes
        Route::post('karyawan', [KaryawanController::class, 'store'])->name('karyawan.store');
        Route::put('karyawan/{karyawan}', [KaryawanController::class, 'update'])->name('karyawan.update');
        Route::delete('karyawan/{karyawan}', [KaryawanController::class, 'destroy'])->name('karyawan.destroy');

        // Slip gaji routes
        Route::post('slip-gaji', [SlipGajiController::class, 'store'])->name('slip-gaji.store');
        Route::delete('slip-gaji/{slipGaji}', [SlipGajiController::class, 'destroy'])->name('slip-gaji.destroy');
        Route::get('slip-gaji/{slipGaji}/print', [SlipGajiController::class, 'print'])->name('slip-gaji.print');
    });
});

require __DIR__ . '/settings.php';
