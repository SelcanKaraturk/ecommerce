import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  withXSRFToken: true,
});

export const getConfig = (token) => {
    const config ={
        headers:{
            "Content-type":"application/json",
            "Authorization": `Bearer ${token}`
        }
    }
    return config;
}

// api.interceptors.request.use((config) => {
//   const token = Cookies.get('XSRF-TOKEN');
//   if (token) {
//     config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token); // bu çok kritik
//   }
//   return config;
// });


export default api;
