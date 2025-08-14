<?php

namespace App\Listeners;

use App\Models\ProductStock;
use Illuminate\Auth\Events\Login;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Contracts\Encryption\DecryptException;
class MergeCookieCart
{
    // public function handle(Login $event)
    // {
    //     $request = request(); // global helper ile current request
    //     $user = $event->user;

    //     $cookieCart = $this->getCartFromCookie($request);
    //     if (count($cookieCart) > 0) {
    //         $cart = Cart::firstOrCreate( // 2. Kullanıcının kalıcı cart'ını al veya oluştur
    //             ['user_id' => $user->id]
    //         );
    //         foreach ($cookieCart as $item) {
    //             $product = Product::find($item['product_id']);
    //             $product_stock = ProductStock::find($item['product_stock_id']);

    //             if (!$product || !$product_stock) {
    //                 continue;
    //             }
    //             $existing = $cart->cartItems()->where(
    //                 ['product_id' => $item['product_id'], 'product_stock_id' => $item['product_stock_id']]
    //             )->first();

    //             if (!$existing) {
    //                 $cart->cartItems()->create([
    //                     'product_id' => $item['product_id'],
    //                     'quantity' => 1,
    //                     'product_stock_id' => $item['product_stock_id']
    //                 ]);
    //             }
    //         }
    //     }
    // }

    // protected function getCartFromCookie(Request $request): array
    // {

    //     $raw = $request->cookie('cart_items');
    //     if (!$raw) {
    //         return [];
    //     }

    //     try {
    //         $decrypted = decrypt($raw);
    //         // decrypt'tan ya dizi ya da JSON string gelmesi bekleniyor
    //         if (is_string($decrypted)) {
    //             $decoded = json_decode($decrypted, true);
    //         } elseif (is_array($decrypted)) {
    //             $decoded = $decrypted;
    //         } else {
    //             \Log::warning('Cart cookie decrypted unexpected type', [
    //                 'type' => gettype($decrypted),
    //                 'value' => $decrypted,
    //             ]);
    //             return [];
    //         }

    //         if (!is_array($decoded)) {
    //             \Log::warning('Cart cookie format invalid after decode', ['decoded' => $decoded]);
    //             return [];
    //         }

    //         $cart = [];
    //         foreach ($decoded as $item) {
    //             if (!is_array($item)) {
    //                 continue;
    //             }

    //             if (!isset($item['product_id'], $item['product_stock_id'])) {
    //                 continue;
    //             }

    //             $productId = filter_var($item['product_id'], FILTER_VALIDATE_INT);
    //             $stockId = filter_var($item['product_stock_id'], FILTER_VALIDATE_INT);

    //             if ($productId === false || $stockId === false) {
    //                 continue;
    //             }

    //             $cart[] = [
    //                 'product_id' => (int) $productId,
    //                 'product_stock_id' => (int) $stockId,
    //             ];
    //         }
    //         cookie()->queue(cookie()->forget('cart_items'));
    //         return $cart;
    //     } catch (DecryptException $e) {
    //         \Log::warning('Failed to decrypt cart_items cookie', ['message' => $e->getMessage()]);
    //     } catch (\Throwable $e) {
    //         \Log::error('Unexpected error reading cart_items cookie', ['exception' => $e]);
    //     }

    //     return [];

    // }


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

            // Cookie'yi temizle
            cookie()->queue(cookie()->forget('cart_items'));

            return $cart;

        } catch (DecryptException $e) {
            \Log::warning('Failed to decrypt cart_items cookie', ['message' => $e->getMessage()]);
        } catch (\Throwable $e) {
            \Log::error('Unexpected error reading cart_items cookie', ['exception' => $e]);
        }

        return [];
    }

    public function handle(Login $event)
    {
        $request = request();
        $user = $event->user;

        // Cookie’den sepeti al (boşsa devam etme)
        $cookieCart = $this->getCartFromCookie($request);
        if (empty($cookieCart)) {
            return;
        }

        // Kullanıcının cart'ını al veya oluştur
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        // Tüm ID’leri toplu al
        $productIds = array_column($cookieCart, 'product_id');
        $stockIds = array_column($cookieCart, 'product_stock_id');

        // Ürünleri ve stokları tek seferde çek
        $products = Product::whereIn('id', $productIds)->get()->keyBy('id');
        $stocks = ProductStock::whereIn('id', $stockIds)->get()->keyBy('id');

        // Kullanıcının mevcut cart item'larını topluca al
        $existingItems = $cart->cartItems()
            ->whereIn('product_id', $productIds)
            ->whereIn('product_stock_id', $stockIds)
            ->get()
            ->map(fn($item) => $item->product_id . '-' . $item->product_stock_id)
            ->toArray();

        // Yeni ürünleri ekle
        foreach ($cookieCart as $item) {
            $productId = $item['product_id'];
            $stockId = $item['product_stock_id'];

            // Ürün veya stok yoksa atla
            if (!isset($products[$productId]) || !isset($stocks[$stockId])) {
                continue;
            }

            // Zaten varsa ekleme
            if (in_array($productId . '-' . $stockId, $existingItems)) {
                continue;
            }

            $cart->cartItems()->create([
                'product_id' => $productId,
                'quantity' => 1,
                'product_stock_id' => $stockId
            ]);
        }
    }
}
