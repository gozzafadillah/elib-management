<?php

use App\Http\Controllers\BukuController;
use App\Http\Controllers\PelangganController;
use App\Http\Controllers\PeminjamanController;
use App\Http\Controllers\ProfileController;
use App\Models\Buku;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('LandingPage', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        "buku" => Buku::with('kategori', 'penerbit')->get()
    ]);
});

Route::get("dashboard/keranjang", function () {
    return Inertia::render('Chart/index');
})->name('keranjang.index');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
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

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
