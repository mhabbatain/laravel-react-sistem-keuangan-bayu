<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Karyawan;
use Illuminate\Http\Request;

class KaryawanController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'jabatan' => 'required|string|max:255',
            'tipe_gaji' => 'required|in:tetap,harian',
            'gaji_pokok' => 'required|numeric|min:0',
        ]);

        Karyawan::create($validated);

        return redirect()->route('gaji-karyawan.index')
            ->with('success', 'Karyawan berhasil ditambahkan');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Karyawan $karyawan)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'jabatan' => 'required|string|max:255',
            'tipe_gaji' => 'required|in:tetap,harian',
            'gaji_pokok' => 'required|numeric|min:0',
        ]);

        $karyawan->update($validated);

        return redirect()->route('gaji-karyawan.index')
            ->with('success', 'Data karyawan berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Karyawan $karyawan)
    {
        $karyawan->delete();

        return redirect()->route('gaji-karyawan.index')
            ->with('success', 'Karyawan berhasil dihapus');
    }
}
