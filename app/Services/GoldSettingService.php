<?php

namespace App\Services;

use App\Models\GoldSetting;
use App\Services\GoldRateService;

class GoldSettingService
{
    public function getSettings(): array
    {
        return GoldSetting::query()
            ->orderBy('karat')
            ->get()
            ->map(function (GoldSetting $setting) {
                return [
                    'karat' => (int) $setting->karat,
                    'milyem' => (float) $setting->milyem,
                ];
            })
            ->values()
            ->all();
    }

    public function getSettingByKarat(int $karat): ?array
    {
        $setting = GoldSetting::where('karat', $karat)->first();

        if (!$setting) {
            return null;
        }

        return [
            'karat' => (int) $setting->karat,
            'milyem' => (float) $setting->milyem,
        ];
    }

    public function calculatePrice(
        ?float $weight,
        int $karat,
        ?float $discount = null,
        int $precision = 0
    ): ?array
    {
        $goldRate = app(GoldRateService::class)->getRate();
        $goldPrice = isset($goldRate['sell']) ? (float) $goldRate['sell'] : null;

        if ($weight === null || $goldPrice === null || $weight <= 0 || $goldPrice <= 0) {
            return null;
        }

        if (!in_array($karat, [14, 18, 22], true)) {
            return null;
        }

        $setting = $this->getSettingByKarat($karat);

        if (!$setting) {
            return null;
        }

        $milyem = (float) ($setting['milyem'] ?? 0);
        if ($milyem <= 0) {
            return null;
        }

        $priceWithoutDiscount = (float) $weight * (float) $goldPrice * $milyem;
        $calculatedPrice = $priceWithoutDiscount;
        $hasDiscount = $discount !== null && $discount > 0;

        if ($hasDiscount) {
            $discountMultiplier = 1 - ($discount / 100);
            $calculatedPrice *= $discountMultiplier;
        }

        return [
            'price' => round($calculatedPrice, $precision),
            'price_without_discount' => $hasDiscount ? round($priceWithoutDiscount, $precision) : null,
        ];
    }
}
