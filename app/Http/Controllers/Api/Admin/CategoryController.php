<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResources;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $categories = Category::with([
            'children' => function ($q) {
                $q->whereColumn('id', '!=', 'parent_id');
            },
            'parent:id,slug'
        ])->get();
        return response()->json(['status' => 'success', 'categories' => CategoryResources::collection($categories)]);
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
    public function show($id)
    {
        $category = Category::where('parent_id', $id)
            ->with('children')
            ->get();
        return response()->json(['status' => 'success', 'category' => $category]);
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
    public function update(Request $request, $slug)
    {

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'parent_slug' => 'nullable|exists:categories,slug',
            'images.*' => 'nullable',
        ]);
        $category = Category::where('slug', $slug);
        $parent = Category::where('slug', $validated['parent_slug'])->firstOrFail();
        $allImages = $request->input('images');
        foreach ($request->allFiles() as $img) {
            // eğer dosya ise -> store et
            if ($img instanceof \Illuminate\Http\UploadedFile) {
                $path = $img->store('categories', 'public');
                $allImages[] = $path;
            }
        }

        $category->update([
            'name' => $validated['name'],
            'parent_id' => $parent->id ?? null,
            'images' => json_encode($allImages), // db'de json cast varsa direkt $allImages
        ]);

        return response()->json([
            'message' => 'Kategori başarıyla güncellendi',
            'status' => 'success',
            'data' => $category
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
}
