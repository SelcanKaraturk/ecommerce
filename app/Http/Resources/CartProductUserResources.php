<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CartProductUserResources extends JsonResource
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
            'allow_out_of_stock_cart' => $this->product->allow_out_of_stock_cart,
            'color' => $this->color,
            'delivery_days' => $this->productStock?->stock > 0 ? null : 10,
            'product_discount' => $this->product->discount,
            'product_images' => $this->product->images,
            'product_name' => $this->product->name,
            'product_price' => $this->product->price,
            'product_slug' => $this->product->slug,
            'product_stock_number' => $this->product_stock_id,
            'quantity' => $this->quantity,
            'size' => $this->size,
            'stock' => $this->productStock?->stock ? $this->productStock->stock : 0,
            'stock_status' => $this->productStock?->stock > 0 ? 'in_stock' : 'no_stock'
        ];
    }
}
