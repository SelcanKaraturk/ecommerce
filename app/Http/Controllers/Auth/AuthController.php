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
                'name' => $validated['name'],
                'lastname' => $validated['lastname'],
                'email' => $validated['email'],
            ]);

            // Rol ata
            $user->assignRole('user');
            $user->sendEmailVerificationNotification();

            // Her şey yolunda, commit et
            DB::commit();

            return response()->json(['message' => 'Lütfen Hesabınızı Doğrulayınız','status'=>'success']);
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
            if(!$user->email_verified_at){
                return response()->json(['error' => 'Merhaba '.$user->name.' işleminize devam edebilmek için hesabınızı doğrulamanız gerekmektedir. Lütfen emailinizi kontrol ediniz.']);
            }

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json(['error' => 'Kullanıcı adı ya da şifre hatalı']);
            }
            event(new Login(auth()->getDefaultDriver(), $user, false));
            //return response()->json(['guard'=>auth()->getDefaultDriver()]);
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
            'user' => $request->user()->load('roles','addresses'),
            'currentToken' => $request->bearerToken()
        ]);
    }
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'sorun var']);
    }

    // my account - personal info update
    public function updatePersonalInfo(Request $request)
    {
        $validated = $request->validate([
            'name'      => 'required|min:2|max:50',
            'lastname'  => 'required|min:2|max:50',
            'email'     => 'required|email|unique:users,email,' . $request->user()->id, // mevcut kullanıcı hariç
            'phone'     => ['required', 'regex:/^5[0-9]{9}$/'],
            'birthdate' => ['required', 'date', 'before_or_equal:2011-12-31'],
        ]);

        $user = $request->user();

        // Kullanıcı yetki kontrolü
        if ($user->id !== (int) $request->input('userNumber')) {
            $user->currentAccessToken()->delete();
            return response()->json([
                'error'  => 'Bu işlemi yapmaya yetkiniz yoktur',
                'status' => 'error403'
            ], 403);
        }

        // Email değişikliği kontrolü ve doğrulama
        if ($user->email !== $validated['email']) {
            $user->email = $validated['email'];
            $user->email_verified_at = null;
            $user->save();
            $user->sendEmailVerificationNotification();
            $user->currentAccessToken()->delete();
        }

        // Doğum tarihi formatını düzelt
        $request->merge([
            'birthdate' => date('Y-m-d', strtotime(substr($request->birthdate, 0, 10)))
        ]);

        // Diğer alanları güncelle
        $user->update($request->except('userNumber', 'email'));
        $user->load('roles','addresses');

        return response()->json([
            'message' => 'Bilgileriniz başarıyla güncellendi.',
            'user'    => $user,
            'status'  => 'success'
        ]);
    }

    // my account - password update
    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'oldpassword' => 'required',
            'newpassword' => 'required|min:6|confirmed',
            'newpassword_confirmation' => 'required|min:6',
        ]);

        $user = $request->user();

        if ($user->id !== $request->input('user_id')) {
            $request->user()->currentAccessToken()->delete();
            return response()->json(['error' => 'Bu işlemi yapmaya yetkiniz yoktur', 'status' => 'error403'], 403);
        }

        DB::beginTransaction();
        try {
            $user = User::findOrFail($user->id);

            if (!Hash::check($validated['oldpassword'], $user->password)) {
                return response()->json(['error' => 'Mevcut şifreniz yanlış.', 'status' => 'error'], 400);
            }   

            $user->password = Hash::make($validated['newpassword']);
            $user->save();
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'İşleminiz gerçekleştirilemedi.', 'status' => 'error'], 404);
        }

        return response()->json(['message' => 'Şifreniz başarıyla güncellendi.', 'status' => 'success']);
    }

    // my account - create address
    public function createAddress(Request $request) {
        $validated = $request->validate([
            'name' => 'required|min:2|max:50',
            'lastname' => 'required|min:2|max:50',
            'title' => 'required|min:2|max:50',
            'phone' => ['required', 'regex:/^5[0-9]{9}$/'],
            'city' => 'required|string',
            'district' => 'required|string',
            'neighborhood' => 'required|string',
            'address' => 'required|string|min:10|max:700',
        ]);
        DB::beginTransaction();
        try {
            $user = $request->user();
            // İsim ve soyisim baş harfleri büyük olacak şekilde birleştiriliyor
            $fullName = ucwords(strtolower(trim($validated['name']))) . ' ' . ucwords(strtolower(trim($validated['lastname'])));
            $addressData = $validated;
            $addressData['name'] = $fullName;
            unset($addressData['lastname']);
            $newAddress = $user->addresses()->create($addressData);
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error','error' => 'Adresiniz eklenirken bir hata oluştu.'], 500);
        }

        return response()->json(['message' => 'Adres başarıyla eklendi.', 'status' => 'success', 'data' =>  $newAddress ]);
    }

    // my account - update address
    public function updateAddress(Request $request) {
        $validated = $request->validate([
            'id' => 'required|exists:user_addresses,id',
            'name' => 'required|min:2|max:50',
            'title' => 'required|min:2|max:50',
            'phone' => ['required', 'regex:/^5[0-9]{9}$/'],
            'city' => 'required|string',
            'district' => 'required|string',
            'neighborhood' => 'required|string',
            'address' => 'required|string|min:10|max:700',
        ]);

        $user = $request->user();
        $address = $user->addresses()->where('id', $validated['id'])->firstOrFail();
        Db::beginTransaction();
        try {
            $address->update($validated);
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error','error' => 'Adresiniz güncellenirken beklenmeyen bir hata oluştu.'], 500);
        }
        
        return response()->json(['message' => 'Adres başarıyla güncellendi.', 'status' => 'success', 'data' => $address ]);
    }

    // my account - delete address
    public function deleteAddress(Request $request, $id) {
        $user = $request->user();
        $address = $user->addresses()->where('id', $id)->firstOrFail();

        DB::beginTransaction();
        try {
            $address->delete();
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error','error' => 'Adresiniz kaldırılırken beklenmeyen bir hata oluştu.'], 500);
        }

        return response()->json(['message' => 'Adresiniz başarıyla kaldırıldı.', 'status' => 'success']);
    }       


}
