<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\CartProductUserResources;
use Illuminate\Http\Request;
use App\Models\Cart;
use App\Services\CartService;
use App\Models\User;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{

    public function index(Request $request)
    {
        if (auth()->check()) {
            $user = auth()->user();
            $cart = $user->cart->load(['cartItems.product.category:id,slug', 'cartItems.productStock']);
        } else {
            return [];
        }

        return response()->json(CartProductUserResources::collection($cart->cartItems));
        //return response()->json($cart->cartItems->pluck('product_stock_id'));
    }
    protected function formatGuestCart(array $guestItems)
    {
        $result = [];
        foreach ($guestItems as $productId => $qty) {
            $product = Product::find($productId);
            if (!$product)
                continue;
            $result[] = [
                'product_id' => $product->id,
                'quantity' => $qty,
                'product' => $product,
            ];
        }
        return $result;
    }

    public function addItem(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1|max:100',
        ]);

        $cart = $request->attributes->get('cart');

        // Transaction ile güvenli güncelleme
        DB::transaction(function () use ($cart, $validated) {
            $product = Product::findOrFail($validated['product_id']);
            $item = $cart->cartItems()->where('product_id', $product->id)->first();
            if ($item) {
                $item->quantity += $validated['quantity'];
                $item->save();
            } else {
                $cart->cartItems()->create([
                    'product_id' => $product->id,
                    'quantity' => $validated['quantity']
                ]);
            }
        });

        return $this->show($request);
    }

    // Toggle (ekle varsa çıkar)
    public function toggleItem(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $cartService = app(CartService::class);
        $sessionId = $request->session()->getId();
        $user = $request->user();
        $productId = $validated['product_id'];

        if ($user) {
            // login olmuşsa user cart üzerinden toggle
            $cart = $cartService->getUserCart($user);
            $item = $cart->cartItems()->where('product_id', $productId)->first();
            if ($item) {
                $item->delete();
            } else {
                $product = Product::findOrFail($productId);
                $cart->cartItems()->create([
                    'product_id' => $productId,
                    'quantity' => 1,
                ]);
            }
        } else {
            // guest toggle cache'te
            $cartService->addOrToggleGuestItem($sessionId, $productId);
        }

        return $this->show($request);
    }

}

