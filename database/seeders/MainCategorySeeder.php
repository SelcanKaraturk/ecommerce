<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class MainCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('main_categories')->insert([
            [
            'name'=> 'Yüzük'
            ],
            [
            'name'=> 'Kolye'
            ],
            [
            'name'=> 'Bileklik'
            ],
            [
            'name'=> 'Bilezik'
            ],
            [
            'name'=> 'Kelepçe'
            ],
            [
            'name'=> 'Küpe'
            ],
        ]);
    }
}
