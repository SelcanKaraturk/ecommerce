<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Google\Client as GoogleClient;

class GoogleController extends Controller
{
     public function redirect()
    {
        $client = new GoogleClient();
        $client->setClientId(config('services.google.client_id'));
        $client->setRedirectUri("https://e3280f0daed3.ngrok-free.app/google/callback");
        $client->addScope('https://www.googleapis.com/auth/adwords');
        $client->setAccessType('offline'); // refresh token alabilmek için
        $client->setPrompt('consent');

        $authUrl = $client->createAuthUrl();
        return redirect($authUrl);
    }

    // 2️⃣ Google geri döndüğünde çalışır
    public function callback(Request $request)
    {
        $client = new GoogleClient();
        $client->setClientId(config('services.google.client_id'));
        $client->setClientSecret(config('services.google.client_secret'));
        $client->setRedirectUri("https://e3280f0daed3.ngrok-free.app/google/callback");

        // Google'dan code parametresi gelir
        $token = $client->fetchAccessTokenWithAuthCode($request->code);

        if (isset($token['error'])) {
            return response()->json(['error' => $token], 400);
        }

        // refresh_token'ı kaydet
        $refreshToken = $token['refresh_token'] ?? null;
        $accessToken = $token['access_token'];

        // // örnek olarak session'a yazalım
        // session([
        //     'google_access_token' => $accessToken,
        //     'google_refresh_token' => $refreshToken,
        // ]);
        \App\Models\GoogleToken::updateOrCreate(
            [
                'access_token' => $token['access_token'],
                'refresh_token' => $token['refresh_token'] ?? null,
                'expires_in' => $token['expires_in'] ?? null,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Google Ads hesabı başarıyla bağlandı!',
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken
        ]);
    }
}
