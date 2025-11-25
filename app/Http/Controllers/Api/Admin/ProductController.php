<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResources;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
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
        $products = Product::with(['categories:id,slug,name','stock:product_id,color'])->withSum('stock', 'stock')->get();
        //return response()->json($products);
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
    public function store(Request $request)
    {
        // parent_slug'u normalize et (array veya string olabilir)
        $parentSlugInput = $request->input('parent_slug');
        if (is_array($parentSlugInput)) {
            $parentSlugString = implode(',', $parentSlugInput);
        } else {
            $parentSlugString = $parentSlugInput;
        }
        $request->merge(['parent_slug' => $parentSlugString]);

        $validated = $request->validate([
            'name' => 'required|string|max:255|min:3',
            'content' => 'required|string',
            'parent_slug' => 'required|string',
            'price' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0|max:100',
            'color' => 'required|string|max:255',
            'size' => 'nullable|string|max:255',
            'quantity' => 'required|integer|min:0',
            'variants' => 'nullable|string|json',
            'images' => 'nullable|array',
            'images.*' => 'file|image|mimes:jpeg,jpg,png,gif,webp|max:5120',
        ]);

        // parent_slug kontrolü - kategori slug'larının geçerliliğini kontrol et
        $parentSlugs = array_filter(array_map('trim', explode(',', $validated['parent_slug'])));

        if (empty($parentSlugs)) {
            return response()->json([
                'message' => 'Geçersiz kategori seçimi.',
                'errors' => 'En az bir kategori seçilmelidir.'
            ], 422);
        }

        $existingCategories = Category::whereIn('slug', $parentSlugs)->pluck('slug')->toArray();
        $invalidSlugs = array_diff($parentSlugs, $existingCategories);

        if (!empty($invalidSlugs)) {
            return response()->json([
                'message' => 'Geçersiz kategori seçimi.',
                'errors' => 'Seçilen kategorilerden bazıları geçersiz: ' . implode(', ', $invalidSlugs)
            ], 422);
        }

        // Variants JSON kontrolü ve parse
        $variants = [];
        if (!empty($validated['variants'])) {
            $decodedVariants = json_decode($validated['variants'], true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                return response()->json([
                    'message' => 'Varyant verisi geçersiz JSON formatında.',
                    'errors' => 'Varyantlar geçerli bir JSON formatında olmalıdır.'
                ], 422);
            }
            $variants = $decodedVariants;

            // Variants içindeki her bir varyant için validasyon
            foreach ($variants as $index => $variant) {
                if (!isset($variant['color']) || empty($variant['color'])) {
                    return response()->json([
                        'message' => 'Varyant verisi geçersiz.',
                        'errors' => "Varyant #{$index}: Renk gereklidir."
                    ], 422);
                }
                if (isset($variant['quantity']) && (!is_numeric($variant['quantity']) || $variant['quantity'] < 0)) {
                    return response()->json([
                        'message' => 'Varyant verisi geçersiz.',
                        'errors' =>"Varyant #{$index}: Adet geçerli bir sayı olmalıdır (0 veya daha büyük)."
                    ], 422);
                }
            }
        }

         DB::transaction(function () use ($request, $validated, $parentSlugs, $variants) {

            $product = Product::where('slug', Str::slug($validated['name']))->first();
            // Slug kontrolü ve üretimi
            if (!isset($product)) {
                $newSlug = Str::slug($validated['name']);
            } else {
                $baseSlug = Str::slug($validated['name']);
                $newSlug = $baseSlug;
                $counter = 1;
                while (
                    Product::where('slug', $newSlug)
                        ->exists()
                ) {
                    $newSlug = $baseSlug . '-' . $counter++;
                }
            }
            $allImages = [];
            // Yeni yüklenen dosyaları işle
            if ($request->hasFile('images')) {
                foreach ((array) $request->file('images') as $img) {
                    if ($img instanceof \Illuminate\Http\UploadedFile) {
                        $path = $img->store('categories', 'public');
                        $allImages[] = 'categories/' . basename($path);
                    }
                }
            }

            $newProduct = Product::create([
                'name' => $validated['name'],
                'slug' => $newSlug,
                'content' => $validated['content'],
                'price' => $validated['price'],
                'discount' => $validated['discount'] ?? null,
                'images' => $allImages,
            ]);

            $categoryIds = Category::whereIn('slug', $parentSlugs)->pluck('id');
            $newProduct->categories()->attach($categoryIds);

            // Ana stok bilgisi ekle
            $newProduct->stock()->create([
                'color' => $validated['color'],
                'size' => $validated['size'] ?? null,
                'stock' => $validated['quantity'],
            ]);

            // Ek varyantlar varsa stok bilgisi ekle
            if (!empty($variants)) {
                foreach ($variants as $variant) {
                    $newProduct->stock()->create([
                        'color' => $variant['color'],
                        'size' => $variant['size'] ?? "other",
                        'stock' => $variant['quantity'] ?? 0,
                    ]);
                }
            }
        });

        return response()->json([
            'message' => 'Ürün başarıyla eklendi',
            'status' => 'success',
            'data' => $this->indexData($request->bearerToken())
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
    public function update(Request $request, $id)
    {
        //
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
}
