<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResources;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Models\Product;
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
        $productsDi = Product::whereRelation("category", "parent_id", 1)
            ->latest()->take(12)->get();
        $productsGold = Product::whereRelation("category", "parent_id", 2)
            ->latest()->take(12)->get();
        $categoryDi = Category::find(1)->children()->with("products")->get();

        return response()->json(data: [
            'productsDi' => $productsDi,
            'productsGold' => $productsGold,
            'categoryDi' => $categoryDi,
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
    public function show($lang, $category, $slug)
    {
        if (!auth()->check()) {
            $product = Product::where("slug", $slug)
                ->with(['stock' => function ($query){
                     $query->withExists([
                            'wishlistedBy' => function ($q) {
                                $q->whereNull('user_id');
                            }
                        ]);
                }, 'groupedStock'])
                // ->addSelect(['in_carts_exists' => \DB::raw('false')])
                ->firstOrFail();
        } else {
            $product = Product::where("slug", $slug)
                ->with([
                    'stock' => function ($query) {
                        $query->withExists([
                            'wishlistedBy' => function ($q) {
                                $q->where('user_id', auth()->id());
                            }
                        ]);
                    },
                    'groupedStock',
                ])
                ->withExists([
                    'inCarts' => function ($q) {
                        $q->whereHas('cart', function ($cartQuery) {
                            $cartQuery->where('user_id', auth()->id());
                        });
                    }
                ])
                ->firstOrFail();
        }
        //dd($product);

        return response()->json(new ProductResources($product));
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
