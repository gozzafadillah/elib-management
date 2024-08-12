<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('buku', function (Blueprint $table) {
            $table->id();
            $table->string('judul')->nullable(false);
            $table->longText('deskripsi')->nullable(true);
            $table->date('tahun_terbit')->nullable(true);
            $table->string('image_path')->nullable(true);
            $table->bigInteger('stok')->nullable(false);
            $table->string('tipe_buku')->default('Local');
            $table->foreignId('penerbit_id')->constrained('penerbit');
            $table->foreignId('kategori_id')->constrained('kategori');
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->constrained('users');
            $table->timestamp('deleted_at')->nullable(true);
            $table->foreignId('deleted_by')->nullable(true)->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('buku');
    }
};
