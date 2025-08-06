<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\User\WishlistController;
use App\Http\Controllers\Api\User\CartCookieController;
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

Route::prefix('/{lang}')->where(['lang' => 'tr|en|de'])->group(function(){
    Route::get('/', [ProductController::class,'index']);
    Route::get('/{category}/{slug}', [ProductController::class,'show']);
});
//->middleware( ['auth:sanctum'])
Route::prefix('me')->middleware(['auth:sanctum'])->group(function(){
    Route::get('/', [AuthController::class, 'show']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/wishlist', [WishlistController::class, 'toggle']);
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::delete('/wishlist/{slug}', [WishlistController::class, 'destroy']);
    Route::get('/cart', [CartController::class, 'index']);
});

Route::get('/cart', [CartCookieController::class, 'show']);
Route::post('/cart/toggle', [CartCookieController::class, 'toggle']);

// Route::middleware(['throttle:60,1'])->group(function () {
//     Route::get('/cart', [CartController::class, 'show']);
//     Route::post('/cart/toggle', [CartController::class, 'toggleItem']);
// });

// Route::get('/user-check', function (Request $request) {
//     if (auth()->check()) {
//         return response()->json(['auth' => true, 'user' => $request->user()]);
//         // ->load('roles')
//     }
//     return response()->json(['auth' => false], 200);
// });







