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
    public function handle(Login $event)
    {
        $request = request(); // global helper ile current request
        $user = $event->user;

        $cookieCart = $this->getCartFromCookie($request);
        if (count($cookieCart) > 0) {
            $cart = Cart::firstOrCreate( // 2. Kullanıcının kalıcı cart'ını al veya oluştur
                ['user_id' => $user->id]
            );
            foreach ($cookieCart as $item) {
                $product = Product::find($item['product_id']);
                $product_stock = ProductStock::find($item['product_stock_id']);
                
                if (!$product || !$product_stock) {
                    continue;
                }
                $existing = $cart->cartItems()->where(
                    ['product_id' => $item['product_id'], 'product_stock_id' => $item['product_stock_id']]
                )->first();

                if (!$existing) {
                    $cart->cartItems()->create([
                        'product_id' => $item['product_id'],
                        'quantity' => 1,
                        'product_stock_id' => $item['product_stock_id']
                    ]);
                }
            }
        }
    }

    protected function getCartFromCookie(Request $request): array
    {

        $raw = $request->cookie('cart_items');
        if (!$raw) {
            return [];
        }

        try {
            $decrypted = decrypt($raw);
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
}
