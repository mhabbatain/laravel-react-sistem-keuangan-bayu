<?php

namespace App\Http\Controllers;

use App\Models\Karyawan;
use App\Models\SlipGaji;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GajiKaryawanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $karyawan = Karyawan::orderBy('nama', 'asc')->get();
        $slipGaji = SlipGaji::with('karyawan')
            ->orderBy('periode', 'desc')
            ->get()
            ->map(function ($slip) {
                return [
                    'id' => $slip->id,
                    'karyawan_id' => $slip->karyawan_id,
                    'nama_karyawan' => $slip->karyawan->nama,
                    'jabatan' => $slip->karyawan->jabatan,
                    'periode' => $slip->periode,
                    'gaji_pokok' => $slip->gaji_pokok,
                    'tunjangan' => $slip->tunjangan,
                    'potongan' => $slip->potongan,
                    'gaji_bersih' => $slip->gaji_bersih,
                    'created_at' => $slip->created_at,
                    'updated_at' => $slip->updated_at,
                ];
            });

        return Inertia::render('gaji-karyawan', [
            'karyawan' => $karyawan,
            'slipGaji' => $slipGaji,
        ]);
    }
}
