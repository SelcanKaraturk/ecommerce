<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
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
Route::post('/logout', [AuthController::class, 'logout']);
//->middleware( ['auth:sanctum'])
Route::prefix('me')->group(function(){
    Route::get('/', [AuthController::class, 'show']);
});
// Route::get('/guest-check', function () {
//     if (auth()->check()) {
//         return response()->json(['auth' => true, 'user' => auth()->user()->load('roles')]);
//     }

//     return response()->json(['auth' => false], 200);
// });

Route::prefix('/{lang}')->group(function(){
    Route::get('/', [ProductController::class,'index']);
});



//Route::get('/products', [ProductController::class, 'index']);



