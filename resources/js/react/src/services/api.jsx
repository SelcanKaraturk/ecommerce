import axios from 'axios';


const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  withCredentials: true,
  withXSRFToken: true,
});

export const getConfig = (token, contentType = "application/json") => {
    const config ={
        headers:{
            "Content-type": contentType,
            "Authorization": `Bearer ${token}`
        }
    }
    return config;
}


// Tüm isteklere X-Locale header'ı ekle
api.interceptors.request.use((config) => {
    const locale = localStorage.getItem('locale') || 'tr';
    config.headers['X-Locale'] = locale;
    return config;
});


export default api;
