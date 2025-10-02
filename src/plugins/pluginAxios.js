import axios from 'axios';

const token = JSON.parse(localStorage.getItem('Login'))  || '';

export const apiClient = axios.create({
    //baseURL: 'http://localhost:/api',
    // backend prrofe alex baseURL: 'https://inventario-15d8.onrender.com/api',
    baseURL:'https://api-inventary.onrender.com/apinv',
    headers: {
        "Authorization": token.token
    }

}
);

// apiClient.js
// import axios from "axios";
// import { useLoginStores } from "../store/name.js";

// export const apiClient = axios.create({
//     baseURL: "https://inventario-15d8.onrender.com/api",
// });

// // Interceptor: se ejecuta antes de cada petición
// apiClient.interceptors.request.use((config) => {
//     const loginStore = useLoginStores();
//     if (loginStore.token) {
//         config.headers["x-token"] = loginStore.token;
//     }
//     return config;
// });
