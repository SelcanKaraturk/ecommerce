<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\User\WishlistController;
use App\Http\Controllers\Api\User\CartController;
use App\Http\Controllers\Auth\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/login',[AuthController::class,'login'])->name('login');
Route::post('/register', [AuthController::class, 'register']);

//->middleware( ['auth:sanctum'])
Route::prefix('me')->middleware(['auth:sanctum'])->group(function(){
    Route::get('/', [AuthController::class, 'show']);
    Route::get('/{lang}/{category}/{slug}', [ProductController::class,'show']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/wishlist', [WishlistController::class, 'toggle']);
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::delete('/wishlist/{slug}', [WishlistController::class, 'destroy']);
    Route::post('/cart', [CartController::class, 'toggle']);
    Route::get('/cart', [CartController::class, 'index']);
});

// Route::get('/user-check', function (Request $request) {
//     if (auth()->check()) {
//         return response()->json(['auth' => true, 'user' => $request->user()]);
//         // ->load('roles')
//     }
//     return response()->json(['auth' => false], 200);
// });

Route::prefix('/{lang}')->group(function(){
    Route::get('/', [ProductController::class,'index']);
    Route::get('/{category}/{slug}', [ProductController::class,'show']);
});



//Route::get('/products', [ProductController::class, 'index']);



