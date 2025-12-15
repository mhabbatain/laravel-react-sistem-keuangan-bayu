<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\SlipGaji;
use App\Models\Transaksi;
use App\Models\Karyawan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

class SlipGajiController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'karyawan_id' => 'required|exists:karyawan,id',
            'periode' => 'required|string',
            'gaji_pokok' => 'required|numeric|min:0',
            'gaji_bersih' => 'required|numeric|min:0',
        ]);

        // Set tunjangan and potongan to 0 by default
        $validated['tunjangan'] = 0;
        $validated['potongan'] = 0;

        DB::transaction(function () use ($validated) {
            // Create slip gaji
            $slipGaji = SlipGaji::create($validated);

            // Get karyawan info
            $karyawan = Karyawan::find($validated['karyawan_id']);

            // Create transaction record
            Transaksi::create([
                'tanggal' => now(),
                'kategori' => 'Gaji Karyawan',
                'deskripsi' => "Pembayaran gaji {$karyawan->nama} ({$karyawan->jabatan}) - Periode {$validated['periode']}",
                'jumlah' => $validated['gaji_bersih'],
                'tipe' => 'pengeluaran',
            ]);
        });

        return redirect()->route('gaji-karyawan.index')
            ->with('success', 'Slip gaji berhasil dibuat');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SlipGaji $slipGaji)
    {
        DB::transaction(function () use ($slipGaji) {
            // Get karyawan info for transaction description
            $karyawan = Karyawan::find($slipGaji->karyawan_id);

            // Delete related transaction if exists
            Transaksi::where('kategori', 'Gaji Karyawan')
                ->where('deskripsi', 'like', "%{$karyawan->nama}%")
                ->where('deskripsi', 'like', "%{$slipGaji->periode}%")
                ->where('jumlah', $slipGaji->gaji_bersih)
                ->delete();

            // Delete slip gaji
            $slipGaji->delete();
        });

        return redirect()->route('gaji-karyawan.index')
            ->with('success', 'Slip gaji berhasil dihapus');
    }

    /**
     * Generate PDF for slip gaji
     */
    public function print(SlipGaji $slipGaji)
    {
        $slipGaji->load('karyawan');

        $pdf = Pdf::loadView('pdf.slip-gaji', [
            'slipGaji' => $slipGaji,
        ]);

        return $pdf->download('slip-gaji-' . $slipGaji->karyawan->nama . '-' . $slipGaji->periode . '.pdf');
    }
}
