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
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|integer',
            'product_stock_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Geçersiz veri'], 422);
        }

        $productId = (int) $request->input('product_id');
        $productStockId = (int) $request->input('product_stock_id');

        $cart = $this->getCartFromCookie($request);
        if (!is_array($cart)) {
            $cart = [];
        }

        // Sepette bu product_id + product_stock_id ikilisi var mı bak
        $existingIndex = null;
        foreach ($cart as $index => $item) {
            if (is_array($item)) {
                if (
                    isset($item['product_id'], $item['product_stock_id']) &&
                    (int) $item['product_id'] === $productId &&
                    (int) $item['product_stock_id'] === $productStockId
                ) {
                    $existingIndex = $index;
                    break;
                }
            }
        }

        if ($existingIndex !== null) {
            // Varsa çıkar (toggle)
            unset($cart[$existingIndex]);
            $cart = array_values($cart);
            $message = "Ürün sepetinizden çıkarıldı";
        } else {
            // Yoksa ekle, limit kontrolü (farklı ürün/varyant sayısına göre ayarlayabilirsin)
            if (count($cart) >= $this->maxItems) {
                return response()->json([
                    'message' => 'Maximum sepet sınırına ulaştınız. Daha fazla ürün yüklemek için sepetinizden ürün çıkarınız ya da WhatsApp üzerinden iletişime geçiniz.',
                    'status' => 'error'
                ], 400);
            }

            $cart[] = [
                'product_id' => $productId,
                'product_stock_id' => $productStockId,
            ];
            $message = "Ürün sepetinize eklendi";
        }

        // Güncellenmiş cart'a göre anlık dönecek veriyi oluştur
        $cartItems = $this->buildCartItems($cart);

        $response = response()->json([
            'message' => $message,
            'data' => $cartItems,
        ]);
        return $this->withCartCookie(response()->json($response), $cart);
        //return $this->withCartCookie(response()->json($cart), $cart);
    }
    protected function getCartFromCookie(Request $request): array
    {

        $raw = $request->cookie('cart_items');
        if (!$raw) {
            return [];
        }

        try {
            $decrypted = decrypt(value: $raw);
            // decrypt'tan ya dizi ya da JSON string gelmesi bekleniyor
            if (is_string($decrypted)) {
                $decoded = json_decode($decrypted, true);
            } elseif (is_array($decrypted)) {
                $decoded = $decrypted;
            } else {
                \Log::warning('Cart cookie decrypted unexpected type', [
                    'type' => gettype($decrypted),
                    'value' => $decrypted,
                ]);
                return [];
            }

            if (!is_array($decoded)) {
                \Log::warning('Cart cookie format invalid after decode', ['decoded' => $decoded]);
                return [];
            }

            $cart = [];
            foreach ($decoded as $item) {
                if (!is_array($item)) {
                    continue;
                }

                if (!isset($item['product_id'], $item['product_stock_id'])) {
                    continue;
                }

                $productId = filter_var($item['product_id'], FILTER_VALIDATE_INT);
                $stockId = filter_var($item['product_stock_id'], FILTER_VALIDATE_INT);

                if ($productId === false || $stockId === false) {
                    continue;
                }

                $cart[] = [
                    'product_id' => (int) $productId,
                    'product_stock_id' => (int) $stockId,
                ];
            }

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
}
