<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Resources\WishProductResources;
use Illuminate\Support\Facades\DB;
class WishlistController extends Controller
{
    public function index(Request $request)
    {
        $products = auth()->user()->wishlist()
            ->withExists([
                'inCarts' => function ($q) {
                    $q->whereHas('cart', function ($cartQuery) {
                        $cartQuery->where('user_id', auth()->user()->id);
                    });
                }
            ])
            ->with(['categories:id,slug,name', 'stock:id,product_id,color'])
            ->withPivot('price')
            ->get();

        return response()->json(WishProductResources::collection($products));
    }

    public function toggle(Request $request)
    {
        //return response()->json($request->all());
        if (auth()->check()) {
            $productId = Product::where('slug', $request->product_slug)->first()->id;
            
            if (!$productId) {
                return response()->json([
                    'message' => 'Ürün Bulunamadı.',
                    'status' => 'error'
                ], 404);
            }

            $request->validate([
                'product_slug' => 'required|exists:products,slug',
                'price' => 'required|numeric|min:0'
            ]);
            DB::beginTransaction();
            try {
                $user = auth()->user();
                //return response()->json($productId);
                $exists = $user->wishlist()
                    ->where('product_id', $productId)
                    ->exists();
                if ($exists) {
                    $user->wishlist()->newPivotStatement()
                        ->where(['user_id' => $user->id, 'product_id' => $productId])->delete();
                        DB::commit();
                    return response()->json(['status' => 'removed']);
                } else {
                    $user->wishlist()->attach($productId, ['price' => $request->price]);
                    DB::commit();
                    return response()->json(['status' => 'added']);
                }
            } catch (\Throwable $th) {
                DB::rollBack();
                return response()->json([
                    'message' => 'Beklenmeyen bir hata oluştu.',
                    'status' => 'error',
                    'err' => $th->getMessage()
                ], 500);
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
            return response()->json(['status' => 'error', 'message' => 'Silmek İstediğiniz Ürün Bulunamadı']);
        } else {
            auth()->user()->wishlist()->where('product_id', $productId)->delete();
            return response()->json(['status' => 'success', 'message' => 'Ürün Favorilerinizden Kaldırıldı']);
        }

    }
}
