<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'serial_number',
        'carat',
        'color_of_diamond',
        'clarity',
        'cut',
        'status',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
