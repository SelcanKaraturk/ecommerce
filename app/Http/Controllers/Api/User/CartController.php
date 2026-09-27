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
use Illuminate\Support\Str;
use PhpParser\Node\Stmt\TryCatch;

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
        $product = Product::where('slug', $validated['product_slug'])->firstOrFail();

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
                $item = $cart->cartItems()->where(['product_id' => $productId, 'color' => $validated['color'], 'size' => $validated['size']])->first();
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
                        'color' => $validated['color'],
                        'size' => $validated['size'],
                        'quantity' => 1
                    ]);
                    $cartItem = CartItem::where('id', $createdItem->id)->with('product')->first();
                    $createdItemResource = new CartProductUserResources($cartItem);
                }
                DB::commit();
                return response()->json([
                    'message' => "✨ Harika seçim! {$product->name} sepetinize eklendi.",
                    'status' => 'success',
                    'item' => $createdItemResource,
                    'process' => 'create',
                    'cartItem' => $cartItem,
                    'product' => $product,
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
            'color' => 'required|string',
            'size' => 'required',
            'quantity' => 'required|integer|min:1|max:10',
        ]);

        $user = $request->user();
        $product = Product::where('slug', $validated['product_slug'])->first();

        $productStock = $product->stock()
            ->where('color', $validated['color'])
            ->where('size', $validated['size'])
            ->first();
        if (($productStock && $productStock->stock <= 0 && !$product->allow_out_of_stock_cart) || (!$productStock && !$product->allow_out_of_stock_cart)) {
            return response()->json(['message' => 'Üzgünüm, bu üründe stok bulunamadı.', 'status' => 'error']);
        }
        if ($productStock && $productStock->stock < $validated['quantity'] && !$product->allow_out_of_stock_cart) {
            return response()->json(['message' => 'Üzgünüm, bu üründe yeterli stok bulunmamaktadır. Toptan alım için lütfen iletişime geçiniz.', 'status' => 'error']);
        }

        $exist = CartItem::where('cart_id', $user->cart->id)
            ->where('product_id', $product->id)
            ->where('color', $validated['color'])
            ->where('size', $validated['size'])
            ->first();

        DB::beginTransaction();
        try {
            if (isset($exist)) {
                $exist->update(['quantity' => $validated['quantity']]);
                DB::commit();
                return response()->json([
                    'message' => 'Sepet miktarı güncellendi',
                    'status' => 'success'
                ]);
            } else {
                return response()->json([
                    'message' => 'Sepetinizde bu ürün bulunamadı',
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
            $cart = $user->cart->load(['cartItems.product']);
            return $cart;
        } else {
            return [];
        }
    }

    protected function destroy(Request $request)
    {
        $validated = $request->validate([
            'product_slug' => 'required|exists:products,slug',
            'color' => 'required|string',
            'size' => 'required'
        ]);
        $user = $request->user();
        $product_id = Product::where('slug', $validated['product_slug'])->value('id');
        if (!$product_id) {
            return response()->json(['message' => 'Üzgünüm Ürünü bulamadım. Kontrol ederek işleminizi yeniden gepçekleştiriniz.', 'status' => 'error']);
        }
        $exist = CartItem::where('cart_id', $user->cart->id)
            ->where('product_id', $product_id)
            ->where('color', $validated['color'])
            ->where('size', $validated['size'])
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

            if (!$product) {
                $removeIds[] = $item->id;
                continue;
            }

            $productStock = $product
                ->stock()
                ->where('color', $item->color)
                ->where('size', $item->size)
                ->first();

            $isAvailable = $product->allow_out_of_stock_cart ||
                ($productStock && $productStock->stock >= $item->quantity);

            $matchedCart[] = [
                'item' => new CartProductUserResources($item),
                'is_available' => $isAvailable,
                'stock_status' => $isAvailable ? 'in_stock' : 'no_stock',
            ];
        }

        // Sepetten stokta olmayanları sil
        if (!empty($removeIds)) {
            CartItem::whereIn('id', $removeIds)->delete();
        }

        return response()->json([$matchedCart]);
        // return response()->json(['a' => $matchedCart]);
    }
}
