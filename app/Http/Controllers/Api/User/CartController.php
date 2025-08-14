<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\CartProductUserResources;
use App\Models\ProductStock;
use Illuminate\Http\Request;
use App\Models\Cart;
use App\Services\CartService;
use App\Models\User;
use App\Models\Product;
use App\Models\CartItem;
use Illuminate\Support\Facades\DB;
use PhpParser\Node\Stmt\TryCatch;

class CartController extends Controller
{

    public function index(Request $request)
    {
        $cart = $this->getUserCart();
        return response()->json(CartProductUserResources::collection($cart->cartItems));
        //return response()->json($cart->cartItems->pluck('product_stock_id'));
    }
    public function toggleItem(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'product_stock_id' => 'required|exists:product_stocks,id'
        ]);

        $user = $request->user();
        $productId = Product::find($validated['product_id'])->id;
        $productStockId = ProductStock::find($validated['product_stock_id'])->id;

        if (!$productId || !$productStockId) {
            return response()->json(['message' => 'Üzgünüm Ürünü bulamadım. Kontrol ederek işleminizi yeniden gepçekleştiriniz.', 'status' => 'error']);
        }

        if ($user) {
            // login olmuşsa user cart üzerinden toggle
            DB::beginTransaction();
            try {
                $cart = $user->cart;
                $item = $cart->cartItems()->where('product_id', $productId)->where('product_stock_id', $productStockId)->first();
                if ($item) {
                    $item->delete();
                    DB::commit();
                    return response()->json([
                        'message' => 'Ürün Sepetinizden Çıkarıldı',
                        'status' => 'success',
                        'process' => 'delete'
                    ]);
                } else {
                    $createdItem = $cart->cartItems()->create([
                        'product_id' => $productId,
                        'product_stock_id' => $productStockId,
                        'quantity' => 1
                    ]);
                }
                DB::commit();
                return response()->json([
                    'message' => 'Ürün Sepetinize Eklendi',
                    'status' => 'success',
                    'process' => 'create',
                    'item' => $createdItem
                ]);
            } catch (\Throwable $th) {
                DB::rollBack();

                return response()->json([
                    'message' => 'Beklenmeyen bir hata oluştu.',
                    'error' => $th->getMessage(),
                ], 500);
            }

        } else {
            return response()->json([
                'message' => 'İşleminizi gerçekleştirebilmek için giriş yapmanız gerekmektedir',
                'status' => 'error'
            ]);
        }

    }
    // {
    //     $result = [];
    //     foreach ($guestItems as $productId => $qty) {
    //         $product = Product::find($productId);
    //         if (!$product)
    //             continue;
    //         $result[] = [
    //             'product_id' => $product->id,
    //             'quantity' => $qty,
    //             'product' => $product,
    //         ];
    //     }
    //     return $result;
    // }

    protected function getUserCart()
    {
        if (auth()->check()) {
            $user = auth()->user();
            $cart = $user->cart->load(['cartItems.product.category:id,slug', 'cartItems.productStock']);
            return $cart;
        } else {
            return [];
        }
    }

    protected function destroy(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'product_stock_id' => 'required|exists:product_stocks,id'
        ]);
        $user = $request->user();
        $exist = CartItem::
            where('cart_id', $user->cart->id)
            ->where('product_id', $validated['product_id'])
            ->where('product_stock_id', $validated['product_stock_id'])->first();

        DB::beginTransaction();
        try {
            if (isset($exist)) {
                $exist->delete();
                DB::commit();
                return response()->json([
                    'message' => 'Ürün Sepetinizden Kaldırıldı',
                    'status' => 'success'
                ]);
            }
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => 'Beklenmeyen bir hata oluştu.',
                'error' => $th->getMessage(),
            ], 500);
        }


    }

}

