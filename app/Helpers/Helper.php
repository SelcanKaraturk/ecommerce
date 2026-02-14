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
            // Geçerli item’ları filtrele
            $cart = array_values(array_filter(array_map(function ($item) {
                if (!is_array($item) || !isset($item['product_slug'], $item['product_stock_number'])) {
                    return null;
                }

                $stockIdInt = filter_var($item['product_stock_number'], FILTER_VALIDATE_INT);
                $stockIdStr = is_string($item['product_stock_number']) ? $item['product_stock_number'] : '';

                // int id veya nostock_ ile başlayan id kabul edilir
                if ($stockIdInt === false && strpos($stockIdStr, 'nostock_') !== 0) {
                    return null;
                }

                return [
                    'product_stock_number' => $item['product_stock_number'],
                    'delivery_days' => $item['delivery_days'] ?? null,
                    'color' => $item['color'] ?? null,
                    'size' => $item['size'] ?? null,
                    'quantity' => $item['quantity'] ?? 1,
                    'product_name' => $item['product_name'] ?? null,
                    'product_slug' => $item['product_slug'] ?? null,
                    'product_images' => $item['product_images'] ?? [],
                    'product_price' => $item['product_price'] ?? null,
                    'product_discount' => $item['product_discount'] ?? null,
                    'stock' => $item['stock'] ?? 0,
                    'stock_status' => $item['stock_status'] ?? 'no_stock',
                    'allow_out_of_stock_cart' => $item['allow_out_of_stock_cart'] ?? false,
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
