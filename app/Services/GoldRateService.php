<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class GoldRateService
{
    protected string $cacheKey = 'gold_rate_altintry';
    protected int $cacheTtlMinutes = 45;

    public function getRate(): array
    {
        return Cache::get($this->cacheKey, []);
    }

    public function fetchAndCacheRate(): array
    {
        $url = config('services.gold_rate.url');
        $host = config('services.gold_rate.host');
        $key = config('services.gold_rate.key');

        if (!$url || !$host || !$key) {
            return [];
        }

        $response = Http::withHeaders([
            'X-RapidAPI-Host' => $host,
            'X-RapidAPI-Key' => $key,
        ])->get($url);

        if (!$response->successful()) {
            return [];
        }

        $payload = $response->json();
        if (!isset($payload['data']) || !is_array($payload['data'])) {
            return [];
        }

        $rate = [];
        foreach ($payload['data'] as $item) {
            if (isset($item['currencyCode']) && $item['currencyCode'] === 'altintry') {
                $rate = [
                    'buy' => $item['buy'] ?? null,
                    'sell' => $item['sell'] ?? null,
                    'changeRate' => $item['changeRate'] ?? null,
                    'dayHigh' => $item['dayHigh'] ?? null,
                    'dayLow' => $item['dayLow'] ?? null,
                    'prevClose' => $item['prevClose'] ?? null,
                    'updated_at' => now()->toDateTimeString(),
                ];
                break;
            }
        }

        if (!empty($rate)) {
            Cache::put($this->cacheKey, $rate, now()->addMinutes($this->cacheTtlMinutes));
        }

        return $rate;
    }
}
