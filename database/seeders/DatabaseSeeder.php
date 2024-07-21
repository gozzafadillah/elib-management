<?php

namespace Database\Seeders;

use App\Models\Buku;
use App\Models\Kategori;
use App\Models\Penerbit;
use App\Models\Penulis;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Buku::factory(10)->create();
        Kategori::factory(5)->create();
        Penulis::factory(5)->create();
        Penerbit::factory()->create([
            'nama' => "PT BEST",
            'alamat' => "JL Sukakarya No 40"

        ]);
    }
}
