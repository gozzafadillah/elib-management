<?php

namespace App\Http\Controllers;

use App\Models\Buku;
use App\Models\Kategori;
use App\Models\Penerbit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BukuController extends Controller
{
    public function index()
    {
        return Inertia::render('Buku/index', [
            'categories' => Kategori::all(),
            'penerbit' => Penerbit::all(),
            'buku' => Buku::with('kategori', 'penerbit')->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required',
            'kategori_id' => 'required',
            'penerbit_id' => 'required',
            'tahun_terbit' => 'required',
            'stok' => 'required',
            'image_path' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Menambahkan validasi untuk gambar
        ]);

        if ($request->hasFile('image_path')) {
            $image = $request->file('image_path');
            $fileName = time() . '.' . $image->getClientOriginalExtension();
            $image->storeAs('/public/images/buku', $fileName);
            $request['image_path'] = $fileName;
            $request['created_by'] = auth()->user()->id;
            $request['updated_by'] = auth()->user()->id;

            Buku::create([
                'judul' => $request->judul,
                'kategori_id' => $request->kategori_id,
                'penerbit_id' => $request->penerbit_id,
                'tahun_terbit' => $request->tahun_terbit,
                'stok' => $request->stok,
                'image_path' => $fileName,
                'created_by' => $request->created_by,
                'updated_by' => $request->updated_by,
            ]);
        }


        return redirect()->route('buku.index');
    }


    public function update(Request $request, Buku $buku)
    {
        // debug laravel 11
        $request->validate([
            'judul' => 'required',
            'kategori_id' => 'required',
            'penerbit_id' => 'required',
            'tahun_terbit' => 'required',
            'stok' => 'required',
        ]);

        // get updated by user

        $request['updated_by'] = auth()->user()->id;
        $fileName = $buku->image_path;
        // update file image
        if ($request->hasFile('image_path')) {
            $image = $request->file('image_path');
            $fileName = time() . '.' . $image->getClientOriginalExtension();
            $image->storeAs('/public/images/buku', $fileName);

            // delete old image
            $image_path = "public/images/buku/" . $buku->image_path;
            if (file_exists($image_path)) {
                unlink($image_path);
            }
        }

        $buku->update([
            'judul' => $request->judul,
            'kategori_id' => $request->kategori_id,
            'penerbit_id' => $request->penerbit_id,
            'tahun_terbit' => $request->tahun_terbit,
            'stok' => $request->stok,
            'image_path' => $fileName != null ? $fileName : $buku->image_path,
            'updated_by' => $request->updated_by,

        ]);

        return redirect()->route('buku.index');
    }

    public function destroy(Buku $buku)
    {
        $buku->delete();

        // delete image
        $image_path = public_path('storage/images/buku/' . $buku->image_path);
        if (file_exists(
            $image_path
        )) {
            unlink($image_path);
        }

        return redirect()->route('buku.index');
    }
}
