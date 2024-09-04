<?php

namespace App\Http\Controllers;

use App\Events\BookReturned;
use App\Models\Pelanggan;
use App\Models\Peminjaman;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon; // Import Carbon for date manipulation

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

        if (!$pelanggan) {
            return Inertia::render('Pengembalian/index', [
                'data' => []
            ]);
        }

        $data = Peminjaman::with('pelanggan', 'p_peminjaman.buku.kategori')->whereHas('transaksi', function ($query) {
            $query->where('is_pay', 'Settled');
        })->where('customer_id', $pelanggan->id)->get();

        return Inertia::render('Pengembalian/index', [
            'data' => $data
        ]);
    }

    public function getById($id)
    {
        $data = Peminjaman::with('pelanggan', 'p_peminjaman.buku')->find($id); // Using find() is more appropriate
        return response()->json($data);
    }

    public function pengembalianBuku(Request $request)
    {
        $id = $request->id;
        $telat = 0;
        $peminjaman = Peminjaman::where('invoice_number', $id)->firstOrFail();

        // Use Carbon for date comparison
        $now = Carbon::now();
        if ($peminjaman->tanggal_kembali < $now) {
            // Calculate delay
            $telat = $now->diffInDays($peminjaman->tanggal_kembali);
        }

        // telat menjadi positif
        $telat = $telat * -1;

        $peminjaman->update([
            'telat' => $telat,
        ]);

        return redirect()->route('pengembalian.form', $peminjaman->id);
    }

    public function formPengembalian($id)
    {
        $totalBayarDenda = 0;
        $findPeminjaman = Peminjaman::with('p_peminjaman.buku', 'transaksi')->where('id', $id)->first();

        foreach ($findPeminjaman->p_peminjaman as $value) {
            $denda = ($value->buku->tipe_buku == 'Import') ? 10000 : 5000;
            $totalBayarDenda += $denda;
        }

        return Inertia::render('Admin/Pengembalian/formPengembalian', [
            'data' => $findPeminjaman,
            'totalBayarDenda' => $totalBayarDenda,
        ]);
    }

    public function bayarDenda(Request $request)
    {
        $id = $request->id;
        $peminjaman = Peminjaman::with("pelanggan", "p_peminjaman.buku.kategori", "transaksi")->where('id', $id)->firstOrFail();

        $peminjaman->update([
            'status' => 'Dikembalikan',
            'denda' => $request->denda,
        ]);

        // Memancarkan event untuk memberitahu klien
        broadcast(new BookReturned($peminjaman))->toOthers();

        return redirect()->route('pengembalian.index');
    }
}
