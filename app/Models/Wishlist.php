<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class Wishlist extends Pivot
{
    use HasFactory;

    protected $table = "wishlists";
    protected $guarded = [];

    //protected $hidden = ["product_id", "user_id"];

    public function productStock()
    {
        return $this->belongsTo(ProductStock::class, 'product_stock_id');
    }
}
