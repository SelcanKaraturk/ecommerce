<?php

namespace App\Http\Controllers\Api\User;

use App\Helpers\Helper;
use App\Http\Controllers\Controller;
use App\Http\Resources\CartProductResources;
use App\Models\Cart;
use App\Models\Product;
use App\Models\ProductStock;
use App\Models\User;
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

    public function update(Request $request)
    {
        $validated = $request->validate([
            'product' => 'required',
            'quantity' => 'required|integer|min:1',
        ]);

        // product_id ve product_stock_id artık slug ve stock_number ile geliyor, bunları id'ye çevir
        $product = Product::where('slug', $validated['product']['product_slug'])->first();
        // $productStock = $product ? $product->stock()->find($validated['product_stock_id']) : null;

        if (!$product) {
            return response()->json([
                'message' => 'Ürün stoktan kaldırıldı veya bulunamadı.',
                'status' => 'error'
            ], 404);
        }
        $cart = Helper::getCartFromCookie($request) ?? [];

        $productStock = $product ? $product->stock()->where('color', $validated['product']['color'])->where('size', $validated['product']['size'])->first() : null;
        $isNoStock = strpos($validated['product']['product_stock_number'], 'nostock_');

        if (!$productStock && $isNoStock === 0 && $validated['product']['allow_out_of_stock_cart'] === 1) {  // stokta olmayan ve sepete eklenmesine izin verilen ürün
            $nostockKey = null;
            foreach ($cart as $key => $item) {
                if (
                    isset($item['product_stock_number']) &&
                    $item['product_stock_number'] === $validated['product']['product_stock_number'] &&
                    $item['product_slug'] === $validated['product']['product_slug']
                ) {
                    $nostockKey = $key;
                    break;
                }
            }
            if ($nostockKey === null) {
                return response()->json([
                    'message' => 'Özel üretim ürün sepetinizde bulunamadı.',
                    'status' => 'error'
                ], 404);
            }

            // Quantity güncelle
            $cart[$nostockKey]['quantity'] = $validated['quantity'];
            return $this->withCartCookie(
                response()->json([
                    'message' => 'Ürün adedi güncellendi.',
                    'cartItem' => $cart[$nostockKey],
                    'status' => 'success'
                ]),
                $cart
            );
        } else if (!$productStock) {
            return response()->json([
                'message' => 'Ürün stoktan kaldırıldı veya bulunamadı.',
                'status' => 'error'
            ], 404);
        }

        $stockKey = null;
        foreach ($cart as $key => $item) {
            if (
                isset($item['product_stock_number']) &&
                $item['product_stock_number'] === $validated['product']['product_stock_number'] &&
                $item['product_slug'] === $validated['product']['product_slug']
            ) {
                $stockKey = $key;
                break;
            }
        }
        if ($stockKey === null) {
            return response()->json([
                'message' => 'Ürün sepetinizde bulunamadı.',
                'status' => 'error'
            ], 404);
        }
        $cart[$stockKey]['quantity'] = $validated['quantity'];
        return $this->withCartCookie(
            response()->json([
                'message' => 'Ürün adedi güncellendi.',
                'cartItem' => $cart[$stockKey],
                'status' => 'success'
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

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'product_slug' => 'required|exists:products,slug',
            'product_stock_number' => 'required'
        ]);

        $productSlug = $validated['product_slug'];
        $productStockNumber = $validated['product_stock_number'];

        $cart = Helper::getCartFromCookie($request) ?? [];

        // Filtrele: Sadece eşleşmeyen ürünleri tut
        $newCart = array_values(array_filter($cart, function ($item) use ($productSlug, $productStockNumber) {
            return !(
                isset($item['product_slug'], $item['product_stock_number']) &&
                $item['product_slug'] === $productSlug &&
                $item['product_stock_number'] === $productStockNumber
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
                'message' => 'Ürün sepetinizden kaldırıldı',
                'status' => 'success'
            ]),
            $newCart
        );
    }

    public function matchProductsInfo(Request $request)
    {
        $validated = $request->validate([
            'cart' => 'required|array',
            'cart.*.product_slug' => 'required|string',
            'cart.*.product_stock_number' => 'required',
            'cart.*.color' => 'sometimes|string',
            'cart.*.size' => 'sometimes|string',
            'cart.*.quantity' => 'sometimes|integer|min:1',
        ]);

        $cart = $validated['cart'];
        $matchedCart = [];
        $deneme = [];

        foreach ($cart as $item) {
            $product = Product::where('slug', $item['product_slug'])->first();
            if (!$product) {
                // Ürün veritabanında yoksa cart'tan da çıkar (ekleme)
                continue;
            }

            $productStockId = $item['product_stock_number'];

            if (is_string($productStockId) && strpos($productStockId, 'nostock_') === 0) {
                if (!$product->allow_out_of_stock_cart) {
                    continue;  // Stokta olmayan ürün sepete eklenmesine izin verilmiyorsa, ürün bilgilerini güncellemeden devam et
                }
                // Stokta olmayan varyant
                $deliveryDays = 10;
                $stock_status = 'no_stock';
                $stockQuantity = 0;
            } else {
                $productStock = $product->stock()->where('id', $productStockId)->first();
                if ($productStock) {
                    $stockQuantity = $productStock->stock;
                    if ($stockQuantity <= 0 && !$product->allow_out_of_stock_cart) {
                        continue;  // Stokta 0 veya daha az olan ürün sepete eklenmesine izin verilmiyorsa, ürün bilgilerini güncellemeden devam et
                    }
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
            // Sadece bulunan ürünleri yeni cart'a ekle
        }
        // /return response()->json(['itemssss' => $matchedCart, 'deneme' => $deneme, 'cart' => $cart]);
        // Cart'ı da güncelleyerek cookie'ye yaz
        return $this->withCartCookie(
            response()->json(['items' => $matchedCart]),
            $matchedCart
        );
    }
}
