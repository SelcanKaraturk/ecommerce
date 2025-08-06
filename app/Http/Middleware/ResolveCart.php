<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Services\CartService;

class ResolveCart
{
    public function handle(Request $request, Closure $next)
    {
        $cartService = app(CartService::class);
        $sessionId = $request->session()->getId();
        $user = $request->user();

        // guest cart öğeleri
        $guestCartItems = $cartService->getGuestCart($sessionId);

        if ($user) {
            // login olunca guest cart'ı merge et
            $cartService->mergeGuestIntoUserCart($sessionId, $user);
            $cart = $cartService->getUserCart($user);
        } else {
            $cart = null; // guest'te kalıcı cart yok
        }

        $request->attributes->set('guest_cart_items', $guestCartItems);
        $request->attributes->set('cart', $cart);

        return $next($request);
    }
}
