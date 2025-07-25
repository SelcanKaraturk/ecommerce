import React from 'react'

export const ErrorServices = (error) => {
     // Axios hatasıysa
    if (error.response) {
        //console.log(error.response);
        const status = error.response.status;
        const data = error.response.data;

        // if (status === 422) {
        //     // Validation error
        //     if (typeof data.errors === "object") {
        //         // İlk hatayı al
        //         const firstKey = Object.keys(data.errors)[0];
        //         return data.errors[firstKey][0];
        //     }
        //     return "Geçersiz veri gönderildi.";
        // }

        if (status === 401) return "Lütfen Giriş Yapınız";
        if (status === 403) return "Bu işlemi yapmaya yetkiniz yok.";
        if (status === 404) return "İstenilen içerik bulunamadı.";
        if (status === 500) return "Sunucu hatası. Lütfen tekrar deneyin.";

        return data.message || "Bilinmeyen bir hata oluştu.";
    }

    // Bağlantı hatası
    if (error.request) return "Sunucuya ulaşılamıyor.";

    // Diğer JS hataları
    return error.message || "İşleminiz şu anda gerçekleştirilemiyor.";
}
