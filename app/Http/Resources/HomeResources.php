<?php

namespace App\Http\Resources;

use App\Services\GoldSettingService;
use Illuminate\Http\Resources\Json\JsonResource;

class HomeResources extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $calculatedPriceData = $this->calculateCalculatedPrice();

        return [
            'product_number' => (auth()->user() && auth()->user()->hasRole('admin')) ? $this->id : null,
            'product_name' => $this->name,
            'product_slug' => $this->slug,
            'product_images' => $this->images,
            'product_content' => $this->content,
            'product_price' => $this->price,
            'calculated_price' => $calculatedPriceData['price'] ?? null,
            'category_slug' =>  $this->categories->pluck('slug'),
            'grouped_stock_by_id' => $this->groupedStockById()->first(),
            'last_stock_update' => $this->stock->max('updated_at'),
            'allow_out_of_stock_cart' => $this->allow_out_of_stock_cart,
        ];
    }

    protected function calculateCalculatedPrice(): ?array
    {
        $karat = (int) ($this->inventory?->carat ?? 0);

        return $this->stock
            ->map(fn ($stock) => app(GoldSettingService::class)->calculatePrice(
                weight: $stock->weight,
                karat: $karat,
                precision: 2
            ))
            ->filter()
            ->sortBy('price')
            ->first();
    }
}
