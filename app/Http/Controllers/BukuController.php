<?php

namespace App\Http\Controllers;

use App\Models\Buku;
use App\Models\Kategori;
use App\Models\P_Penulis;
use App\Models\Penerbit;
use App\Models\Penulis;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BukuController extends Controller
{

    public function index()
    {
        return Inertia::render('Buku/index', [
            'categories' => Kategori::all(),
            'penerbit' => Penerbit::all(),
            'buku' => Buku::with('kategori', 'penerbit', 'p_penulis.penulis')->whereNull('deleted_at')->get(),
            'penulis'  => Penulis::all()
        ]);
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'judul' => 'required',
                'kategori_id' => 'required',
                'penerbit_id' => 'required',
                'tahun_terbit' => 'required',
                'stok' => 'required',
                'image_path' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Menambahkan validasi untuk gambar
            ]);

            $request['penulis'] = json_decode($request->penulis);

            if ($request->hasFile('image_path')) {
                // Upload an Image File to Cloudinary with One line of Code
                $uploadedFileUrl = Cloudinary::upload($request->file('image_path')->getRealPath())->getSecurePath();
                $request['image_path'] = $uploadedFileUrl;
                $request['created_by'] = auth()->user()->id;
                $request['updated_by'] = auth()->user()->id;

                // Cek apakah penerbit baru atau sudah ada
                $penerbit = json_decode($request->penerbit_id);

                $penerbit = Penerbit::firstOrCreate(['id' => $penerbit->id], ['nama' => $penerbit->nama]);


                $buku = Buku::create([
                    'judul' => $request->judul,
                    'kategori_id' => $request->kategori_id,
                    'penerbit_id' => $penerbit->id,
                    'tahun_terbit' => $request->tahun_terbit,
                    'deskripsi' => $request->deskripsi == null ? '' : $request->deskripsi,
                    'stok' => $request->stok,
                    'image_path' => $uploadedFileUrl,
                    'created_by' => $request->created_by,
                    'updated_by' => $request->updated_by,
                    'tipe_buku' => $request->tipe_buku,
                ]);
            }

            if ($request->penulis) {
                foreach ($request->penulis as $penulis) {
                    $penulis = Penulis::firstOrCreate(['nama' => $penulis->nama]);
                    P_Penulis::create([
                        'buku_id' => $buku->id,
                        'penulis_id' => $penulis->id
                    ]);
                }
            }


            return redirect()->route('buku.index')->with('success', 'Buku berhasil ditambahkan');
        } catch (\Throwable $th) {
            return redirect()->route('buku.index')->with('error', "$th, Buku gagal ditambahkan");
        }
    }

    public function getBookById($id)
    {
        $buku = Buku::with('kategori', 'penerbit', 'p_penulis')->find($id);
        return response()->json($buku);
    }



    public function update(Request $request, Buku $buku)
    {
        try {
            // Validation
            $request->validate([
                'judul' => 'required',
                'kategori_id' => 'required',
                'penerbit_id' => 'required',
                'tahun_terbit' => 'required',
                'stok' => 'required',
            ]);

            // Get updated by user
            $request['updated_by'] = auth()->user()->id;
            $fileName = $buku->image_path; // Preserve the old image path if no new image is uploaded

            // Update image with Cloudinary
            if ($request->hasFile('image_path')) {
                // Upload new image to Cloudinary
                $uploadedFileUrl = Cloudinary::upload($request->file('image_path')->getRealPath())->getSecurePath();

                // Save the new file URL from Cloudinary
                $fileName = $uploadedFileUrl;

                // Optionally: Delete the old image from Cloudinary
                if ($buku->image_path) {
                    // Extract the public ID from the old URL to delete it
                    $publicId = basename($buku->image_path, '.' . pathinfo($buku->image_path, PATHINFO_EXTENSION));
                    Cloudinary::destroy($publicId);
                }
            }

            // Update the record in the database
            $buku->update([
                'judul' => $request->judul,
                'kategori_id' => $request->kategori_id,
                'penerbit_id' => $request->penerbit_id,
                'tahun_terbit' => $request->tahun_terbit,
                'stok' => $request->stok,
                'image_path' => $fileName,
                'updated_by' => $request->updated_by,
            ]);

            return redirect()->route('buku.index')->with('success', 'Buku berhasil diupdate');
        } catch (\Throwable $th) {
            return redirect()->route('buku.index')->with('error', 'Buku gagal diupdate');
        }
    }


    public function destroy(Buku $buku)
    {
        try {
            // soft delete
            $buku->update([
                'deleted_by' => auth()->user()->id,
                'deleted_at' => now()
            ]);


            return redirect()->route('buku.index')->with('success', 'Buku berhasil dihapus');
        } catch (\Throwable $th) {
            return redirect()->route('buku.index')->with('error', 'Buku gagal dihapus');
        }
    }
}
