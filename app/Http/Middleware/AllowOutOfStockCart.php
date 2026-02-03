<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Product;

class AllowOutOfStockCart
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $productId = $request->input('product_id');
        if (!$productId) {
            return response()->json(['message' => 'Ürün ID gerekli'], 400);
        }
        $product = Product::find($productId);
        if (!$product) {
            return response()->json(['message' => 'Ürün bulunamadı'], 404);
        }
        // allow_out_of_stock_cart alanı true ise veya stok varsa devam et
        if ($product->allow_out_of_stock_cart || $product->stock > 0) {
            return $next($request);
        }
        return response()->json(['message' => 'Bu ürün stokta yok ve sepete eklenemez.'], 403);
    }
}
