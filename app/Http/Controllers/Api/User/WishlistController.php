<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Http\Resources\WishProductResources;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
class WishlistController extends Controller
{
    public function index(Request $request)
    {
        $products = auth()->user()->wishlist()->withExists(
            [
                'inCarts' => function ($q) {
                    $q->whereHas('cart', function ($cartQuery) {
                        $cartQuery->where('user_id', auth()->user()->id);
                    });
                }
            ]
        )
            ->with(['category:id,slug'])->withPivot('price')->get();

        // Pivot'ları al, Eloquent Collection'a çevir ve productStock ilişkisini eager load et
        $pivots = $products->pluck('pivot')->filter(); // base Collection
        $eloquentPivots = EloquentCollection::make($pivots->all()); // şimdi Eloquent Collection
        $eloquentPivots->load('productStock');

        return response()->json(WishProductResources::collection($products));
    }

    public function toggle(Request $request)
    {
        //return response()->json($request->product_slug);
        if (auth()->check()) {
            $productId = Product::where('slug', operator: $request->product_slug)->value('id');
            if (!$productId) {
                return response()->json([
                    'message' => 'Ürün Bulunamadı.',
                    'status' => 'error'
                ], 404);
            }
            $request->validate([
                'product_slug' => 'required|exists:products,slug',
                'product_varient_id' => [
                    'required',
                    Rule::exists('product_stocks', 'id')->where(function ($query) use ($productId) {
                        $query->where('product_id', $productId);
                    }),
                ],
            ]);

            $user = auth()->user();
            //return response()->json($productId);
            $exists = $user->wishlist()
                ->where('product_id', $productId)
                ->wherePivot('product_stock_id', $request->product_varient_id)
                ->exists();
            if ($exists) {
                $user->wishlist()->newPivotStatement()
                    ->where(['user_id' => $user->id, 'product_id' => $productId, 'product_stock_id' => $request->product_varient_id])->delete();
                return response()->json(['status' => 'removed']);
            } else {
                $user->wishlist()->attach($productId, ['price' => $request->price, 'product_stock_id' => $request->product_varient_id]);
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
            return response()->json(['status' => 'error', 'message' => 'Silmek İstediğiniz Ürün Bulunamadı']);
        } else {
            auth()->user()->wishlist()->where('product_id', $productId)->delete();
            return response()->json(['status' => 'success', 'message' => 'Ürün Favorilerinizden Kaldırıldı']);
        }

    }
}
