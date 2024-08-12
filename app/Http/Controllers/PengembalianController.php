<?php

namespace App\Http\Controllers;

use App\Models\Pelanggan;
use App\Models\Peminjaman;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PengembalianController extends Controller
{
    public function index()
    {

        $id = auth()->user()->id;
        $user = User::find($id);
        if ($user->role == 0) {
            $data = Peminjaman::with('pelanggan', 'p_peminjaman.buku')->whereHas('transaksi', function ($query) {
                $query->where('is_pay', 'Settled');
            })->get();
            return Inertia::render('Admin/Pengembalian/index', [
                'data' => $data
            ]);
        }
        $pelanggan = Pelanggan::where('user_id', $id)->first();

        $data = Peminjaman::with('pelanggan', 'p_peminjaman.buku')->whereHas('transaksi', function ($query) {
            $query->where('is_pay', 'Settled');
        })->where('customer_id', $pelanggan->id)->get();

        return Inertia::render('Pengembalian/index', [
            'data' => $data
        ]);
    }

    public function pengembalianBuku(Request $request)
    {
        $id = $request->id;
        $telat = 0;
        $peminjaman = Peminjaman::find($id);
        // cek apakah tanggal buku pengembalian sudah lewat
        if ($peminjaman->tanggal_kembali < now()) {
            // hitung banyak telat
            $telat = now()->diffInDays($peminjaman->tanggal_kembali);
            // telat jadi positif
            $telat = abs($telat);
            // bulat atas 
            $telat = ceil($telat);
            // ubah jadi integer
            $telat = (int) $telat;

            $peminjaman->update([
                'telat' => $telat,
                'tanggal_pengembalian' => now()
            ]);
        }
        $peminjaman->update([
            'status' => 'Dikembalikan'
        ]);

        return redirect()->route('pengembalian.index');
    }
}
