<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;

class HomeController extends Controller
{
    public function menu()
    {
        $menu = Category::whereNull('parent_id')->with('children')->take(3)->get();

        return response()->json($menu);
    }
}
