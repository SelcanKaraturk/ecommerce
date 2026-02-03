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
        if(auth()->user()->cart){
            $cart = $this->getUserCart();
            return response()->json(CartProductUserResources::collection($cart->cartItems));
        }else{
            return [];
        }
        //return response()->json($cart->cartItems->pluck('product_stock_id'));
    }
    public function toggleItem(Request $request)
    {

        $validated = $request->validate([
            'product_slug' => 'required|exists:products,slug',
            'color' => 'required|string',
            'size' => 'required'
        ]);

        $user = $request->user();
        $product = Product::where('slug', $validated['product_slug'])->first();
        if (!$product) {
            return response()->json(['message' => 'Üzgünüm Ürünü bulamadım. Kontrol ederek işleminizi yeniden gepçekleştiriniz.', 'status' => 'error']);
        }
        $productId = $product->id;
        $productStock = $product->productStocks()->where('color', $validated['color'])->where('size', $validated['size'])->first();
        if (!$productStock) {
            return response()->json(['message' => 'Üzgünüm, bu renk ve ölçüde stok bulunamadı.', 'status' => 'error']);
        }
        $productStockId = $productStock->id;

        if ($user) {
            // login olmuşsa user cart üzerinden toggle
            DB::beginTransaction();
            try {
                $cart = Cart::firstOrCreate(['user_id' => $user->id]);
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

    public function update(Request $request)
    {
        $validated = $request->validate([
            'product_slug' => 'required',
            'product_stock_id' => 'required',
            'quantity' => 'required|integer|min:1',
        ]);

        $user = $request->user();
        // product_id ve product_stock_id artık slug ve stock_number ile geliyor, bunları id'ye çevir
        $product = Product::where('slug', $validated['product_slug'])->first();
        $productStock = $product ? $product->productStocks()->find($validated['product_stock_id']) : null;
        
        if (!$product) {
            return response()->json([
                'message' => 'Ürün bulunamadı.',
                'status' => 'error'
            ], 404);
        }
        
        
        $productStock = $product ? $product->productStocks()->where('stock_number', $validated['product_stock_id'])->first() : null;
        if (!$product || !$productStock) {
            return response()->json([
                'message' => 'Ürün veya stok bulunamadı.',
                'status' => 'error'
            ], 404);
        }
        $exist = CartItem::
            where('cart_id', $user->cart->id)
            ->where('product_id', $product->id)
            ->where('product_stock_id', $productStock->id)->first();

        DB::beginTransaction();
        try {
            if (isset($exist)) {
                $exist->update(['quantity'=>$validated['quantity']]);
                DB::commit();
                return response()->json([
                    'message' => 'Ürün güncellendi',
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

