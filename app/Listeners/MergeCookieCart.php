<?php

namespace App\Listeners;

use App\Helpers\Helper;
use App\Models\Cart;
use App\Models\Product;
use App\Models\ProductStock;
use Illuminate\Auth\Events\Login;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class MergeCookieCart
{
    // protected function getCartFromCookie(Request $request): array
    // {
    //     $raw = $request->cookie('cart_items');

    //     if (!$raw) {
    //         return [];
    //     }

    //     try {
    //         $decrypted = decrypt($raw);

    //         // JSON ise decode et, array ise direkt al
    //         $decoded = is_array($decrypted) ? $decrypted : json_decode($decrypted, true);

    //         if (!is_array($decoded)) {
    //             \Log::warning('Cart cookie format invalid after decode', ['decoded' => $decoded]);
    //             return [];
    //         }

    //         // Geçerli item’ları filtrele
    //         $cart = array_values(array_filter(array_map(function ($item) {
    //             if (!is_array($item) || !isset($item['product_id'], $item['product_stock_id'])) {
    //                 return null;
    //             }

    //             $productId = filter_var($item['product_id'], FILTER_VALIDATE_INT);
    //             $stockId = filter_var($item['product_stock_id'], FILTER_VALIDATE_INT);

    //             if ($productId === false || $stockId === false) {
    //                 return null;
    //             }

    //             return [
    //                 'product_id' => (int) $productId,
    //                 'product_stock_id' => (int) $stockId,
    //             ];
    //         }, $decoded)));

    //         // Cookie'yi temizle
    //         cookie()->queue(cookie()->forget('cart_items'));

    //         return $cart;

    //     } catch (DecryptException $e) {
    //         \Log::warning('Failed to decrypt cart_items cookie', ['message' => $e->getMessage()]);
    //     } catch (\Throwable $e) {
    //         \Log::error('Unexpected error reading cart_items cookie', ['exception' => $e]);
    //     }

    //     return [];
    // }

    public function handle(Login $event)
    {
        $request = request();
        $user = $event->user;

        // Cookie’den sepeti al (boşsa devam etme)
        $cookieCart = Helper::getCartFromCookie($request);
        if (empty($cookieCart)) {
            return;
        }

        // Kullanıcının cart'ını al veya oluştur
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        // Tüm ID’leri toplu al
        $productSlug = array_column($cookieCart, 'product_slug');
        $stockIds = array_column($cookieCart, 'product_stock_number');

        // Ürünleri ve stokları tek seferde çek
        $products = Product::whereIn('slug', $productSlug)->get()->keyBy('slug');
        $stocks = ProductStock::whereIn('id', $stockIds)->get()->keyBy('id');

        // Kullanıcının mevcut cart item'larını topluca al
        $existingItems = $cart
            ->cartItems()
            ->whereIn('product_id', $products->pluck('id'))
            ->whereIn('product_stock_id', $stockIds)
            ->get()
            ->map(fn($item) => $item->product_id . '-' . $item->product_stock_id)
            ->toArray();

        // Yeni ürünleri ekle
        foreach ($cookieCart as $key => $item) {
            $product = $products[$item['product_slug']] ?? null;
            $productId = $product?->id;
            $stockId = $item['product_stock_id'] ?? $item['product_stock_number'] ?? null;
            $color = $item['color'] ?? null;
            $size = $item['size'] ?? null;
            $quantity = $item['quantity'] ?? 1;
            $allowAuthOfStock = $item['allow_out_of_stock_cart'] ?? false;

            if (!$productId || !$stockId) {
                continue;  // Ürün veya stok yoksa atla
            }

            // Zaten varsa ekleme, quantity güncelle
            if (in_array($productId . '-' . $stockId, $existingItems)) {
                $cartItem = $cart
                    ->cartItems()
                    ->where('product_id', $productId)
                    ->where('product_stock_id', $stockId)
                    ->first();
                if ($cartItem) {
                    $cartItem->quantity = $quantity;
                    $cartItem->color = $color;
                    $cartItem->size = $size;
                    $cartItem->save();
                }
                continue;
            }

            // Stok kontrolü (nostock veya normal)
            if (!isset($stocks[$stockId]) && !(strpos($stockId, 'nostock_') === 0 && $allowAuthOfStock === 1)) {
                continue;
            }
            // if ($key === 2) {
            //     return response()->json(['id' => $productId, 'stock' => $stockId, 'color' => $color, 'size' => $size, 'quantity' => $quantity, 'allowAuthOfStock' => $allowAuthOfStock]);
            // }

            $cart->cartItems()->create([
                'product_id' => $productId,
                'quantity' => $quantity,
                'product_stock_id' => $stockId,
                'color' => $color,
                'size' => $size,
            ]);
        }
    }
}
