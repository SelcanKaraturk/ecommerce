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
        return [
            'product_number' => $this->id,
            'product_name' => $this->name,
            'product_images'=>$this->images,
            'category_slug' => $this->category?->slug,
            'product_price' => $this->price,
            'product_pre_price' => $this->pivot?->price,
            'stock_number' => $this->pivot?->product_stock_id,
            'color' => $this->pivot?->productStock?->color,
            'in_cart' => isset($this->in_carts_exists) ? (bool)$this->in_carts_exists : false,
        ];
    }
}
