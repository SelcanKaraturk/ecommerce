<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CartProductResources extends JsonResource
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
            'stock_number' => $this->id,
            'product_number' => $this->product_id,
            'color'=>$this->color,
            'size'=>$this->size,
            'stock'=>$this->stock,
            'quantity' => 1,
            'product_name' => $this->product->name,
            'product_slug' => $this->product->slug,
            'product_content' => $this->product->content,
            'product_price' => $this->product->price,
            'product_images' => $this->product->images,
            'category_slug' => $this->product->category?->slug
        ];
    }
}
