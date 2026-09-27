<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\HomeResources;
use App\Http\Resources\ProductResources;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        // $productsDi = Product::whereRelation("category", "parent_id", 1)->with(['stock','groupedStock'])
        //     ->latest()->take(12)->get();
        $productsDi = Product::whereRelation('categories', 'category_id', 11)
            ->with(['stock', 'categories:id,slug', 'inventory'])
            ->latest()
            ->take(12)
            ->get()
            ->map(function ($product) {
                $product->groupedStockById = $product->stock->groupBy('product_id');
                return $product;
            });
        $menu = Category::whereNull('parent_id')->take(3)->get();
        $productsGold = Product::whereRelation('categories', 'category_id', 2)
            ->latest()
            ->take(12)
            ->get();
        // $categoryDi = Category::find(1)->children()->with("products")->get();
        // return response()->json(['data'=>HomeResources::collection($productsDi)]);
        return response()->json(data: [
            'productsDi' => HomeResources::collection($productsDi),
            // 'productsGold' => ProductResources::collection($productsGold),
            // 'categoryDi' => $categoryDi,
            'menu' => $menu,
            $request->bearerToken()
        ]);
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    private function getAllCategoryIds($category)
    {
        $ids = [$category->id];
        foreach ($category->children as $child) {
            $ids = array_merge($ids, $this->getAllCategoryIds($child));
        }
        return $ids;
    }

    private function isCollectionCategory(Category $category): bool
    {
        if ((int) $category->id === 4) {
            return true;
        }

        $parent = $category->parent;
        while ($parent) {
            if ((int) $parent->id === 4) {
                return true;
            }

            $parent = $parent->parent;
        }

        return false;
    }

    private function withWishlistForUser(array $with, $user): array
    {
        if ($user) {
            $with['wishlistedBy'] = function ($q) use ($user) {
                $q->where('user_id', $user->id);
            };
        }

        return $with;
    }

    /**
     * Display the specified resource.
     *
     * @param  \Illuminate\Http\Request  $request
     */
    public function show(Request $request, $lang, $category, $slug = null)
    {
        $user = auth('sanctum')->user();

        if (!$slug) {
            $categoryModel = Category::where('slug', $category)->with('children')->firstOrFail();
            $categoryIds = $this->getAllCategoryIds($categoryModel);

            // Bu kategorilere ait ürünleri çek
            $with = $this->withWishlistForUser(['categories', 'stock', 'inventory'], $user);

            $categoryProductsQuery = Product::whereHas('categories', function ($q) use ($categoryIds) {
                $q->whereIn('categories.id', $categoryIds);
            })->with($with);

            if ($request->filled('size')) {
                $size = $request->query('size');
                $categoryProductsQuery->where(function ($query) use ($size) {
                    $query->whereHas('stock', function ($q) use ($size) {
                        $q->where('size', $size);
                    })->orWhere('allow_out_of_stock_cart', 1);
                });
            }
            if ($request->filled('materials')) {
                $materials = $request->query('materials');
                if (!is_array($materials)) {
                    $materials = array_filter(explode(',', (string) $materials));
                }

                if (!empty($materials)) {
                    $categoryProductsQuery->whereHas('stock', function ($q) use ($materials) {
                        $q->whereIn('color', $materials);
                    });
                }
            }
            $categoryProducts = $categoryProductsQuery->get();

            $productResources = ProductResources::collection($categoryProducts);
            $resolvedProducts = collect($productResources->resolve($request));

            if ($request->filled('price_min') && $request->filled('price_max')) {
                $priceMin = (float) $request->query('price_min');
                $priceMax = (float) $request->query('price_max');

                $matchingIndexes = $resolvedProducts
                    ->filter(function ($product) use ($priceMin, $priceMax) {
                        $calculatedPrice = $product['calculated_price'] ?? null;

                        return $calculatedPrice !== null
                            && $calculatedPrice >= $priceMin
                            && $calculatedPrice <= $priceMax;
                    })
                    ->keys()
                    ->all();

                $categoryProducts = $categoryProducts
                    ->filter(fn ($product, $index) => in_array($index, $matchingIndexes, true));
            }

            if ($request->filled('sort')) {
                $sortOption = $request->query('sort');

                if ($sortOption === '1') {
                    $categoryProducts = $categoryProducts->sortByDesc('created_at')->values();
                } elseif (in_array($sortOption, ['2', '3'], true)) {
                    $descending = $sortOption === '3';
                    $categoryProducts = $categoryProducts
                        ->sortBy(function ($product, $index) use ($resolvedProducts) {
                            return $resolvedProducts->get($index)['calculated_price'] ?? PHP_INT_MAX;
                        }, SORT_NUMERIC, $descending)
                        ->values();
                }
            }

            $subCategories = $categoryModel->children->map(function ($child) {
                return [
                    'slug' => $child->slug,
                    'name' => $child->name,
                ];
            })->values();

            // Eğer subCategories boşsa, parent kategorileri bul
            $parentCategories = collect();
            // if ($subCategories->isEmpty()) {
            $parent = $categoryModel->parent;
            while ($parent) {
                $parentCategories->push([
                    'slug' => $parent->slug,
                    'name' => $parent->name,
                ]);
                $parent = $parent->parent;
            }
            // }

            $productResources = ProductResources::collection($categoryProducts);
            $resolvedProducts = collect($productResources->resolve($request));

            // Min ve max fiyatı resource'tan gelen hesaplanmis fiyata gore hesapla
            $prices = $resolvedProducts
                ->pluck('calculated_price')
                ->filter(fn ($price) => !is_null($price));
            $minPrice = $prices->min() ?? 0;
            $maxPrice = $prices->max() ?? 0;
            $categories = collect();

            if ($subCategories->isEmpty()) {
                if ($this->isCollectionCategory($categoryModel)) {
                    $categories = Category::where('parent_id', $categoryModel->parent->id)
                        ->select('name', 'slug')
                        ->get();
                } else {
                    $categories = Category::whereNull('parent_id')
                        ->select('name', 'slug')
                        ->take(3)
                        ->get();
                }
            }

            return response()->json([
                'ana_kategori' => $categoryModel,
                'is_collection_category' => $this->isCollectionCategory($categoryModel),
                'sub_categories' => $subCategories,
                'products' => $productResources,
                'parent_categories' => $parentCategories->reverse()->values(),
                'min_price' => $minPrice,
                'max_price' => $maxPrice,
                'categories' => $categories,
            ]);
        } else {
            $with = $this->withWishlistForUser(['stock', 'groupedStock', 'inventory'], $user);

            $product = Product::where('slug', $slug)
                ->with($with)
                ->firstOrFail();

            return response()->json(['data' => new ProductResources($product), 'status' => 'success']);
        }
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
}
