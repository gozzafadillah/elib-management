<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Buku>
 */
class BukuFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'judul' => $this->faker->sentence(3),
            'deskripsi' => $this->faker->paragraph(3),
            'penulis' => $this->faker->name(),
            'penerbit' => $this->faker->company(),
            'tahun_terbit' => $this->faker->year(),
            'jumlah_halaman' => $this->faker->numberBetween(100, 1000),
            'harga' => $this->faker->numberBetween(10000, 100000),
            'stok' => $this->faker->numberBetween(1, 100),
            'cover' => 'default.jpg',
            'kategori_id' => $this->faker->numberBetween(1, 10),
        ];
    }
}
