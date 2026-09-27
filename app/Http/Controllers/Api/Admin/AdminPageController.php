<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\PageSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class AdminPageController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $blocks = Page::where('url', $request->query('page'))
            ->with([
                'sections' => function ($query) {
                    $query
                        ->whereNull('parent_id')
                        ->orderBy('sort_order')
                        ->with('children');
                }
            ])
            ->first();
        return response()->json(['status' => 'success', 'blocks' => $blocks, 'user' => $request->user(), 'query' => $request->query('page')]);
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
        $section = new PageSection();

        $validated = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'url' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['required', 'integer', 'min:1'],
            'is_active' => ['required', 'boolean'],
            'metadata' => ['nullable'],
            'image_path' => ['nullable', 'file', 'image', 'max:4096'],
            'parent_id' => ['required', 'integer', 'exists:page_sections,id'],
            'page_id' => ['required', 'integer', 'exists:pages,id'],
        ]);

        DB::beginTransaction();
        try {
            if ($request->hasFile('image_path')) {
                $file = $request->file('image_path');
                $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('pages', $filename, 'public');
                $validated['image_path'] = $path;
            } else {
                $validated['image_path'] = '';
            }

            if ($request->has('metadata')) {
                $metadata = $request->input('metadata');
                if (is_string($metadata)) {
                    $decoded = json_decode($metadata, true);
                    $validated['metadata'] = json_last_error() === JSON_ERROR_NONE ? $decoded : [];
                } elseif (is_array($metadata)) {
                    $validated['metadata'] = $metadata;
                } else {
                    $validated['metadata'] = [];
                }
            }
            $created = $section->create($validated);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();

            if (!empty($newImagePath) && Storage::disk('public')->exists($newImagePath)) {
                Storage::disk('public')->delete($newImagePath);
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Ekleme sırasında bir hata oluştu: ' . $e->getMessage(),
            ], 500);
        }

        if (!empty($oldImageToDelete) && Storage::disk('public')->exists($oldImageToDelete)) {
            Storage::disk('public')->delete($oldImageToDelete);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Başarıyla eklendi.',
            'data' => $created
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
        $section = PageSection::findOrFail($id);
        $oldImagePath = $section->image_path;
        $validated = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'url' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['required', 'integer', 'min:1'],
            'is_active' => ['required', 'boolean'],
            'metadata' => ['nullable'],
        ]);

        if ($request->hasFile('image_path')) {
            $request->validate([
                'image_path' => ['nullable', 'file', 'image', 'max:4096'],
            ]);
        }

        $newImagePath = null;
        $oldImageToDelete = null;

        DB::beginTransaction();
        try {
            if ($request->hasFile('image_path')) {
                $file = $request->file('image_path');
                $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('pages', $filename, 'public');
                $validated['image_path'] = $path;
                $newImagePath = $path;

                if (!empty($oldImagePath)) {
                    $oldImageToDelete = $oldImagePath;
                }
            } else {
                $incomingImagePath = $request->input('image_path');
                if (($incomingImagePath === '' || $incomingImagePath === null) && !empty($oldImagePath)) {
                    $validated['image_path'] = null;
                    $oldImageToDelete = $oldImagePath;
                } else {
                    $validated['image_path'] = $oldImagePath;
                }
            }

            if ($request->has('metadata')) {
                $metadata = $request->input('metadata');
                if (is_string($metadata)) {
                    $decoded = json_decode($metadata, true);
                    $validated['metadata'] = json_last_error() === JSON_ERROR_NONE ? $decoded : [];
                } elseif (is_array($metadata)) {
                    $validated['metadata'] = $metadata;
                } else {
                    $validated['metadata'] = [];
                }
            }
            $section->update($validated);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();

            if (!empty($newImagePath) && Storage::disk('public')->exists($newImagePath)) {
                Storage::disk('public')->delete($newImagePath);
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Güncelleme sırasında bir hata oluştu: ' . $e->getMessage(),
            ], 500);
        }

        if (!empty($oldImageToDelete) && Storage::disk('public')->exists($oldImageToDelete)) {
            Storage::disk('public')->delete($oldImageToDelete);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Başarıyla güncellendi.',
            'data' => $section->fresh()
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
        $section = PageSection::findOrFail($id);
        $oldImagePath = $section->image_path;

        DB::beginTransaction();
        try {
            $section->delete();
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Silme sırasında bir hata oluştu: ' . $e->getMessage(),
            ], 500);
        }

        if (!empty($oldImagePath) && Storage::disk('public')->exists($oldImagePath)) {
            Storage::disk('public')->delete($oldImagePath);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Başarıyla silindi.',
        ]);
    }

    public function updateParent(Request $request, $id)
    {
        $section = Page::findOrFail($id);

        $validated = $request->validate([
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string', 'max:255'],
        ]);

        DB::beginTransaction();
        try {
            $section->update($validated);
            DB::commit();
        }catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Güncelleme sırasında bir hata oluştu: ' . $e->getMessage(),
            ], 500);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Başarıyla güncellendi.',
            'data' => $section->fresh()
        ]);
    }
}
