<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Auth\Events\Login;


class AuthController extends Controller
{
    public function register(Request $request)
    {

        $validated = $request->validate([
            'name' => 'required|min:2|max:50',
            'lastname' => 'required|min:2|max:50',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6|confirmed',
        ]);

        DB::beginTransaction();

        try {
            // Kullanıcıyı oluştur
            $user = User::create([
                'password' => Hash::make($validated['password']),
                'name' => $validated['name'] . ' ' . $validated['lastname'],
                'email' => $validated['email'],
            ]);

            // Rol ata
            $user->assignRole('user');

            // Her şey yolunda, commit et
            DB::commit();

            return response()->json(['message' => 'Kayıt başarılı']);
        } catch (\Throwable $e) {
            // Hata varsa rollback
            DB::rollBack();

            return response()->json([
                'message' => 'Kayıt sırasında bir hata oluştu.',
                'error' => $e->getMessage(),
            ], 500);
        }

    }

    public function login(Request $request)
    {

        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);

        DB::beginTransaction();
        try {
            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json(['error' => 'Kullanıcı adı ya da şifre hatalı'], 401);
            }
            event(new Login(auth()->guard(), $user, false));
            DB::commit();
            return response()->json([
                'user' => $user,
                'currentToken' => $user->createToken('new_user')->plainTextToken,
                'message' => 'Giriş Başarılı'
            ])->withCookie(cookie()->forget('cart_items'));

        } catch (\Throwable $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Beklenmeyen bir hata oluştu.',
                'error' => $e->getMessage(),
            ], 500);
        }
        //  Auth::login($user,$request->remember_me);
        // $request->session()->regenerate(); // güvenlik session id sini yenile

    }

    public function show(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
            'currentToken' => $request->bearerToken()
        ]);
    }
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'sorun var']);
    }

}
