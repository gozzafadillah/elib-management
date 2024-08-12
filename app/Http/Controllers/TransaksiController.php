<?php

namespace App\Http\Controllers;

use App\Models\Pelanggan;
use App\Models\Transaksi;
use App\Models\User;
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
        $user = User::find($id);
        if ($user->role == 0) {
            return Inertia::render('Admin/Transaksi/index', [
                'data' => Transaksi::with('peminjaman.pelanggan', 'peminjaman.p_peminjaman.buku')->get()
            ]);
        }
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
        $howToPay = $request->how_to_pay;
        if ($howToPay == 'cash') {
            // update data transaksi
            $transaksi = Transaksi::where('invoice_number', $invoice_number)->first();
            $transaksi->update([
                'is_pay' => 'Settled',
                'payment_method' => 'cash',
                'payment_date' => now(),
            ]);

            return redirect()->route('transaksi.index')->with('success', 'Pembayaran berhasil');
        }

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

    // add invoice callback xendit
    function getCallBack()
    {
        // Mendapatkan token dari environment
        $token = env('OTP_Xendit_Callback');

        // Mendapatkan header 'x-callback-token'
        $xTokenCallback = $_SERVER['HTTP_X_CALLBACK_TOKEN'] ?? '';

        // Memeriksa token untuk otorisasi
        if ($xTokenCallback !== $token) {
            http_response_code(401);
            return json_encode(['error' => 'unauthorized']);
        }

        // Membaca body request
        $requestBody = file_get_contents('php://input');

        // Menguraikan JSON dari body request
        $callbackData = json_decode($requestBody, true);

        // Memeriksa apakah JSON valid
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(500);
            return json_encode(['error' => 'internal server error']);
        }

        // Mengirimkan response header dan status
        header('Content-Type: application/json');
        http_response_code(200);

        // Mengembalikan data callback yang telah di-decode
        $data = json_encode($callbackData);

        // update pembayaran
        $transaksi = Transaksi::where('invoice_number', $callbackData['external_id'])->first();

        $transaksi->update([
            'is_pay' => 'Settled',
            'how_to_pay' => $callbackData['payment_method'],
            'updated_at' => $callbackData['paid_at'],
        ]);

        return $data;
    }
}
