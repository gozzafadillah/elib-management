<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaksi extends Model
{
    use HasFactory;

    protected $table = 'transaksi';
    protected $guarded = ['id'];

    public function peminjaman()
    {
        return $this->belongsTo(Peminjaman::class, 'invoice_number', 'invoice_number');
    }
}
