<?php

namespace App\Http\Controllers\Api\User;

use App\Helpers\Helper;
use App\Http\Controllers\Controller;
use App\Http\Resources\CartProductResources;
use App\Models\Product;
use App\Models\ProductStock;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Str;

class CartCookieController extends Controller
{
    // Maksimum kaç ürün izin veriyoruz (cookie boyutu sınırlı)
    protected int $maxItems = 10;
    protected int $ttlMinutes = 60 * 24 * 7;  // 7 gün

    public function show(Request $request)
    {
        $cart = Helper::getCartFromCookie($request) ?? [];
        return response()->json($cart);
    }

    public function toggle(Request $request)
    {
        $validated = $request->validate([
            'product_slug' => 'required|exists:products,slug',
            'color' => 'required|string',
            'size' => 'required'
        ]);

        $product = Product::where('slug', $validated['product_slug'])->first();
        if (!$product) {
            return response()->json(['message' => 'Üzgünüm Ürünü bulamadım. Kontrol ederek işleminizi yeniden gepçekleştiriniz.', 'status' => 'error']);
        }
        $productSlug = $product->slug;
        $productStock = $product->stock()->where('color', $validated['color'])->where('size', $validated['size'])->first();
        if (!$productStock) {
            $productStockId = 'nostock_' . $product->id . '_' . Str::slug($validated['color']) . '_' . $validated['size'];
            $deliveryDays = 10;
            $stock_status = 'no_stock';
        } else {
            $productStockId = $productStock->id;
            $deliveryDays = null;
        }

        $cart = Helper::getCartFromCookie($request) ?? [];

        // Mevcut ürünün index'ini bul
        $existingIndex = array_search(true, array_map(function ($item) use ($productSlug, $productStockId) {
            return isset($item['product_slug'], $item['product_stock_number']) &&
                $item['product_slug'] === $productSlug &&
                $item['product_stock_number'] === $productStockId;
        }, $cart), true);

        if ($existingIndex !== false) {
            // Varsa çıkar
            unset($cart[$existingIndex]);

            $cart = array_values($cart);
            $message = 'Ürün sepetinizden çıkarıldı';
        } else {
            // Limit kontrolü
            if (count($cart) >= $this->maxItems) {
                return response()->json([
                    'message' => 'Maximum sepet sınırına ulaştınız. Daha fazla ürün yüklemek için sepetinizden ürün çıkarınız ya da WhatsApp üzerinden iletişime geçiniz.',
                    'status' => 'error'
                ], 400);
            }

            // Ekle
            $cartItem = [
                // 'product_id' => $productId,
                'product_stock_number' => $productStockId,
                'product_name' => $product->name,
                'product_slug' => $product->slug,
                'product_images' => $product->images,
                'product_price' => $product->price,
                'product_discount' => $product->discount,
                'color' => $validated['color'],
                'size' => $validated['size'],
                'quantity' => 1,
                'stock' => $productStock ? $productStock->stock : 0,
                'stock_status' => $productStock && $productStock->stock > 0 ? 'in_stock' : ($stock_status ?? 'no_stock'),
                'allow_out_of_stock_cart' => $product->allow_out_of_stock_cart,
            ];
            if ($deliveryDays) {
                $cartItem['delivery_days'] = $deliveryDays;
            }
            $cart = Helper::getCartFromCookie($request) ?? [];
            $cart[] = $cartItem;
            $message = 'Harika bir seçim yaptınız! Ürün sepetinize eklendi, keyifli alışverişler dileriz 🎁';
        }

        // Güncellenmiş cart item verisi
        // $cartItems = $this->buildCartItems($cart);

        return $this->withCartCookie(
            response()->json([
                'message' => $message,
                'data' => $cart,
                'delivery_days' => $deliveryDays ?? null,
            ]),
            $cart
        );
    }

    protected function withCartCookie($response, array $cart)
    {
        $payload = json_encode($cart);
        $encrypted = encrypt($payload);
        // $encrypted = encrypt(array_values($cart)); // sıralı ve int olarak korunur

        $secure = app()->environment('production');  // production'da true, local'da false
        $sameSite = $secure ? 'None' : 'Lax';

        return $response->cookie(
            'cart_items',
            $encrypted,
            $this->ttlMinutes,  // 7 gün (dakika)
            '/',
            null,
            $secure,
            true,  // httpOnly (JS doğrudan okumaz)
            false,
            $sameSite
        );
    }

    // protected function buildCartItems(array $cart)
    // {
    //     $stockIds = array_unique(array_column($cart, 'product_stock_id'));

    //     // Varyantları (product_stock) ilişkili ürünle beraber çek
    //     $variants = ProductStock::whereIn('id', $stockIds)
    //         ->with(['product' => function ($q) {
    //             $q->select('id', 'name', 'slug', 'price', 'discount', 'images');  // content yok!
    //         }, 'product.categories:id,slug'])
    //         ->get();

    //     // Stokta olmayanları bul
    //     $foundStockIds = $variants->pluck('id')->map(fn($id) => (string) $id)->toArray();
    //     $missingItems = array_filter($cart, function ($item) use ($foundStockIds) {
    //         return !in_array((string) $item['product_stock_id'], $foundStockIds);
    //     });

    //     // Stokta olmayanlar için temel veri oluştur
    //     $missingResources = array_map(function ($item) {
    //         $product = Product::with(['categories:id,slug'])
    //             ->find($item['product_id']);
    //         return [
    //             'delivery_days' => $item['delivery_days'] ?? 10,
    //             'color' => $item['color'] ?? null,
    //             'size' => $item['size'] ?? null,
    //             'stock' => 0,
    //             'stock_status' => 'not_found',
    //             'quantity' => $item['quantity'] ?? 1,
    //             'product_name' => $product?->name,
    //             'product_slug' => $product?->slug,
    //             'product_price' => $product?->price,
    //             'product_discount' => $product?->discount,
    //             'product_images' => $product?->images,
    //         ];
    //     }, $missingItems);

    //     // Stokta olanlar + olmayanlar birleştir
    //     $resources = CartProductResources::collection($variants)->toArray(request());
    //     $all = array_merge($resources, $missingResources);
    //     return $all;
    // }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'product_stock_id' => 'required|exists:product_stocks,id'
        ]);

        $productId = (int) $validated['product_id'];
        $productStockId = (int) $validated['product_stock_id'];

        $cart = Helper::getCartFromCookie($request) ?? [];

        // Filtrele: Sadece eşleşmeyen ürünleri tut
        $newCart = array_values(array_filter($cart, function ($item) use ($productId, $productStockId) {
            return !(
                isset($item['product_id'], $item['product_stock_id']) &&
                (int) $item['product_id'] === $productId &&
                (int) $item['product_stock_id'] === $productStockId
            );
        }));

        if (count($cart) === count($newCart)) {
            // Hiçbir şey silinmemiş → ürün bulunamadı
            return response()->json([
                'message' => 'İşleminiz Gerçekleştirilemedi.',
                'status' => 'error'
            ]);
        }

        // Yeni cookie ile geri döndür
        return $this->withCartCookie(
            response()->json([
                'message' => 'Ürün sepetinizden çıkarıldı',
                'status' => 'success'
            ]),
            $newCart
        );
    }

    public function matchProductsInfo(Request $request)
    {
        $validated = $request->validate([
            'cart' => 'required|array',
            'cart.*.product_slug' => 'required|string|exists:products,slug',
            'cart.*.product_stock_number' => 'required',
            'cart.*.color' => 'sometimes|string',
            'cart.*.size' => 'sometimes|string',
        ]);

        $cart = $validated['cart'];
        $matchedCart = [];

        foreach ($cart as $item) {
            $product = Product::where('slug', $item['product_slug'])->first();
            if (!$product) {
                continue;
            }

            $productStockId = $item['product_stock_number'];
            if (is_string($productStockId) && strpos($productStockId, 'nostock_') === 0) {
                // Stokta olmayan varyant
                $deliveryDays = 10;
                $stock_status = 'no_stock';
                $stockQuantity = 0;
            } else {
                $productStock = $product->stock()->where('id', $productStockId)->first();
                if ($productStock) {
                    $stockQuantity = $productStock->stock;
                    $stock_status = $stockQuantity > 0 ? 'in_stock' : 'no_stock';
                    $deliveryDays = $stock_status === 'in_stock' ? null : 10;
                    $item['color'] = $productStock->color;
                    $item['size'] = $productStock->size;
                } else {
                    // Varyant bulunamadı
                    $deliveryDays = null;
                    $stock_status = 'not_found';
                    $stockQuantity = 0;
                }
            }

            $matchedCart[] = [
                'product_stock_number' => $item['product_stock_number'],
                'delivery_days' => $deliveryDays,
                'color' => $item['color'] ?? null,
                'size' => $item['size'] ?? null,
                'quantity' => $item['quantity'] ?? 1,
                'product_name' => $product->name,
                'product_slug' => $product->slug,
                'product_images' => $product->images,
                'product_price' => $product->price,
                'product_discount' => $product->discount,
                'stock' => $stockQuantity,
                'stock_status' => $stock_status,
                'allow_out_of_stock_cart' => $product->allow_out_of_stock_cart,
            ];
        }

        return response()->json(['items' => $matchedCart]);
    }   
}
