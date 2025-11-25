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

    // public function products()
    // {
    //     return $this->hasMany(Product::class);
    // }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'category_product')
                    ->withTimestamps();
                    //->withPivot('position'); // pivot alanları varsa ekle
    }

    public function children()
    {
        return $this->hasMany(Category::class, "parent_id")->with('children');
    }

    public function parent()
    {
        return $this->belongsTo(Category::class, "parent_id");
    }
    public function deleteWithChildren()
    {
        foreach ($this->children as $child) {
            $child->deleteWithChildren();
        }

        $this->delete();
    }


    protected $casts = [
        'images' => 'array',
    ];

    // public function getRouteKeyName()
    // {
    //     return 'slug';
    // }

    protected $hidden = [
        'id',
    ];
}
