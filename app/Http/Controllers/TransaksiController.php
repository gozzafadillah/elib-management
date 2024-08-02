<?php

namespace App\Http\Controllers;

use App\Models\Pelanggan;
use App\Models\Transaksi;
use Inertia\Inertia;
use Xendit\Configuration;
use Xendit\Invoice\InvoiceApi;
use Illuminate\Http\Request;
use Xendit\Invoice\CreateInvoiceRequest;

class TransaksiController extends Controller
{
    public function index()
    {
        $id = auth()->user()->id;
        $pelanggan = Pelanggan::where('user_id', $id)->first();
        return Inertia::render("Transaksi/index", [
            'data' => Transaksi::with('peminjaman.pelanggan', 'peminjaman.p_peminjaman.buku')->whereHas('peminjaman', function ($query) use ($pelanggan) {
                $query->where('customer_id', $pelanggan->id);
            })->get()
        ]);
    }

    public function createInvoiceXendit(Request $request)
    {
        // get request invoice number
        $invoice_number = $request->invoice_number;

        // set xendit api key
        $xenditApiKey = env('XENDIT_SECRET_KEY');
        Configuration::setXenditKey($xenditApiKey);

        $id = auth()->user()->id;
        // check peminjaman berdasarkan pelanggan id
        $pelanggan = Pelanggan::where('user_id', $id)->first();
        if (!$pelanggan) {
            return redirect()->route('transaksi.index')->with('error', 'Anda belum terdaftar sebagai pelanggan');
        }

        $transaksi = Transaksi::whereHas('peminjaman', function ($query) use ($pelanggan) {
            $query->where('customer_id', $pelanggan->id);
        })->where('invoice_number', $invoice_number)->first();

        if (!$transaksi) {
            return redirect()->route('transaksi.index')->with('error', 'Transaksi tidak ditemukan');
        }

        // create invoice xendit
        $external_id = $invoice_number;
        $payer_email = $pelanggan->user->email;
        $description = 'Pembayaran peminjaman buku';
        $amount = $transaksi->grand_total;
        $invoiceApi = new InvoiceApi();
        $createInvoiceRequest = new CreateInvoiceRequest([
            'external_id' => $external_id,
            'description' => $description,
            'amount' => $amount,
            'invoice_duration' => 172800,
            'currency' => 'IDR',
            'payer_email' => $payer_email,
            "payer_phone" => $pelanggan->phone_number,
            "success_redirect_url" => route('transaksi.index'),
        ]);
        try {
            $result = $invoiceApi->createInvoice($createInvoiceRequest);
            // update transaksi
            $transaksi->update([
                'invoice_url' => $result['invoice_url'],
                'invoice_id' => $result['id'],
            ]);
            //    return json
            return Inertia::render("Transaksi/index", [
                'data' => Transaksi::with('peminjaman.pelanggan', 'peminjaman.p_peminjaman.buku')->whereHas('peminjaman', function ($query) use ($pelanggan) {
                    $query->where('customer_id', $pelanggan->id);
                })->get(),
                'result' => $result
            ]);
        } catch (\Throwable $th) {
            return redirect()->route('transaksi.index')->with('error', 'Gagal membuat invoice');
        }
    }
}
