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
        Schema::create('peminjaman', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('pelanggan');
            $table->timestamp('tanggal_pinjam');
            $table->timestamp('tanggal_kembali');
            $table->timestamp('tanggal_pengembalian')->nullable(true);
            $table->string('status')->nullable(true);
            $table->bigInteger('telat')->nullable(true);
            $table->bigInteger('sub_total')->nullable(true);
            // foreign to invoice_number string in transaksi
            $table->string('invoice_number');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('peminjaman');
    }
};
