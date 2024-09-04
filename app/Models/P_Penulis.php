<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class P_Penulis extends Model
{
    use HasFactory;

    protected $table = 'p__penulis';

    protected $guarded = ['id'];

    public function buku()
    {
        return $this->belongsTo(Buku::class, 'buku_id');
    }

    public function penulis()
    {
        return $this->belongsTo(Penulis::class, 'penulis_id');
    }
}
