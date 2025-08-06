<?php
namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;

class CartService
{
    protected $guestTtlMinutes = 60 * 24 * 7; // 7 gün

    public function getGuestKey(string $sessionId): string
    {
        return "guest_cart:{$sessionId}";
    }

    public function getGuestCart(string $sessionId): array
    {
        return Cache::get($this->getGuestKey($sessionId), []); // [product_id => quantity]
    }

    public function addOrToggleGuestItem(string $sessionId, int $productId): array
    {
        $key = $this->getGuestKey($sessionId);
        $cart = $this->getGuestCart($sessionId);

        if (isset($cart[$productId])) {
            // zaten varsa çıkar
            unset($cart[$productId]);
        } else {
            $cart[$productId] = 1; // quantity sabit 1, toggle davranışı
        }

        Cache::put($key, $cart, now()->addMinutes($this->guestTtlMinutes));
        return $cart;
    }

    public function removeGuestItem(string $sessionId, int $productId): array
    {
        $key = $this->getGuestKey($sessionId);
        $cart = $this->getGuestCart($sessionId);
        unset($cart[$productId]);
        Cache::put($key, $cart, now()->addMinutes($this->guestTtlMinutes));
        return $cart;
    }

    public function mergeGuestIntoUserCart(string $sessionId, $user)
    {
        $guestCart = $this->getGuestCart($sessionId);
        if (empty($guestCart)) {
            return;
        }

        $cart = Cart::firstOrCreate(
            ['user_id' => $user->id],
            ['id' => (string) Str::uuid()]
        );

        foreach ($guestCart as $productId => $quantity) {
            $product = Product::find($productId);
            if (!$product) continue;

            $item = $cart->cartItems()->where('product_id', $productId)->first();
            if ($item) {
                // toggle mantığı olduğu için quantity zaten 1, burada üzerine yazabiliriz
                $item->quantity = 1;
                $item->save();
            } else {
                $cart->items()->create([
                    'product_id' => $productId,
                    'quantity' => 1,
                ]);
            }
        }

        Cache::forget($this->getGuestKey($sessionId));
    }

    public function getUserCart($user)
    {
        return Cart::firstOrCreate(
            ['user_id' => $user->id],
            ['id' => (string) Str::uuid()]
        );
    }
}
