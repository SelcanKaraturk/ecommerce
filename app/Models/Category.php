<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;
    protected $fillable = [
        "name",
        "slug",
        "images",
        "parent_id",
    ];

    public function products(){
        return $this->hasMany(Product::class);
    }

    public function children(){
        return $this->hasMany(Category::class,"parent_id")
         ->where('id', '!=', $this->id);
    }

    public function parent(){
        return $this->belongsTo(Category::class,"parent_id");
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
        'parent_id'
    ];
}
