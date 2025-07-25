<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(auth()->user()->wishlist()->withExists(
            ['inCarts' => function ($q) {
                $q->whereHas('cart', function ($cartQuery) {
                    $cartQuery->where('user_id', auth()->user()->id);
                });
            }])
        ->with('category:id,slug')->withPivot('price')->get());
    }

    public function toggle(Request $request)
    {
        //return response()->json($request->product_slug);
        if (auth()->check()) {
            $request->validate([
                'product_slug' => 'required|exists:products,slug',
            ]);

            $user = auth()->user();
            $productId = Product::where('slug', operator: $request->product_slug)->value('id');
            if (!$productId) {
                return response()->json([
                    'message' => 'Product not found.',
                    'status' => 'error'
                ], 404);
            }
            //return response()->json($productId);

            if ($user->wishlist()->whereKey($productId)->exists()) {
                $user->wishlist()->detach($productId);
                return response()->json(['status' => 'removed']);
            } else {
                $user->wishlist()->attach($productId, ['price' => $request->price]);
                return response()->json(['status' => 'added']);
            }
        } else {
            return response()->json([
                'message' => 'Lütfen Giriş Yapınız',
                'status' => 'error'
            ]);
        }
    }

    public function destroy($slug)
    {
        $productId = Product::where('slug', $slug)->value('id');
        if (!$productId) {
            return response()->json(['status'=>'error','message' => 'Silmek İstediğiniz Ürün Bulunamadı']);
        }else{
            auth()->user()->wishlist()->where('product_id', $productId)->delete();
            return response()->json(['status'=>'success','message'=> 'Ürün Favorilerinizden Kaldırıldı']);
        }

    }
}
