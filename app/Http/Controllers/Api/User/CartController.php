<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\CartProductUserResources;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductStock;
use App\Models\User;
use App\Services\CartService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use PhpParser\Node\Stmt\TryCatch;
use Illuminate\Support\Str;

class CartController extends Controller
{
    public function index(Request $request)
    {
        if (auth()->user()->cart) {
            $cart = $this->getUserCart();
            return response()->json(CartProductUserResources::collection($cart->cartItems));
        } else {
            return response()->json([]);
        }
        // return response()->json($cart->cartItems->pluck('product_stock_id'));
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

        $productId = $product->id;
        $productStock = $product->stock()->where('color', $validated['color'])->where('size', $validated['size'])->first();
        if (!$productStock && !$product->allow_out_of_stock_cart) {
            return response()->json(['message' => 'Üzgünüm, bu renk ve ölçüde stok bulunamadı.', 'status' => 'error']);
        } else if (!$productStock) {
            $productStockId = 'nostock_' . $productId . '_' . Str::slug($validated['color']) . '_' . $validated['size'];
        } else if ($productStock->stock <= 0 && !$product->allow_out_of_stock_cart) {
            return response()->json(['message' => 'Üzgünüm, bu renk ve ölçüde stok bulunamadı.', 'status' => 'error']);
        } else {
            $productStockId = $productStock->id;
        }
        
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
                        'color' => $validated['color'],
                        'size' => $validated['size'],
                        'quantity' => 1
                    ]);
                    $cartItem = CartItem::where('id', $createdItem->id)->with('product')->first();
                    $createdItemResource = new CartProductUserResources($cartItem);
                }
                DB::commit();
                return response()->json([
                    'message' => 'Harika bir seçim yaptınız! Ürün sepetinize eklendi, keyifli alışverişler dileriz 🎁',
                    'status' => 'success',
                    'item' => $createdItemResource,
                    'process' => 'create',
                    'cartItem' => $cartItem
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
            'product_slug' => 'required|exists:products,slug',
            'product_stock_id' => 'required',
            'quantity' => 'required|integer|min:1',
        ]);

        $user = $request->user();
        $product = Product::where('slug', $validated['product_slug'])->first();

        $productStock = $product->stock()->where('id', $validated['product_stock_id'])->first();
        if (($productStock && $productStock->stock <= 0 && !$product->allow_out_of_stock_cart) || (!$productStock && !$product->allow_out_of_stock_cart)) {
            return response()->json(['message' => 'Üzgünüm, bu üründe stok bulunamadı.', 'status' => 'error']);
        }
        if ($productStock && $productStock->stock < $validated['quantity'] && !$product->allow_out_of_stock_cart) {
            return response()->json(['message' => 'Üzgünüm, bu üründe yeterli stok bulunmamaktadır. Toptan alım için lütfen iletişime geçiniz.', 'status' => 'error']);
        }

        $exist = CartItem::where('cart_id', $user->cart->id)
            ->where('product_id', $product->id)
            ->where('product_stock_id', $validated['product_stock_id'])
            ->first();

        DB::beginTransaction();
        try {
            if (isset($exist)) {
                $exist->update(['quantity' => $validated['quantity']]);
                DB::commit();
                return response()->json([
                    'message' => 'Ürün güncellendi',
                    'status' => 'success'
                ]);
            } else {
                return response()->json([
                    'message' => 'Ürün sepetinizde bulunamadı',
                    'status' => 'error'
                ], 404);
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
            $cart = $user->cart->load(['cartItems.product', 'cartItems.productStock']);
            return $cart;
        } else {
            return [];
        }
    }

    protected function destroy(Request $request)
    {
        $validated = $request->validate([
            'product_slug' => 'required|exists:products,slug',
            'product_stock_number' => 'required'
        ]);
        $user = $request->user();
        $product_id = Product::where('slug', $validated['product_slug'])->value('id');
        if (!$product_id) {
            return response()->json(['message' => 'Üzgünüm Ürünü bulamadım. Kontrol ederek işleminizi yeniden gepçekleştiriniz.', 'status' => 'error']);
        }
        $exist = CartItem::where('cart_id', $user->cart->id)
            ->where('product_id', $product_id)
            ->where('product_stock_id', $validated['product_stock_number'])
            ->first();

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

    public function matchCartForUser(Request $request)
    {
        $user = $request->user();
        if (!$user || !$user->cart) {
            return response()->json(['items' => []]);
        }

        $cart = $user->cart->load(['cartItems.product']);
        $matchedCart = [];
        $removeIds = [];

        foreach ($cart->cartItems as $item) {
            $product = $item->product;
            $productStock = $item->productStock;

            if (!$product) {  // Ürün bulunamazsa sepetten kaldır
                $removeIds[] = $item->id;
                continue;
            }

            if (!$productStock && is_string($item->product_stock_id) && strpos($item->product_stock_id, 'nostock_') === 0 && $product->allow_out_of_stock_cart) {  // no stock ise ekle
                $matchedCart[] = new CartProductUserResources($item);
                continue;
            }

            if (!$productStock) {  // Stok bilgisi yoksa ve nostock da değilse sepetten kaldır
                $removeIds[] = $item->id;
                continue;
            }

            $stockQuantity = $productStock->stock;
            if ($stockQuantity <= 0 && !$product->allow_out_of_stock_cart) {
                $removeIds[] = $item->id;
                continue;
            }
            $matchedCart[] = new CartProductUserResources($item);
        }

        // Sepetten stokta olmayanları sil
        if (!empty($removeIds)) {
            CartItem::whereIn('id', $removeIds)->delete();
        }

        return response()->json(['items' => $matchedCart]);
        // return response()->json(['a' => $matchedCart]);
    }
}
