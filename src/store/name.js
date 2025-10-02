import { defineStore } from "pinia";
import { ref } from "vue";

export const useLoginStores = defineStore("Login", ()=>{
    let token = ref("")

    function setToken(tk){
        token.value = tk
    }

    return{
        token, setToken
    }
},
{
    persist:true
})