<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;


class AuthController extends Controller
{
    public function register(Request $request)
    {

         $request->validate([
             'name' => 'required|min:2|max:50',
             'lastname'=>'required|min:2|max:50',
             'email' => 'required|email|unique:users',
             'password' => 'required|min:6|confirmed',
         ]);


        $user = User::create(array_merge(    $request->only('name', 'email'),
        ['password' => Hash::make($request->password)]
));

        $user->assignRole('user');


        return response()->json(['message' => 'Kayıt başarılı']);

    }

    public function login(Request $request)
    {

        $request->validate([
            'email'=> 'required|email',
            'password' => 'required|min:6',
        ]);
        $user = User::where('email', $request->email)->first();

         if (!$user || !Hash::check($request->password, $user->password)) {
            return  response()->json(['message' => 'Kullanıcı adı ya da şifre hatalı'], 401);
         }
         Auth::login($user,$request->remember_me);
        $request->session()->regenerate(); // güvenlik session id sini yenile
        return response()->json(['message' => auth()->user()->load('roles')]);
    }

    public function show(Request $request)
    {
        return response()->json(auth()->user()->load('roles'));
    }
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['message' => 'Çıkış yapıldı']);
    }

}
