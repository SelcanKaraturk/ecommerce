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
            ->with(['stock', 'categories:id,slug'])
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

    public function show($lang, $category, $slug = null)
    {
        $user = auth('sanctum')->user();

        // return response()->json(['data' => $user, 'category' => $category, 'slug' => $slug]);

        if (!$slug) {
            // $category parametresi slug ise:
            $categoryModel = Category::where('slug', $category)->with('children')->firstOrFail();
            if ($categoryModel->parent_id == null) {
                $altKategoriler = $categoryModel->children()->pluck('name');
            }else{
            $categoryIds = $this->getAllCategoryIds($categoryModel);

            // İlk eleman ana kategori, diğerleri alt kategoriler
            $altKategoriIds = array_slice($categoryIds, 1);
            if (empty($altKategoriIds)) {
                $parent = Category::whereIn('id', [$categoryIds[0]])->pluck('parent_id')->first();
                $child_ids = Category::where('parent_id', $parent)->pluck('id');
                $altKategoriler = Category::whereIn('id', $child_ids)->pluck('name');
            }else{
                $altKategoriler = Category::whereIn('id', $altKategoriIds)->pluck('name');
            }
            }
           

            // Bu kategorilere ait ürünleri çek
            $categoryProducts = Product::whereHas('categories', function ($q) use ($categoryIds) {
                $q->whereIn('categories.id', $categoryIds);
            })->with(['categories', 'stock'])->get();

            return response()->json([
                'ana_kategori' => $categoryModel->name,
                'sub_categories' => $altKategoriler,
                'products' => ProductResources::collection($categoryProducts)
            ]);
        }

        // if (!$user) {
        //     $product = Product::where('slug', $slug)
        //         ->with(['stock', 'groupedStock'])
        //         // ->addSelect(['in_carts_exists' => \DB::raw('false')])
        //         ->firstOrFail();
        //         $product['den'] = 'den';
        // } else {
        //     $product = Product::where('slug', $slug)
        //         ->with([
        //             'stock',
        //             'groupedStock',
        //             'wishlistedBy' => function ($q) {
        //                 $q->where('user_id', auth()->id());
        //             },
        //         ])

        //         ->firstOrFail();
        //         $product['deneme'] = 'deneme';
        // }
        // // dd($product);

        // //return response()->json(['data' => $product]);
        // return response()->json(['data' => new ProductResources($product)]);
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
