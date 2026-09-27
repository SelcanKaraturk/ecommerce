<?php

namespace App\Console\Commands;

use App\Services\GoldRateService;
use Illuminate\Console\Command;

class FetchGoldRate extends Command
{
    protected $signature = 'gold-rate:fetch';
    protected $description = 'Fetch the latest gold rate from external API and cache it for 45 minutes.';

    public function handle(GoldRateService $goldRateService)
    {
        $rate = $goldRateService->fetchAndCacheRate();

        if (empty($rate)) {
            $this->error('Gold rate fetch failed or returned no data.');
            return 1;
        }

        $this->info('Gold rate cached successfully.');
        return 0;
    }
}
