<?php

use App\Http\Controllers\BerandaController;
use App\Http\Controllers\BukuKasController;
use App\Http\Controllers\GajiKaryawanController;
use App\Http\Controllers\LabaController;
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

    Route::get('beranda', [BerandaController::class, 'index'])->name('beranda');
    Route::get('laba', [LabaController::class, 'index'])->name('laba');
    Route::get('buku-kas', [BukuKasController::class, 'index'])->name('buku-kas');

    Route::resource('transaksi', TransaksiController::class);
    Route::resource('gaji-karyawan', GajiKaryawanController::class);
});

require __DIR__ . '/settings.php';
