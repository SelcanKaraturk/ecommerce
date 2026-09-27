<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\GoldRateService;

class GoldRateController extends Controller
{
    public function index(GoldRateService $goldRateService)
    {
        $rate = $goldRateService->getRate();

        if (empty($rate)) {
            $rate = $goldRateService->fetchAndCacheRate();
        }

        return response()->json(['data' => $rate]);
    }
}
