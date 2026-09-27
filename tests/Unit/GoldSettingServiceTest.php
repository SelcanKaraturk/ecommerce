<?php

namespace Tests\Unit;

use App\Models\GoldSetting;
use App\Services\GoldSettingService;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class GoldSettingServiceTest extends TestCase
{
    public function test_it_calculates_price_from_configured_milyem_range(): void
    {
        Schema::dropIfExists('gold_settings');
        Schema::create('gold_settings', function ($table) {
            $table->id();
            $table->unsignedTinyInteger('karat')->unique();
            $table->decimal('min_milyem', 10, 2)->default(0);
            $table->decimal('max_milyem', 10, 2)->default(0);
            $table->timestamps();
        });

        GoldSetting::create([
            'karat' => 18,
            'min_milyem' => 700,
            'max_milyem' => 800,
        ]);

        $service = app(GoldSettingService::class);

        $this->assertSame(750.0, $service->calculatePrice(10, 100, 18));
    }
}
