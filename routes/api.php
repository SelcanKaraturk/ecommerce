<?php

use App\Http\Controllers\Api\Admin\CmsController;
use App\Http\Controllers\Api\Admin\AdminAuthController;
use App\Http\Controllers\Api\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\Admin\CategoryController as AdminCategoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\User\WishlistController;
use App\Http\Controllers\Api\User\CartCookieController;
use App\Http\Controllers\Api\User\CartController;
use App\Http\Controllers\Auth\AuthController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use App\Models\User;
use PhpParser\Node\Expr\FuncCall;
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
// Doğrulama linkine tıklayınca tetiklenir
Route::get('/email/verify/{id}/{hash}', function (Request $request, $id, $hash) {
    $user = User::find($id);

    if (! $user) {
        abort(404, 'Kullanıcı bulunamadı');
    }

    // Hash doğru mu kontrol et
    if (! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
        abort(403, 'Geçersiz doğrulama linki.');
    }

    // Zaten doğrulandı mı?
    if (! $user->hasVerifiedEmail()) {
        $user->markEmailAsVerified();
    }

    // Frontend'e yönlendir
    return Redirect::to( 'http://localhost:5173/login');
})->middleware(['signed'])->name('verification.verify');

// Tekrar doğrulama linki yollamak
Route::post('/email/verification-notification', function (Request $request) {
    if ($request->user()->hasVerifiedEmail()) {
        return response()->json(['message' => 'Zaten doğrulandı']);
    }

    $request->user()->sendEmailVerificationNotification();
    return response()->json(['message' => 'Doğrulama e-postası gönderildi']);
})->middleware(['auth:sanctum', 'throttle:6,1'])->name('verification.send');

Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/register', [AuthController::class, 'register']);

Route::prefix('/{lang}')->where(['lang' => 'tr|en|de'])->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::get('/{category}/{slug}', [ProductController::class, 'show'])->middleware('auth:sanctum');
});
Route::prefix('/admin')->middleware(['auth:sanctum', 'role:admin'])->group(function (){
    Route::get('/',[AdminAuthController::class, 'show']);
    Route::post('/logout',[AdminAuthController::class, 'logout']);
    Route::get('/dashboard',[CmsController::class, 'index']);
    Route::apiResource('products', AdminProductController::class);
    Route::apiResource('categories', AdminCategoryController::class);
});
Route::post('/admin/login',[AdminAuthController::class, 'login']);


//->middleware( ['auth:sanctum'])
Route::prefix('me')->middleware(['auth:sanctum', 'verified'])->group(function () {
    Route::get('/', [AuthController::class, 'show']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/wishlist', [WishlistController::class, 'toggle']);
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::delete('/wishlist/{slug}', [WishlistController::class, 'destroy']);
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/toggle', [CartController::class, 'toggleItem']);
    Route::post('/cart/delete', [CartController::class, 'destroy']);
    Route::put('/cart', [CartController::class, 'update']);
    
    // my account routes
    Route::post('/update-profile', [AuthController::class, 'updatePersonalInfo']);
    Route::post('/update-password', [AuthController::class, 'updatePassword']);
    Route::post('/create-address', [AuthController::class, 'createAddress']);
    Route::post('/update-address/{id}', [AuthController::class, 'updateAddress']);
    Route::delete('/delete-address/{id}', [AuthController::class, 'deleteAddress']);
});

Route::get('/cart', [CartCookieController::class, 'show']);
Route::post('/cart/toggle', [CartCookieController::class, 'toggle']);
Route::post('/cart/delete', [CartCookieController::class, 'destroy']);

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







