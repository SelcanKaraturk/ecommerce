<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Database\Seeders\ProductSeeder;
use Illuminate\Support\Facades\Schema;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {


        // Schema::disableForeignKeyConstraints();
        // \App\Models\Product::truncate();
        // \App\Models\Category::truncate();
        // Schema::enableForeignKeyConstraints();

        // \App\Models\User::factory(10)->create();
        // \App\Models\Category::factory()->count(10)->create();
        // \App\Models\Product::factory()->count(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        $this->call([
            //ProductSeeder::class
            MainCategorySeeder::class

        ]);
    }
}
