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
             return  response()->json(['error' => 'Kullanıcı adı ya da şifre hatalı'], 401);
          }else{
              return response()->json([
                'user' => $user,
                'currentToken' => $user->createToken('new_user')->plainTextToken,
                'message' => 'Giriş Başarılı'
              ]);
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
        return response()->json(['message' => 'Çıkış yapıldı']);
    }

}
