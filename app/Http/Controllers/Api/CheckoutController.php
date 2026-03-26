<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Iyzipay\Model\CheckoutForm;
// use Iyzipay\Model\CheckoutFormInitialize;
use Iyzipay\Model\Payment;
// use Iyzipay\Request\CreateCheckoutFormInitializeRequest;
use Iyzipay\Request\CreatePaymentRequest;
use Iyzipay\Options;
use Iyzipay\Request\RetrieveCheckoutFormRequest;
use Iyzipay\Request\CreateCheckoutFormInitializeRequest;
use Iyzipay\Model\CheckoutFormInitialize;
use Iyzipay\Model\Buyer;
use Iyzipay\Model\Address;
use Iyzipay\Model\BasketItem;

class CheckoutController extends Controller
{
    public function updateSelectedAddress(Request $request)
    {
        $validatedData = $request->validate([
            'address_id' => 'required|integer|exists:user_addresses,id',
        ]);

        $user = auth()->user();
        $addressId = $validatedData['address_id'];

        // Deselect all addresses for the user
        $user->addresses()->where(['is_selected' => 1])->update(['is_selected' => 0]);

        // Select the new address
        $selectedAddress = $user->addresses()->where('id', $addressId)->update(['is_selected' => 1]);

        return response()->json(['message' => 'Adres başarıyla güncellendi.', 'status' => 'success']);
    }

    public function pay(Request $request)
    {
        // return response()->json(['data' => $request->address['address']]);
        $options = new \Iyzipay\Options();
        $options->setApiKey(env('IYZICO_API_KEY'));
        $options->setSecretKey(env('IYZICO_SECRET_KEY'));
        $options->setBaseUrl(env('IYZICO_BASE_URL'));

        $conversationId = uniqid('order_');

        $paymentRequest = new \Iyzipay\Request\CreateCheckoutFormInitializeRequest();
        $paymentRequest->setLocale('tr');
        $paymentRequest->setConversationId($conversationId);

        $paymentRequest->setCurrency(\Iyzipay\Model\Currency::TL);
        $paymentRequest->setBasketId('B678344');
        $paymentRequest->setPaymentGroup(\Iyzipay\Model\PaymentGroup::PRODUCT);
        $paymentRequest->setCallbackUrl(url('/api/checkout/callback'));

        // Buyer bilgileri
        $buyer = new \Iyzipay\Model\Buyer();
        $buyer->setId($request->user()->id);
        $buyer->setName($request->user()->name);
        $buyer->setSurname($request->user()->lastname);
        $buyer->setGsmNumber('+90' . $request->user()->phone);
        $buyer->setEmail($request->user()->email);
        $buyer->setIdentityNumber('11111111111');  // Test için sabit
        $buyer->setLastLoginDate(now()->format('Y-m-d H:i:s'));
        $buyer->setRegistrationDate($request->user()->created_at->format('Y-m-d H:i:s'));
        $buyer->setRegistrationAddress($request->address['address']);
        $buyer->setIp($request->ip());
        //$buyer->setIp('85.34.78.112');
        $buyer->setCity($request->address['city']);
        $buyer->setCountry('Turkey');
        // $buyer->setZipCode($request->zip_code);
        $paymentRequest->setBuyer($buyer);

        // Adres bilgileri
        $shippingAddress = new \Iyzipay\Model\Address();
        $shippingAddress->setContactName($request->address['name'] . ' - ' . $request->address['lastname']);
        $shippingAddress->setCity($request->address['city']);
        $shippingAddress->setCountry('Turkey');
        $shippingAddress->setAddress($request->address['address']);
        // $shippingAddress->setZipCode($request->zip_code);
        $paymentRequest->setShippingAddress($shippingAddress);

        $billingAddress = new \Iyzipay\Model\Address();
        $billingAddress->setContactName($request->address['name'] . ' - ' . $request->address['lastname']);
        $billingAddress->setCity($request->address['city']);
        $billingAddress->setCountry('Turkey');
        $billingAddress->setAddress($request->address['address']);
        // $billingAddress->setZipCode($request->zip_code);
        $paymentRequest->setBillingAddress($billingAddress);

        // Sepet bilgileri
        $basketItems = [];
        $totalPrice = 0;
        foreach ($request->cart as $item) {
            $basketItem = new \Iyzipay\Model\BasketItem();
            $product = \App\Models\Product::where('slug', $item['product_slug'])->firstOrFail();
            $totalPrice += $product->price;
            $basketItem->setId($product->id);
            $basketItem->setName($product->name);
            $basketItem->setCategory1('Kategori');  // Kategori bilgisi varsa ekleyin
            $basketItem->setItemType(\Iyzipay\Model\BasketItemType::PHYSICAL);
            $basketItem->setPrice(number_format($product->price, 2, '.', ''));
            $basketItems[] = $basketItem;
        }
        $totalPrice = number_format($totalPrice, 2, '.', '');
        $paymentRequest->setPrice($totalPrice);
        $paymentRequest->setPaidPrice($totalPrice);
        $paymentRequest->setBasketItems($basketItems);

        // return response()->json([
        //     'paymentRequest' => $totalPrice,
        //     'basketItems' => array_map(function($item) {
        //         return [
        //             'id' => $item->getId(),
        //             'name' => $item->getName(),
        //             'category1' => $item->getCategory1(),
        //             'itemType' => $item->getItemType(),
        //             'price' => $item->getPrice(),
        //         ];
        //     }, $basketItems)
        // ]);

        $checkoutForm = CheckoutFormInitialize::create($paymentRequest, $options);

        return response()->json([
            'status' => $checkoutForm->getStatus(),
            'errorCode' => $checkoutForm->getErrorCode(),
            'errorMessage' => $checkoutForm->getErrorMessage(),
            'checkoutFormContent' => $checkoutForm->getCheckoutFormContent(),
            'token' => $checkoutForm->getToken(),
            'raw' => $checkoutForm->getRawResult()
        ]);
        return response()->json([
            'checkoutFormContent' => $checkoutForm->getCheckoutFormContent(),
            'status' => 'success',
            'token' => $checkoutForm->getToken(),
            'tel' => $buyer->getGsmNumber(),
        ]);
    }

    public function callback(Request $request)
    {
        $options = new \Iyzipay\Options();
        $options->setApiKey(env('IYZICO_API_KEY'));
        $options->setSecretKey(env('IYZICO_SECRET_KEY'));
        $options->setBaseUrl(env('IYZICO_BASE_URL'));

        $retrieveRequest = new RetrieveCheckoutFormRequest();
        $retrieveRequest->setToken($request->token);

        $checkoutForm = CheckoutForm::retrieve($retrieveRequest, $options);

        if ($checkoutForm->getPaymentStatus() == 'SUCCESS') {
            // Siparişi DB’ye kaydet
            // ...
            return response()->json(['success' => true]);
        } else {
            return response()->json(['success' => false, 'error' => $checkoutForm->getErrorMessage()]);
        }
    }
}
