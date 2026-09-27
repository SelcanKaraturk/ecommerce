<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GoldSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'karat',
        'min_milyem',
        'max_milyem',
    ];
}
