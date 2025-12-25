export function getImagePath(url) {
        // Eğer url zaten path ise aynen döndür
        if (!url.startsWith("http")) return url;
        // URL'den /storage/ sonrası path'i al
        const idx = url.indexOf("/storage/");
        return idx !== -1 ? url.substring(idx + 9) : url;
};
