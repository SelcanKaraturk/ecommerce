<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductStock extends Model
{
    use HasFactory;
    protected $guarded = [];


    public function wishlistedBy()
    {
        return $this->hasMany(Wishlist::class, 'product_stock_id', 'id');
    }
     public function product()
    {
         return $this->belongsTo(Product::class);
    }
}
