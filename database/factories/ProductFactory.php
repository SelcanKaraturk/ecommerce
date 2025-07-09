<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $name = $this->faker->word;
        return [
            'name' => $name,
            'slug' => Str::slug($name).'-'. Str::random(5),
            'category_id' => $this->faker->numberBetween(1, 10),
            'content' => $this->faker->paragraph,
            'price' => $this->faker->randomFloat(2, 1000, 100000), // 1000 ile 100000 TL arası
            'images' => [
                $this->faker->imageUrl(640, 480, 'products', true),
                $this->faker->imageUrl(640, 480, 'products', true)
            ],
        ];
    }
}
