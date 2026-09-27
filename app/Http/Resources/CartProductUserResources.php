<?php

namespace App\Http\Resources;

use App\Services\GoldSettingService;
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
        $product = $this->product;
        $productStock = $product?->stock()
            ->where('color', $this->color)
            ->where('size', $this->size)
            ->first();

        $weight = $productStock?->weight;

        // Varyant bulunamadıysa (product_stock'a eklenmemiş) ve stok dışı üretime izin varsa,
        // weight bilgisi olan başka bir varyanttan gram/size oranıyla tahmini weight hesapla
        if ($weight === null && $product?->allow_out_of_stock_cart) {
            $weight = $this->estimateWeightFromVariant($product);
        }

        $price = $this->calculateVariantPrice($weight);
        $unitPrice = $price['price'] ?? null;

        return [
            'allow_out_of_stock_cart' => $product->allow_out_of_stock_cart,
            'color' => $this->color,
            'calculated_price' => $unitPrice,
            'calculated_price_without_discount' => $price['price_without_discount'] ?? null,
            'delivery_days' => $productStock?->stock > 0 ? null : 10,
            'line_total' => $unitPrice === null ? null : $unitPrice * $this->quantity,
            'product_discount' => $product->discount,
            'product_images' => $product->images,
            'product_name' => $product->name,
            'product_price' => $unitPrice,
            'product_slug' => $product->slug,
            'product_stock_number' => $this->product_stock_id,
            'quantity' => $this->quantity,
            'size' => $this->size,
            'stock' => $productStock?->stock ?? null,
            'stock_status' => $productStock?->stock > 0 ? 'in_stock' : 'no_stock'
        ];
    }

    protected function estimateWeightFromVariant($product): ?float
    {
        $requestedSize = is_numeric($this->size) ? (float) $this->size : null;

        if (!$requestedSize || $requestedSize <= 0) {
            return null;
        }

        $variants = $product->stock()
            ->where('weight', '>', 0)
            ->get(['color', 'size', 'weight'])
            ->filter(fn ($variant) => is_numeric($variant->size) && (float) $variant->size > 0);

        // Öncelik aynı renkteki varyantta, yoksa herhangi bir uygun varyant
        $reference = $variants->firstWhere('color', $this->color) ?? $variants->first();

        if (!$reference) {
            return null;
        }

        return ((float) $reference->weight / (float) $reference->size) * $requestedSize;
    }

    protected function calculateVariantPrice(?float $weight): ?array
    {
        $rawCarat = $this->product?->inventory?->carat;
        $karat = is_numeric($rawCarat)
            ? (int) $rawCarat
            : (int) preg_replace('/\D+/', '', (string) $rawCarat);

        return app(GoldSettingService::class)->calculatePrice(
            weight: $weight,
            karat: $karat,
            discount: is_null($this->product?->discount) ? null : (float) $this->product->discount,
            precision: 0
        );
    }
}
