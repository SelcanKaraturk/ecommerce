<?php

namespace App\Http\Resources;

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
        return [
            'product_number' => $this->id,
            'product_name' => $this->name,
            'product_slug' => $this->slug,
            'product_images' => $this->images,
            'product_content' => $this->content,
            'product_price' => $this->price,
            'category_slug' => $this->category->slug,
            'grouped_stock_by_color' => $this->groupStockByColor(),
            'product_stock' => $this->stock->map(function ($stock) {
                return [
                    'stock_number' => $stock->id,
                    'product_number' => $stock->product_id,
                    'color' => $stock->color,
                    'size' => $stock->size,
                    'stock' => $stock->stock,
                    'in_wishlist' => isset($stock->in_wishlist_exists) ? (bool) $stock->in_wishlist_exists : false,
                ];
            }),
            // 'in_cart' => isset($this->in_carts_exists) ? (bool) $this->in_carts_exists : false,
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
}
