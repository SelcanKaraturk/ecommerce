import api from "./api";
import Cookies from 'js-cookie'

export const getCsrfCookie = () => {
    return api.get("/sanctum/csrf-cookie");
};

// Kullanıcı giriş işlemi

export const login = async (credentials) => {
    await getCsrfCookie();
    const token = Cookies.get('XSRF-TOKEN');
    return api.post("/api/login", credentials,{
  headers: {
    'X-XSRF-TOKEN': token
  },
  withCredentials: true
});
};

// Kullanıcı kayıt işlemi (isteğe bağlı)
export const register = async (data) => {
    await getCsrfCookie();
    return api.post("/api/register", data);
};

// Giriş yapmış kullanıcının bilgilerini getir
export const getUser = async () => {

    await getCsrfCookie();
    return api.get("/api/me",{withCredentials:true});

};

export const getAuth = async () => {

    await getCsrfCookie();
    const res = await api.get("/api/guest-check",{withCredentials:true});
    //console.log(res.data);
    return res;
};


// Kullanıcı çıkışı
export const logout = async () => {
    await getCsrfCookie();
    const token = Cookies.get('XSRF-TOKEN');
    return api.post("/api/logout",{},{headers:{'X-XSRF-TOKEN': token}, withCredentials:true});
};

