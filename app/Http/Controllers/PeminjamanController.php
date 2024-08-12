<?php

namespace App\Http\Controllers;

use App\Models\P_Peminjaman;
use App\Models\Pelanggan;
use App\Models\Peminjaman;
use App\Models\Transaksi;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PeminjamanController extends Controller
{
    public function index()
    {
        $customerID = auth()->user()->id;
        $user = User::find($customerID);
        if ($user->role == 0) {
            return Inertia::render('Admin/Peminjaman/index', [
                'peminjaman' => Peminjaman::with('pelanggan', 'p_peminjaman.buku')->get()
            ]);
        }
        $customer = Pelanggan::where('user_id', $customerID)->first()->id;
        return Inertia::render('Peminjaman/index', [
            'peminjaman' => Peminjaman::with('pelanggan', 'p_peminjaman.buku')->where('customer_id', $customer)->get()
        ]);
    }

    public function store(Request $request)
    {
        $p_peminjaman = new P_Peminjaman();
        $peminjaman = new Peminjaman();
        $transaksi = new Transaksi();
        $invoice = $this->generateInvoice();

        $customerID = auth()->user()->id;
        $customer = Pelanggan::where('user_id', $customerID)->first()->id;
        $harga = 0;
        foreach ($request->data as $value) {
            if ($value['tipe_buku'] == 'Import') {
                $harga +=  10000;
            } else {
                $harga += 5000;
            }
        }
        $peminjaman = $peminjaman->create([
            'invoice_number' => $invoice,
            'tanggal_pinjam' => $request->start,
            'tanggal_kembali' => $request->end,
            'customer_id' => $customer,
            'sub_total' => $harga,
            'status' => 'Dipinjam'
        ]);
        $transaksi->create([
            'invoice_number' => $invoice,
            'grand_total' => $harga,
            'is_pay' => 'Pending',

        ]);
        foreach ($request->data as $value) {
            $p_peminjaman->create([
                'peminjaman_id' => $peminjaman->id,
                'buku_id' => $value['id'],
            ]);
        }

        return redirect()->route('peminjaman.index');
    }

    // buatkan function generate invoice
    public function generateInvoice()
    {
        $invoice = 'INV-' . date('YmdHis');
        return $invoice;
    }
}
