<?php

use App\Http\Controllers\BukuController;
use App\Http\Controllers\PelangganController;
use App\Http\Controllers\PeminjamanController;
use App\Http\Controllers\PengembalianController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TransaksiController;
use App\Models\Buku;
use App\Models\P_Peminjaman;
use App\Models\Pelanggan;
use App\Models\Peminjaman;
use App\Models\Transaksi;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('LandingPage', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        "buku" => Buku::with('kategori', 'penerbit')->whereNull('deleted_at')->get(),
    ]);
});

Route::get("dashboard/keranjang", function () {
    return Inertia::render('Chart/index');
})->name('keranjang.index');

Route::get('/dashboard', function () {
    $user = auth()->user()->role;
    if ($user == 0) {
        return Inertia::render('Dashboard', [
            'card_1' => Pelanggan::count(),
            'card_2' => Peminjaman::count(),
            'card_3' => Transaksi::where('is_pay', 'Settled')->sum('grand_total'),
            "riwayatPengguna" => Transaksi::with("peminjaman.pelanggan", "peminjaman.p_peminjaman.buku")->latest()->get(),
        ]);
    }
    $user = auth()->user()->id;
    $pengguna = Pelanggan::where('user_id', $user)->first();

    return Inertia::render('Dashboard', [
        'card_1' => Peminjaman::where('customer_id', $pengguna->id)->count(),
        'card_2' => P_Peminjaman::whereHas('peminjaman', function ($query) use ($pengguna) {
            $query->where('customer_id', $pengguna->id);
        })->count(),
        'card_3' => Peminjaman::where('customer_id', $pengguna->id)->where('status', 'Dikembalikan')->where('telat', '>', 0)->count(),
        "riwayatPengguna" => Peminjaman::with("p_peminjaman.buku", "p_peminjaman.buku.penerbit", "p_peminjaman.buku.kategori")->where('customer_id', $pengguna->id)->latest()->get(),
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');
Route::get('/dashboard/buku', [BukuController::class, 'index'])->name('buku.index');
Route::post('/dashboard/buku', [BukuController::class, 'store'])->name('buku.store');
Route::put('/dashboard/buku/{buku}', [BukuController::class, 'update']);
Route::delete('/dashboard/buku/{buku}', [BukuController::class, 'destroy'])->name('buku.destroy');
Route::get('/dashboard/buku/{buku}', [BukuController::class, 'getBookById']);

Route::get('/dashboard/pelanggan', [PelangganController::class, 'index'])->name('pelanggan.index');
Route::post('/dashboard/pelanggan', [PelangganController::class, 'store'])->name('pelanggan.store');
Route::put('/dashboard/pelanggan/{pelanggan}', [PelangganController::class, 'update']);
Route::delete('/dashboard/pelanggan/{pelanggan}', [PelangganController::class, 'destroy'])->name('pelanggan.destroy');

// peminjaman
Route::get('/dashboard/peminjaman', [PeminjamanController::class, 'index'])->name('peminjaman.index');
Route::post("/peminjaman-buku", [PeminjamanController::class, 'store'])->name('peminjaman.store');

// pengembalian
Route::get('/dashboard/pengembalian', [PengembalianController::class, 'index'])->name('pengembalian.index');
Route::post('/dashboard/pengembalian', [PengembalianController::class, 'pengembalianBuku'])->name('pengembalian.pengembalianBuku');
Route::get('/dashboard/pengembalian/{id}', [PengembalianController::class, 'getById']);
Route::get("/dashboard/pengembalian/{id}", [PengembalianController::class, 'formPengembalian'])->name("pengembalian.form");
Route::post('/dashboard/pengembalian/bayarDenda', [PengembalianController::class, 'bayarDenda'])->name('pengembalian.bayarDenda');

// transaksi
Route::get('/dashboard/transaksi', [TransaksiController::class, 'index'])->name('transaksi.index');
Route::post('/dashboard/transaksi/pay', [TransaksiController::class, 'createInvoiceXendit'])->name('transaksi.pay');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// invoice callback
Route::post('/callback/invoice', [TransaksiController::class, 'getCallBack']);

require __DIR__ . '/auth.php';
