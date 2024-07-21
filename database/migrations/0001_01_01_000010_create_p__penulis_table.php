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
        Schema::create('p__penulis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('penulis_id')->constrained('penulis');
            $table->foreignId('buku_id')->constrained('buku');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('p__penulis');
    }
};
