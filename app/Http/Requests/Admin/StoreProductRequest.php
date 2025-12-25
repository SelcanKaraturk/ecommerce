<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true; 
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'name' => ['required','string','max:255','min:3','regex:/^(?=.*[A-Za-z0-9ğüıöçşĞÜİÖÇŞ])[A-Za-z0-9ğüıöçşĞÜİÖÇŞ\s\-]+$/u'],
            'content' => 'required|string',
            'parent_slug' => 'required|array|min:1', // JSON string yerine array
            'parent_slug.*' => 'string',
            'price' => 'required|numeric|min:0',
            'discount' => 'sometimes|numeric|min:0|max:100', 
            'variants' => 'required|json',
            'images' => ['nullable', 'array'],
            'images.*' => ['sometimes', 'image', 'mimes:jpeg,jpg,png,gif,webp'],
            'existing_images' => ['nullable', 'array'],
            'existing_images.*' => ['string'],
            
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages()
    {
        return [
            'name.required' => 'Ürün adı gereklidir.',
            'name.min' => 'Ürün adı en az 3 karakter olmalıdır.',
            'name.regex' => 'Ürün adı en az bir harf veya sayı içermelidir; yalnızca özel karakterlerden oluşamaz.',
            'content.required' => 'Ürün açıklaması gereklidir.',
            'parent_slug.required' => 'En az bir kategori seçilmelidir.',
            'price.required' => 'Fiyat gereklidir.',
            'price.numeric' => 'Fiyat sayısal bir değer olmalıdır.',
            'price.required' => 'Fiyat gereklidir.',
            'price.numeric' => 'Fiyat sayısal bir değer olmalıdır.',
            'discount.numeric' => 'İndirim sayısal bir değer olmalıdır.', 
            'variants.required' => 'Ürün özelliklerini doldurunuz.',
            'variants.json' => 'Varyantlar geçerli JSON formatında olmalıdır.',
            'images.*.image' => 'Yüklenen dosyalar resim olmalıdır.',
            'images.*.mimes' => 'Resimler jpeg, jpg, png, gif veya webp formatında olmalıdır.',
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        // parent_slug string ise array'e çevir
        if (is_string($this->parent_slug)) {
            $this->merge([
                'parent_slug' => array_filter(array_map('trim', explode(',', $this->parent_slug)))
            ]);
        }
    }

    public function withValidator($validator){
        $validator->after(function ($validator) {
            if ($this->has('variants')) {
                $variants = json_decode($this->variants, true);
                if (is_array($variants)) {
                    $seen = [];
                    foreach ($variants as $index => $variant) {
                        $key = ($variant['color'] ?? '') . '|' . ($variant['size'] ?? '');
                        if (isset($seen[$key])) {
                            $validator->errors()->add(
                                "variants.$index",
                                "Aynı renk ve ölçü kombinasyonu birden fazla eklenemez."
                            );
                        }
                        $seen[$key] = true;

                        // // Sadece update/güncelleme için veritabanı kontrolü
                        // if (($this->isMethod('put') || $this->isMethod('patch')) && $this->route('product')) {
                        //     $productId = $this->route('product');
                        //     $exists = \DB::table('product_stocks')
                        //         ->where('product_id', $productId)
                        //         ->where('color', $variant['color'] ?? null)
                        //         ->where('size', $variant['size'] ?? null)
                        //         ->exists();
                        //     if ($exists) {
                        //         $validator->errors()->add(
                        //             "variants.$index",
                        //             "Bu ürün için aynı renk ve ölçü kombinasyonu zaten mevcut."
                        //         );
                        //     }
                        // }
                    }
                }
            }
        });
    }
}