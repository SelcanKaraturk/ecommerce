<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResources;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Http\Requests\Admin\StoreProductRequest;
use Illuminate\Support\Facades\DB;
class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $products = Product::with(['categories:id,slug,name','stock'])->withSum('stock', 'stock')->orderByDesc('id')->get();
        //return response()->json(['data'=>ProductResources::collection($products), 'user'=>auth()->user()->hasRole('admin')]);
        return response()->json(ProductResources::collection($products));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreProductRequest $request)
    {
        $validated = $request->validated();

        //return response()->json(['data' => $request->all()]);

        $parentSlugs = $validated['parent_slug'] ?? [];
        if (!is_array($parentSlugs)) {
            $parentSlugs = array_filter(array_map('trim', explode(',', (string)$parentSlugs)));
        }

        // category slug doğrulama
        if (!empty($parentSlugs)) {
            $existingCategories = Category::whereIn('slug', $parentSlugs)->pluck('slug')->toArray();
            $invalidSlugs = array_values(array_diff($parentSlugs, $existingCategories));

            if (!empty($invalidSlugs)) {
                return response()->json([
                    'message' => 'Geçersiz kategori seçimi.',
                    'errors' => ['parent_slug' => $invalidSlugs]
                ], 422);
            }
        }

          // variants JSON parse ve validasyon
        $variants = [];
        if (!empty($validated['variants'])) {
            $decoded = json_decode($validated['variants'], true);
            if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
                return response()->json([
                    'message' => 'Varyant verisi geçersiz JSON formatında.',
                    'errors' => ['variants' => ['Varyantlar geçerli bir JSON formatında olmalıdır.']]
                ], 422);
            }

            foreach ($decoded as $index => $v) {
                // normalize keys
                $color = isset($v['color']) ? trim((string)$v['color']) : '';
                $quantity = $v['quantity'] ?? null;
                $size = $v['size'] ?? null;

                if ($color === '') {
                    return response()->json([
                        'message' => 'Varyant verisi geçersiz.',
                        'errors' => ['variants' => ["Varyant #{$index}: Renk gereklidir."]]
                    ], 422);
                }

                if ($quantity === null || $quantity === '' || !is_numeric($quantity) || $quantity < 0) {
                    return response()->json([
                        'message' => 'Varyant verisi geçersiz.',
                        'errors' => ['variants' => ["Varyant #{$index}: Adet geçerli bir sayı olmalıdır (0 veya daha büyük)."]]
                    ], 422);
                }

                $variants[] = [
                    'color' => $color,
                    'size' => $size === null ? null : (string)$size,
                    'quantity' => (int)$quantity,
                ];
            }
        }
        $newProduct = null;
            try {
         DB::transaction(function () use ($request, $validated, $parentSlugs, $variants, &$newProduct) {

            $baseSlug = Str::slug($validated['name']);
            $newSlug = $baseSlug;
            $counter = 1;
            while (Product::where('slug', $newSlug)->exists()) {
                $newSlug = $baseSlug . '-' . $counter++;
            }

            $allImages = [];
            // Yeni yüklenen dosyaları işle
            if ($request->hasFile('images')) {
                foreach ((array) $request->file('images') as $img) {
                    if ($img->isValid()) {
                        $path = $img->store('products', 'public');
                        $allImages[] = $path;
                    }
                }
            }

            $newProduct = Product::create([
                'name' => $validated['name'],
                'slug' => $newSlug,
                'content' => $validated['content'] ?? null,
                'price' => $validated['price'],
                'discount' => $validated['discount'] ?? null,
                'images' => $allImages,
            ]);

            // kategorileri ilişkilendir
            if (!empty($parentSlugs)) {
                $categoryIds = Category::whereIn('slug', $parentSlugs)->pluck('id')->toArray();
                if (!empty($categoryIds)) {
                    $newProduct->categories()->attach($categoryIds);
                }
            }

            // Ek varyantlar varsa stok bilgisi ekle
            
            if (!empty($variants)) {
                foreach ($variants as $variant) {
                    $sku = $this->generateSku($newProduct, $request['selected_category'], $variant['color'], $variant['size']);
                    $newProduct->stock()->create([
                        'color' => $variant['color'],
                        'size' => $variant['size'] ?? null,
                        'stock' => $variant['quantity'],
                        'sku' => $sku,
                    ]);
                }
            }
        });
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Ürün oluşturulurken hata oluştu.',
                'errors' => ['exception' => $e->getMessage()]
            ], 500);
        }
        $newProduct->load(['categories:id,slug,name', 'stock:product_id,color'])->loadSum('stock', 'stock');
        return response()->json([
            'message' => 'Ürün başarıyla eklendi',
            'status' => 'success',
            'data' => new ProductResources($newProduct)
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(StoreProductRequest $request, $id)
    {
    	$product = Product::with(['categories', 'stock'])->findOrFail($id);
        //return response()->json(['data' => $request->file('images')[0]->getClientOriginalName(), 'images' => $request->get('images')   ]);
        
        // Validasyon (store ile aynı kurallar)
        $validated = app(\App\Http\Requests\Admin\StoreProductRequest::class)->validateResolved();
        $validated = $request->validate((new \App\Http\Requests\Admin\StoreProductRequest)->rules());
        

        $parentSlugs = $validated['parent_slug'] ?? [];
        if (!is_array($parentSlugs)) {
            $parentSlugs = array_filter(array_map('trim', explode(',', (string)$parentSlugs)));
        }

        // Kategori doğrulama
        if (!empty($parentSlugs)) {
            $existingCategories = Category::whereIn('slug', $parentSlugs)->pluck('slug')->toArray();
            $invalidSlugs = array_values(array_diff($parentSlugs, $existingCategories));
            if (!empty($invalidSlugs)) {
                return response()->json([
                    'message' => 'Geçersiz kategori seçimi.',
                    'errors' => ['parent_slug' => $invalidSlugs]
                ], 422);
            }
        }
        // Varyant işlemleri
        $variants = [];
        if (!empty($validated['variants'])) {
            $decoded = json_decode($validated['variants'], true);
            if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
                return response()->json([
                    'message' => 'Varyant verisi geçersiz JSON formatında.',
                    'errors' => ['variants' => ['Varyantlar geçerli bir JSON formatında olmalıdır.']]
                ], 422);
            }
            foreach ($decoded as $index => $v) {
                $color = isset($v['color']) ? trim((string)$v['color']) : '';
                $quantity = $v['quantity'] ?? null;
                $size = $v['size'] ?? null;
                if ($color === '') {
                    return response()->json([
                        'message' => 'Varyant verisi geçersiz.',
                        'errors' => ['variants' => ["Varyant #{$index}: Renk gereklidir."]]
                    ], 422);
                }
                if ($quantity === null || $quantity === '' || !is_numeric($quantity) || $quantity < 0) {
                    return response()->json([
                        'message' => 'Varyant verisi geçersiz.',
                        'errors' => ['variants' => ["Varyant #{$index}: Adet geçerli bir sayı olmalıdır (0 veya daha büyük)."]]
                    ], 422);
                }
                $variants[] = [
                    'color' => $color,
                    'size' => $size === null ? null : (string)$size,
                    'quantity' => (int)$quantity,
                ];
            }
        }


        try {
            DB::transaction(function () use ($request, $validated, $parentSlugs, $variants, &$product) {
                // Slug güncelleme (isim değişirse)
                $baseSlug = Str::slug($validated['name']);
                $newSlug = $baseSlug;
                $counter = 1;
                while (Product::where('slug', $newSlug)->where('id', '!=', $product->id)->exists()) {
                    $newSlug = $baseSlug . '-' . $counter++;
                }

                // Resim işlemleri: yeni yüklenenler + eskiler
                $allImages = $request->input('existing_images', []);
                if ($request->hasFile('images')) {
                    foreach ((array) $request->file('images') as $img) {
                        if ($img->isValid()) {
                            $path = $img->store('products', 'public');
                            $allImages[] = $path;
                        }
                    }
                }

                $product->update([
                    'name' => $validated['name'],
                    'slug' => $newSlug,
                    'content' => $validated['content'] ?? null,
                    'price' => $validated['price'],
                    'discount' => $validated['discount'] ?? null,
                    'images' => $allImages,
                ]);

                // Kategorileri güncelle
                if (!empty($parentSlugs)) {
                    $categoryIds = Category::whereIn('slug', $parentSlugs)->pluck('id')->toArray();
                    $product->categories()->sync($categoryIds);
                }

                // Varyantları/stokları güncelle: önce sil, sonra ekle (daha gelişmiş mantık eklenebilir)

                $data = collect($variants)->map(function ($variant) use ($request, $product) {
                    return [
                        'product_id' => $product->id,
                        'color' => $variant['color'],
                        'size' => $variant['size'] ?? null,
                        'stock' => $variant['quantity'],
                        'sku' => $this->generateSku(
                            $product,
                            $request['selected_category'],
                            $variant['color'],
                            $variant['size'] ?? null
                        ),
                        'created_at' => now(),
                        'updated_at' => now(),

                    ];
                })->toArray();
                
                $product->stock()->upsert(
                    $data,
                    ['product_id', 'color', 'size'], // UNIQUE alanlar
                    ['stock', 'updated_at']   // güncellenecek kolonlar
                );
                // Güncel varyant anahtarlarını bul
                //$variantKeys = collect($variants)->map(fn($v) => $v['color'].'|'.$v['size'])->toArray();
                $variantKeys = collect($variants)->map(function ($v) {
                        return $v['color'] . '|' . ($v['size'] ?? '');
                    })->toArray();
                // Eski varyantlardan silinenleri bul ve sil
                //$product->stock()->whereNotIn(DB::raw("CONCAT(color,'|',size)"), $variantKeys)->delete();
                $product->stock()
                ->whereNotIn(
                    DB::raw("CONCAT(color,'|',IFNULL(size,''))"),
                    $variantKeys
                )
                ->delete();
            });
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Ürün güncellenirken hata oluştu.',
                'errors' => ['exception' => $e->getMessage()]
            ], 500);
        }
        
        $product->load(['categories:id,slug,name', 'stock'])->loadSum('stock', 'stock');
        return response()->json([
            'message' => 'Ürün başarıyla güncellendi',
            'status' => 'success',
            'data' => new ProductResources($product)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function indexData($token)
    {
        $products = Product::with(['categories:id,name','stock:product_id,color'])->withSum('stock', 'stock')->get();
        //return response()->json($products);
         return ProductResources::collection($products);
    }

    private function generateSku($product, $categoryTitle, $color, $size = null)
    {
        $prefixes = [
            'Yüzük' => 'YZK',
            'Kolye' => 'KOL',
            'Bileklik' => 'BLK',
            'Bilezik' => 'BLZ',
            'Kelepçe' => 'KLP',
            'Küpe' => 'KPE',
            'Hiçbiri' => 'HCB',
        ];

        $colorCodes = [
            'Beyaz Altın' => 'BA',
            'Gold' => 'GO',
            'Rose' => 'RO',
        ];

        $prefix = $prefixes[$categoryTitle] ?? null;
        if (!$categoryTitle) {
            $existingSku = $product->stock()->first()->sku;
            $prefix = substr($existingSku, 0, 3);
        }

        
        $colorCode = $colorCodes[$color] ?? substr($color, 0, 2);
        $sizeStr = $size ? (string)$size : '';
        $idPadded = str_pad($product->id, 6, '0', STR_PAD_LEFT);

        return $prefix . $idPadded . $colorCode . $sizeStr;
    }
}
