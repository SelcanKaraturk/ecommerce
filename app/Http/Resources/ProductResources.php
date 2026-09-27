<?php

namespace App\Http\Resources;

use App\Services\GoldRateService;
use App\Services\GoldSettingService;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResources extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $variants = $this->variants();
        $calculatedPriceData = $this->lowestCalculatedPrice($variants);

        return [
            'product_number' => (auth()->user() && auth()->user()->hasRole('admin')) ? $this->id : null,
            'product_name' => $this->name,
            'product_slug' => $this->slug,
            'product_images' => $this->images,
            'product_content' => $this->content,
            'product_discount' => $this->discount,
            'categories' => $this->categories,
            'variants' => $variants,
            'inventory_carat' => $this->inventory?->carat,
            'inventory_clarity' => $this->inventory?->clarity,
            'inventory_color_of_diamond' => $this->inventory?->color_of_diamond,
            'inventory_cut' => $this->inventory?->cut,
            'gold_rate' => $this->getGoldRate(),
            'total_stock' => $this->stock_sum_stock ?? $this->stock->sum('stock') ?? 0,
            'allow_out_of_stock_cart' => $this->allow_out_of_stock_cart,
            'in_wishlist' => auth('sanctum')->check() ? (
                $this->relationLoaded('wishlistedBy') 
                    ? $this->wishlistedBy->contains('user_id', auth()->id())
                    : $this->wishlistedBy()->where('user_id', auth()->id())->exists()
            ) : false,
            'grouped_stock_by_color' => $this->groupStockByColor(),
            'is_new' => $this->created_at && $this->created_at->gt(now()->subDays(15)),
        ];
    }

     protected function groupStockByColor()
     {
         if (!$this->relationLoaded('stock')) {
             return [];
         }

         return $this->stock
             ->groupBy('color')
             ->map(function ($items, $color) {
                 return [
                     'color' => $color
                 ];
             })
             ->values();
     }
    protected function getGoldRate(): array
    {
        return app(GoldRateService::class)->getRate();
    }

    protected function calculateVariantPrice($weight): ?array
    {
        $rawCarat = $this->inventory?->carat;

        $karat = is_numeric($rawCarat)
            ? (int) $rawCarat
            : (int) preg_replace('/\D+/', '', (string) $rawCarat);

        return app(GoldSettingService::class)->calculatePrice(
            weight: $weight,
            karat: $karat,
            discount: is_null($this->discount) ? null : (float) $this->discount,
            precision: 0
        );
    }

    protected function lowestCalculatedPrice($variants): ?array
    {
        return collect($variants)
            ->filter(fn ($variant) => $variant['calculated_price'] !== null)
            ->sortBy('calculated_price')
            ->first();
    }

    protected function variants()
    {
        if (!$this->relationLoaded('stock')) {
            return [];
        }

        return $this
            ->stock
            ->map(function ($item) {
                return [
                    // 'stock_number' => $item->id,
                    'color' => $item->color,
                    'size' => $item->size,
                    'quantity' => $item->stock,
                    'weight' => $item->weight,
                    'calculated_price' => ($price = $this->calculateVariantPrice($item->weight))['price'] ?? null,
                    'calculated_price_without_discount' => $price['price_without_discount'] ?? null,
                ];
            })
            ->values();
    }

    public function discounted_price()
    {
        return $this->discount ? $this->price - ($this->price * $this->discount / 100) : $this->price;
    
    }
}
