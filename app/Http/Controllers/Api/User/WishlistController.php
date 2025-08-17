<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Http\Resources\WishProductResources;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use PhpParser\Node\Stmt\TryCatch;
use Illuminate\Support\Facades\DB;
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
        //return response()->json($request->all());
        if (auth()->check()) {
            $productId = Product::find($request->product_number);
            if (!$productId) {
                return response()->json([
                    'message' => 'Ürün Bulunamadı.',
                    'status' => 'error'
                ], 404);
            }
            //return response()->json($productId->id);
            $request->validate([
                'product_number' => 'required|exists:products,id',
                'product_stock_id' => [
                    'required',
                    Rule::exists('product_stocks', 'id')->where(function ($query) use ($productId) {
                        $query->where('product_id', $productId->id);
                    }),
                ],
                'price' => 'required|numeric|min:0'
            ]);
            DB::beginTransaction();
            try {
                $user = auth()->user();
                //return response()->json($productId);
                $exists = $user->wishlist()
                    ->where('product_id', $productId->id)
                    ->wherePivot('product_stock_id', $request->product_stock_id)
                    ->exists();
                if ($exists) {
                    $user->wishlist()->newPivotStatement()
                        ->where(['user_id' => $user->id, 'product_id' => $productId->id, 'product_stock_id' => $request->product_stock_id])->delete();
                        DB::commit();
                    return response()->json(['status' => 'removed']);
                } else {
                    $user->wishlist()->attach($productId, ['price' => $request->price, 'product_stock_id' => $request->product_stock_id]);
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
