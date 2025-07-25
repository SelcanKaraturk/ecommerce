<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\User;
use App\Models\Product;

class CartController extends Controller
{
    public function index()
    {
        $cart = User::find(14)->cart->cartItems()->where('product_id', 21)->first();
        $cart ? dd($cart) : dd('22');
        //dd($cart);
    }
    public function toggle(Request $request)
    {
        if (auth()->check()) {
            $userCart = auth()->user()->cart;
            if (!$userCart) {
                $userCart = auth()->user()->cart()->create();
            }

            $productId = Product::where('slug', $request->slug)->value('id');
            if (!$productId) {
                return response()->json([
                    'message' => 'Ürün mevcut değil',
                    'status' => 'error'
                ], 404);
            }
            $existingCartItem = $userCart->cartItems()->where('product_id', $productId)->first();
            if ($existingCartItem) {
                $userCart->cartItems()->where('product_id', $productId)->delete();
                return response()->json([
                    'status' => 'removed',
                    'message' => 'Ürün Sepetinizden Çıkartıldı'
                ]);
            } else {
                $userCart->cartItems()->create([
                    'product_id' => $productId,
                    'quantity' => 1,
                ]);
                return response()->json([
                    'status' => 'added',
                    'message' => 'Ürün Sepetinize Eklendi'
                ]);
            }
        }
    }
}

