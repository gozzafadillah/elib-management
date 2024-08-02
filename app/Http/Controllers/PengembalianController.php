<?php

namespace App\Http\Controllers;

use App\Models\Peminjaman;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PengembalianController extends Controller
{
    public function index()
    {

        $data = Peminjaman::with('pelanggan', 'p_peminjaman.buku')->whereHas('transaksi', function ($query) {
            $query->where('is_pay', 'Settled');
        })->get();

        return Inertia::render('Pengembalian/index', [
            'data' => $data
        ]);
    }
}
