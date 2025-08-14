<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\CartProductResources;
use App\Models\Product;
use App\Models\ProductStock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Contracts\Encryption\DecryptException;
class CartCookieController extends Controller
{
    // Maksimum kaç ürün izin veriyoruz (cookie boyutu sınırlı)
    protected int $maxItems = 10;
    protected int $ttlMinutes = 60 * 24 * 7; // 7 gün

    public function show(Request $request)
    {
        $cart = $this->getCartFromCookie($request);
        $stockIds = array_unique(array_column($cart, 'product_stock_id'));

        // Varyantları, ilişkili ürün + kategori + renk/beden ile çek
        $cartProducts = ProductStock::whereIn('id', $stockIds)
            ->with([
                'product.category:id,slug'
            ])
            ->get();
        //$cartProducts = Product::whereIn('id', $cart)->with(['category:id,slug', 'stock'])->get();
        return response()->json(CartProductResources::collection($cartProducts));
    }

    public function toggle(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|integer',
            'product_stock_id' => 'required|integer',
        ]);

        $productId = (int) $validated['product_id'];
        $productStockId = (int) $validated['product_stock_id'];

        $cart = $this->getCartFromCookie($request) ?? [];

        // Mevcut ürünün index'ini bul
        $existingIndex = array_search(true, array_map(function ($item) use ($productId, $productStockId) {
            return isset($item['product_id'], $item['product_stock_id']) &&
                (int) $item['product_id'] === $productId &&
                (int) $item['product_stock_id'] === $productStockId;
        }, $cart), true);

        if ($existingIndex !== false) {
            // Varsa çıkar
            unset($cart[$existingIndex]);
            $cart = array_values($cart);
            $message = "Ürün sepetinizden çıkarıldı";
        } else {
            // Limit kontrolü
            if (count($cart) >= $this->maxItems) {
                return response()->json([
                    'message' => 'Maximum sepet sınırına ulaştınız. Daha fazla ürün yüklemek için sepetinizden ürün çıkarınız ya da WhatsApp üzerinden iletişime geçiniz.',
                    'status' => 'error'
                ], 400);
            }

            // Ekle
            $cart[] = [
                'product_id' => $productId,
                'product_stock_id' => $productStockId,
            ];
            $message = "Ürün sepetinize eklendi";
        }

        // Güncellenmiş cart item verisi
        $cartItems = $this->buildCartItems($cart);

        return $this->withCartCookie(
            response()->json([
                'message' => $message,
                'data' => $cartItems,
            ]),
            $cart
        );
    }
    protected function getCartFromCookie(Request $request): array
    {
        $raw = $request->cookie('cart_items');

        if (!$raw) {
            return [];
        }

        try {
            $decrypted = decrypt($raw);

            // JSON ise decode et, array ise direkt al
            $decoded = is_array($decrypted) ? $decrypted : json_decode($decrypted, true);

            if (!is_array($decoded)) {
                \Log::warning('Cart cookie format invalid after decode', ['decoded' => $decoded]);
                return [];
            }

            // Geçerli item’ları filtrele
            $cart = array_values(array_filter(array_map(function ($item) {
                if (!is_array($item) || !isset($item['product_id'], $item['product_stock_id'])) {
                    return null;
                }

                $productId = filter_var($item['product_id'], FILTER_VALIDATE_INT);
                $stockId = filter_var($item['product_stock_id'], FILTER_VALIDATE_INT);

                if ($productId === false || $stockId === false) {
                    return null;
                }

                return [
                    'product_id' => (int) $productId,
                    'product_stock_id' => (int) $stockId,
                ];
            }, $decoded)));

            return $cart;

        } catch (DecryptException $e) {
            \Log::warning('Failed to decrypt cart_items cookie', ['message' => $e->getMessage()]);
        } catch (\Throwable $e) {
            \Log::error('Unexpected error reading cart_items cookie', ['exception' => $e]);
        }

        return [];
    }

    protected function withCartCookie($response, array $cart)
    {
        $payload = json_encode($cart);
        $encrypted = encrypt($payload);
        //$encrypted = encrypt(array_values($cart)); // sıralı ve int olarak korunur

        $secure = app()->environment('production'); // production'da true, local'da false

        return $response->cookie(
            'cart_items',
            $encrypted,
            $this->ttlMinutes, // 7 gün (dakika)
            '/',
            null,
            $secure,
            true,      // httpOnly (JS doğrudan okumaz)
            false,
            'Strict'
        );
    }
    protected function buildCartItems(array $cart)
    {
        $stockIds = array_unique(array_column($cart, 'product_stock_id'));

        // Varyantları (product_stock) ilişkili ürünle beraber çek
        $variants = ProductStock::whereIn('id', $stockIds)
            ->with(['product.category:id,slug'])
            ->get();

        return CartProductResources::collection($variants);
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'product_stock_id' => 'required|exists:product_stocks,id'
        ]);

        $productId = (int) $validated['product_id'];
        $productStockId = (int) $validated['product_stock_id'];

        $cart = $this->getCartFromCookie($request);

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
}
