<?php

namespace Database\Seeders;


use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Spatie\Permission\Models\Role;
class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
    //    DB::table('products')->insert([
    //         [
    //         'name'=> 'Lacivert Gömlek',
    //         'price'=> 890.99,
    //         'content' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit.
    //         Temporibus natus harum sint enim deserunt adipisci labore nam.'
    //     ]
    //     ]);
            // Eğer roller yoksa oluştur
                Role::firstOrCreate(['name' => 'admin']);
                Role::firstOrCreate(['name' => 'user']);

        // Admin kullanıcıyı oluştur
        $admin = User::firstOrCreate(
            ['email' => 'adminyilmaz@gmail.com'], // email varsa tekrar oluşturmasın
            [
                'name' => 'Selcan',
                'lastname' => 'Yılmaz',
                'email_verified_at' => now(),
                'password' => Hash::make('admin123'),
            ]
        );

        // Role bağla
        $admin->assignRole('admin');

    }
}
