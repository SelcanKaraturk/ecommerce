<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

     protected $fillable = [
        "name",
        "slug",
        "category_id",
        "content",
        "images",
        "price"
    ];

    public function category(){
        return $this->belongsTo(Category::class);
    }

    protected $casts = [
        'images' => 'array',
    ];

    public function getRouteKeyName()
    {
        return 'slug';
    }
     protected $hidden = [
        'id',
        'category_id'
    ];
}
