<?php

namespace App\Helpers;

use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Http\Request;

class Helper
{
    public static function getCartFromCookie(Request $request): array
    {
        $raw = $request->cookie('cart_items');

        if (!$raw) {
            return [];
        }

        try {
            $decrypted = decrypt($raw);
            // return $decrypted;
            // JSON ise decode et, array ise direkt al
            $decoded = is_array($decrypted) ? $decrypted : json_decode($decrypted, true);
            //return $decoded;
            if (!is_array($decoded)) {
                \Log::warning('Cart cookie format invalid after decode', ['decoded' => $decoded]);
                return [];
            }
            // Varyant artık product_stock_number yerine slug, color ve size ile belirlenir.
            $cart = array_values(array_filter(array_map(function ($item) {
                if (!is_array($item) || !isset($item['product_slug'], $item['color'], $item['size'])) {
                    return null;
                }

                return [
                    'color' => $item['color'] ?? null,
                    'size' => $item['size'] ?? null,
                    'quantity' => $item['quantity'] ?? 1,
                    'product_slug' => $item['product_slug'] ?? null,
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
}
