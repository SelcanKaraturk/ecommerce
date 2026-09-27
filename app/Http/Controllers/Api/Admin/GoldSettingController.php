<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\GoldSetting;
use Illuminate\Http\Request;

class GoldSettingController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => GoldSetting::query()->orderBy('karat')->get(),
        ]);
    }

    public function sync(Request $request)
    {
        $payload = $request->input('settings', []);

        if (!is_array($payload)) {
            return response()->json(['message' => 'Geçersiz veri'], 422);
        }

        foreach ($payload as $item) {
            if (!isset($item['karat'])) {
                continue;
            }

            GoldSetting::updateOrCreate(
                ['karat' => (int) $item['karat']],
                [
                    'milyem' => isset($item['milyem'])
                        ? (float) $item['milyem']
                        : (float) (((float) ($item['min_milyem'] ?? 0) + (float) ($item['max_milyem'] ?? 0)) / 2),
                ]
            );
        }

        return response()->json([
            'message' => 'Altın ayarları güncellendi.',
            'data' => GoldSetting::query()->orderBy('karat')->get(),
        ]);
    }
}
