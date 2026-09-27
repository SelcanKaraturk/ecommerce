<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class WishProductResources extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
       public function toArray($request)
    {
        $firstCategory = $this->categories?->first();

        return [
            
            'slug' => $this->slug,
            'name' => $this->name,
            'images' => $this->images,
            'category' => $firstCategory ? [
                'slug' => $firstCategory->slug,
                'name' => $firstCategory->name,
            ] : null,
            'price' => $this->price,
            'discount' => $this->discount,
            'discounted_price' => $this->discounted_price(),
            'pre_price' => $this->pivot?->price,
            'stock_color' => $this->stock?->first()?->color,
            'in_carts_exists' => isset($this->in_carts_exists) ? (bool) $this->in_carts_exists : false,
        ];
    }

    public function discounted_price()
    {
        return $this->discount ? $this->price - ($this->price * $this->discount / 100) : $this->price;
    
    }
}
