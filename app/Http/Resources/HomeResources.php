<?php

namespace App\Http\Resources;

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
        return [
            'product_number' => $this->id,
            'product_name' => $this->name,
            'product_slug' => $this->slug,
            'product_images' => $this->images,
            'product_content' => $this->content,
            'product_price' => $this->price,
            'category_slug' => $this->category->slug,
            'grouped_stock_by_id' => $this->groupedStockById()->first(),
            'last_stock_update' => $this->stock->max('updated_at'),
        ];
    }
}
