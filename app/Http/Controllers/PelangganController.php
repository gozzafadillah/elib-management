<?php

namespace App\Http\Controllers;

use App\Models\Pelanggan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class PelangganController extends Controller
{
    public function index()
    {
        return Inertia::render('Pelanggan/index', [
            // ambil semua data pelanggan dari table pelnggan dengan relasi users dan filter didalam users column role = 1
            'pelanggan' => Pelanggan::with('user')->whereHas('user', function ($query) {
                $query->where('role', 1);
            })->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required',
            'no_telp' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8',
        ]);

        // buat user baru
        $user = User::create([
            'name' => $request->nama,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'email_verified_at' => now(),
        ]);

        // buat pelanggan baru
        Pelanggan::create([
            'nama' => $request->nama,
            'email' => $request->email,
            'alamat' => $request->alamat,
            'no_telp' => $request->no_telp,
            'user_id' => $user->id,
        ]);

        return  Inertia::location(route('pelanggan.index'));

    }

    public function update(Request $request, Pelanggan $pelanggan)
    {
        $request->validate([
            'nama' => 'required',
            'alamat' => 'required',
            'telepon' => 'required',
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // update user
        $pelanggan->user->update([
            'name' => $request->nama,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // update pelanggan
        $pelanggan->update([
            'nama' => $request->nama,
            'alamat' => $request->alamat,
            'telepon' => $request->telepon,
        ]);

        return  Inertia::location(route('pelanggan.index'));
    }

    public function destroy(Pelanggan $pelanggan)
    {
        $pelanggan->delete();

        // delete users 
        $pelanggan->user->delete();

        return  Inertia::location(route('pelanggan.index'));
    }
}
