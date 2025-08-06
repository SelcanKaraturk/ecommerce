<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;
    public $incrementing = false;      // otomatik artan sayı olmasın
    protected $keyType = 'string';     // primary key string (UUID) tipinde
    protected $fillable = ['user_id'];
    public function cartItems(){
        return $this->hasMany(CartItem::class);
    }
     public function user()
    {
        return $this->belongsTo(User::class);
    }
}
