
import SigIn from "../components/SigIn.vue"
import Products from "../views/products.vue";

import Clientes from "../views/clients.vue";
import Ventas from "../views/ventas.vue";


import {createRouter, createWebHashHistory} from "vue-router"

const routes = [
    {path: '/',redirect: '/sig-in'},
    { path:"/sig-in" ,component: SigIn },
    { path:"/products" ,component: Products },
    { path:"/clientes" ,component: Clientes },
    { path:"/ventas" ,component: Ventas },
]

export const router =createRouter({
    history:createWebHashHistory(),
    routes
})
