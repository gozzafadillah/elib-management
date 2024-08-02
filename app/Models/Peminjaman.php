<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Peminjaman extends Model
{
    use HasFactory;

    protected $table = 'peminjaman';
    protected $guarded = ['id'];

    public function pelanggan()
    {
        return $this->belongsTo(Pelanggan::class, 'customer_id');
    }

    public function p_peminjaman()
    {
        return $this->hasMany(P_Peminjaman::class, 'peminjaman_id');
    }

    public function transaksi()
    {
        return $this->hasOne(Transaksi::class, 'invoice_number', 'invoice_number');
    }
}
