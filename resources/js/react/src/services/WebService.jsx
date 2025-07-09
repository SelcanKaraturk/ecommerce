import api from "./api"


export const getCsrfCookie = () => {
    return api.get("/sanctum/csrf-cookie");
};

export const homeData = async ()=>{
    await getCsrfCookie();
    return await api.get('/api/tr',{withCredentials:true});
}
