<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

 Route::get('/', function () {
    return view('layouts/welcome');
 });


// Route::get('/{any}', function () {
//     $indexPath = public_path('index.html');
//     if (File::exists($indexPath)) {
//         return File::get($indexPath);
//     }
//     abort(404);
// })->where('any', '.*');


// Route::get('/{any}', function () {
//     return File::get(public_path('index.html'));
// })->where('any', '^(?!api|assets|storage|build|js|css|images).*$');