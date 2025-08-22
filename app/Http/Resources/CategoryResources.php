<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

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
            'images' => $this->images,
            'parent_slug' => $this->parent->slug,
            'children' => $this->children->map(function ($child) {
                return [
                    'name' => $child->name,
                    'slug' => $child->slug,
                    'images' => $child->images,
                ];
            }),

        ];
    }
}
