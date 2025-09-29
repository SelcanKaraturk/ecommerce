<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;
class CategoryResources extends JsonResource
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
            'name' => $this->name,
            'slug' => $this->slug,
            'images' => collect($this->images)->map(function ($img) {
                return str_starts_with($img, 'http')
                    ? $img
                    : url(Storage::url($img));
            }),
            'parent_slug' => $this->parent?->slug, // parent olmayabilir
            'children' => CategoryResources::collection($this->whenLoaded('children')),

        ];
    }
}
