<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResources;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
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
            'children',
            'parent:id,slug'
        ])->get();
        return response()->json(['status' => 'success', 'categories' => CategoryResources::collection($categories)]);
        //return response()->json(['msg'=>$categories]);
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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'parent_slug' => 'nullable',
            'images' => 'nullable|array',
            'files.*' => 'nullable|file|image|max:5120', // yeni yüklenecek dosyalar
        ]);


        DB::transaction(function () use ($validated, $request) {

            $category = Category::where('slug', Str::slug($validated['name']))->first();
            // Slug kontrolü ve üretimi
            if (isset($category)) {
                $baseSlug = Str::slug($validated['name']);
                $newSlug = $baseSlug;
                $counter = 1;
                while (
                    Category::where('slug', $newSlug)
                        ->exists()
                ) {
                    $newSlug = $baseSlug . '-' . $counter++;
                }
            } else {
                $newSlug = Str::slug($validated['name']);
            }

            $parent = null;
            if (!empty($validated['parent_slug'])) {
                $parent = Category::where('slug', $validated['parent_slug'])->value('id');
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

           // Oluştur
            Category::create([
                'name' => $validated['name'],
                'slug' => $newSlug,
                'parent_id' => $parent ?? null,
                'images' => $allImages,
            ]);
       });
        //  return response()->json([
        //         'name' => $validated['name'],
        //         'slug' => $newSlug,
        //         'parent_id' => $parent->id,
        //         'images' => $allImages,
        //     ]);
        return response()->json([
            'message' => 'Kategori başarıyla eklendi',
            'status' => 'success',
            'data' => $this->indexData($request->bearerToken()),
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
        //return response()->json(['data' => $request->all()]);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'parent_slug' => 'nullable|exists:categories,slug',
            'images' => 'nullable|array',
            'files.*' => 'nullable|file|image|max:5120', // yeni yüklenecek dosyalar
        ]);


         DB::transaction(function () use ($validated, $slug, $request, &$category) {

            $category = Category::where('slug', $slug)->firstOrFail();

            $parent = null;
            if (!empty($validated['parent_slug'])) {
                $parent = Category::where('slug', $validated['parent_slug'])->value('id');
            }

            $allImages = [];
             // Eski yüklenen dosyaları işle
            if ($request->has('images')) {
                foreach ($request->input('images') as $old) {
                    $allImages[] = str_replace(url('storage') . '/', '', $old);
                }
            }

            // Yeni yüklenen dosyaları işle
            if ($request->hasFile('images')) {
                foreach ((array) $request->file('images') as $img) {
                    if ($img instanceof \Illuminate\Http\UploadedFile) {
                        $path = $img->store('categories', 'public');
                        $allImages[] = 'categories/' . basename($path);
                    }
                }
            }

            // Slug kontrolü ve üretimi
            if ($validated['name'] !== $category->name) {
                $baseSlug = Str::slug($validated['name']);
                $newSlug = $baseSlug;
                $counter = 1;
                while (
                    Category::where('slug', $newSlug)
                        ->where('id', '!=', $category->id)
                        ->exists()
                ) {
                    $newSlug = $baseSlug . '-' . $counter++;
                }
            } else {
                $newSlug = $category->slug;
            }

            // Güncelle
            $category->update([
                'name' => $validated['name'],
                'slug' => $newSlug,
                'parent_id' => $parent ?? null,
                'images' => $allImages,
            ]);
         });

        return response()->json([
            'message' => 'Kategori başarıyla güncellendi',
            'status' => 'success',
            'data' => $this->indexData($request->bearerToken()),
        ]);
    }

    public function indexData($token)
    {
        $categories = Category::with([
            'children' => function ($q) {
                $q->whereColumn('id', '!=', 'parent_id');
            },
            'parent:id,slug'
        ])->get();
        return CategoryResources::collection($categories);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($slug)
    {
        $category = Category::where('slug', $slug)->with('children')->firstOrFail();

        DB::transaction(function () use (&$category) {
            $category->delete();
        });

        return response()->json([
            'message' => 'Kategori ve tüm alt kategorileri başarıyla silindi.',
            'status' => 'success',
        ]);
    }
}
