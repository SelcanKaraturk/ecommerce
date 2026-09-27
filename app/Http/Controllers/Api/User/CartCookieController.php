<?php

namespace App\Http\Controllers\Api\User;

use App\Helpers\Helper;
use App\Http\Controllers\Controller;
use App\Http\Resources\CartProductUserResources;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;

class CartCookieController extends Controller
{
    // Maksimum kaç ürün izin veriyoruz (cookie boyutu sınırlı)
    protected int $maxItems = 10;
    protected int $ttlMinutes = 60 * 24 * 7;  // 7 gün

    public function show(Request $request)
    {
        $cart = Helper::getCartFromCookie($request) ?? [];
        $matchedCart = $this->syncCartItems($cart);

        return $this->withCartCookie(
            response()->json($matchedCart),
            $matchedCart
        );
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

        $cart = Helper::getCartFromCookie($request) ?? [];

        // Mevcut ürünün index'ini bul
        $existingIndex = array_search(true, array_map(function ($item) use ($productSlug, $validated) {
            return isset($item['product_slug'], $item['color'], $item['size']) &&
                $item['product_slug'] === $productSlug &&
                $item['color'] === $validated['color'] &&
                $item['size'] === $validated['size'];
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
                'product_slug' => $product->slug,
                'color' => $validated['color'],
                'size' => $validated['size'],
                'quantity' => 1,
            ];
            $cart[] = $cartItem;
            $message = 'Harika bir seçim yaptınız! Ürün sepetinize eklendi, keyifli alışverişler dileriz 🎁';
        }

        // Güncellenmiş cart item verisi
        // $cartItems = $this->buildCartItems($cart);

        return $this->withCartCookie(
            response()->json([
                'message' => $message,
                'data' => $this->syncCartItems($cart),
            ]),
            $this->syncCartItems($cart)
        );
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'product.product_slug' => 'required|exists:products,slug',
            'product.color' => 'required|string',
            'product.size' => 'required',
            'quantity' => 'required|integer|min:1|max:10',
        ]);

        $product = Product::where('slug', $validated['product']['product_slug'])->first();

        if (!$product) {
            return response()->json([
                'message' => 'Üzgünüm, ürün bulunamadı lütfen tekrar deneyiniz.',
                'status' => 'error'
            ], 404);
        }
        $cart = Helper::getCartFromCookie($request) ?? [];

        $productStock = $product->stock()->where('color', $validated['product']['color'])->where('size', $validated['product']['size'])->first();
        if (!$productStock && !$product->allow_out_of_stock_cart) {
            return response()->json([
                'message' => 'Ürün stoktan kaldırıldı veya bulunamadı.',
                'status' => 'error'
            ], 404);
        }

        $stockKey = null;
        foreach ($cart as $key => $item) {
            if (
                isset($item['product_slug'], $item['color'], $item['size']) &&
                $item['product_slug'] === $validated['product']['product_slug'] &&
                $item['color'] === $validated['product']['color'] &&
                $item['size'] === $validated['product']['size']
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
                'cartItem' => $this->cartItemPayload($product, $cart[$stockKey]),
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
            'color' => 'required|string',
            'size' => 'required'
        ]);

        $productSlug = $validated['product_slug'];
        $color = $validated['color'];
        $size = $validated['size'];

        $cart = Helper::getCartFromCookie($request) ?? [];

        // Filtrele: Sadece eşleşmeyen ürünleri tut
        $newCart = array_values(array_filter($cart, function ($item) use ($productSlug, $color, $size) {
            return !(
                isset($item['product_slug'], $item['color'], $item['size']) &&
                $item['product_slug'] === $productSlug &&
                $item['color'] === $color &&
                $item['size'] === $size
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
            'cart.*.color' => 'required|string',
            'cart.*.size' => 'required',
            'cart.*.quantity' => 'sometimes|integer|min:1',
        ]);

        $matchedCart = $this->syncCartItems($validated['cart']);

        // /return response()->json(['itemssss' => $matchedCart, 'deneme' => $deneme, 'cart' => $cart]);
        // Cart'ı da güncelleyerek cookie'ye yaz
        return $this->withCartCookie(
            response()->json(['items' => $matchedCart]),
            $matchedCart
        );
    }

    protected function syncCartItems(array $cart): array
    {
        $matchedCart = [];

        foreach ($cart as $item) {
            $product = Product::where('slug', $item['product_slug'])->first();
            if (!$product) {
                continue;
            }

            $matchedCart[] = $this->cartItemPayload($product, $item);
        }

        return $matchedCart;
    }

    protected function cartItemPayload(Product $product, array $item): array
    {
        $cartItem = new CartItem([
            'color' => $item['color'],
            'size' => $item['size'],
            'quantity' => $item['quantity'] ?? 1,
        ]);
        $cartItem->setRelation('product', $product);

        return (new CartProductUserResources($cartItem))->resolve();
    }
}
