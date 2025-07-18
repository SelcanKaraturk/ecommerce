<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        // $products = Product::with('category')
        // ->where('category_id',1)
        // ->latest()->take(12)->get();
        $productsDi = Product::whereRelation("category", "parent_id", 1)
            ->withExists([
                'wishlistedBy' => function ($q) {
                    $q->where('user_id', auth()->id());
                }
            ])->latest()->take(12)->get();
        $productsGold = Product::whereRelation("category", "parent_id", 2)
            ->latest()->take(12)->get();
        $categoryDi = Category::find(1)->children()->with("products")->get();
        //$categoryDi = Category::with('children.products')->find(1); //farklı olarak modelin kendisini de döndürür
        //dd($request->user());
        return response()->json(data: [
            'productsDi' => $productsDi,
            'productsGold' => $productsGold,
            'categoryDi' => $categoryDi
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
        $product = Product::where("slug", $slug)->firstOrFail();
        //dd($product);
        return response()->json($product);
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
