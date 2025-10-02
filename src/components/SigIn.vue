<template>
    <div class="q-pa-md flex flex-center">
        <q-card class="q-pa-lg shadow-2" style="width: 100%; max-width: 400px">
            <q-card-section>
                <div class="text-h6 text-primary text-center">Sign In</div>
            </q-card-section>

            <q-form @submit.prevent="onSubmit" @reset="onReset" ref="form" class="q-gutter-md">
                <q-input filled v-model="email" label="Email *" lazy-rules :rules="[validateEmail]"
                    prepend-icon="email" />

                <q-input filled v-model="password" :type="showPassword ? 'text' : 'password'" label="Password *"
                    lazy-rules :rules="[val => val && val.length >= 6 || 'Password must be at least 6 characters']"
                    prepend-icon="lock">
                    <template #append>
                        <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                            @click="showPassword = !showPassword" />
                    </template>
                </q-input>

                <div class="text-negative text-caption q-mb-md" v-if="err">{{ err }}</div>

                <div class="row q-col-gutter-sm">
                    <div class="col">
                        <q-btn label="Login" type="submit" color="primary" class="full-width" />
                    </div>
                    <div class="col">
                        <q-btn label="Reset" type="reset" flat color="primary" class="full-width" />
                    </div>
                </div>
            </q-form>
        </q-card>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useLoginStores } from '../store/name.js'
import { postData } from "../services/apiClient.js";
import { useRouter } from "vue-router";

const $q = useQuasar()
const form = ref(null)

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const err = ref('')
const ruter=useRouter()

const useLogin = useLoginStores()

// Validar que el correo sea válido y no tenga espacios
function validateEmail(val) {
    if (!val) return 'Email is required'
    if (/\s/.test(val)) return 'Email cannot contain spaces'

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(val) || 'Please enter a valid email address'
}

// Enviar el formulario
async function onSubmit() {
    const valid = await form.value.validate()
    if (!valid) {
        $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'error',
            message: 'Please fill in all required fields correctly'
        })
        return
    }
    $q.loading.show({ message: 'Iniciando secion...' })
    try {
        // const res = await axios.post(
        //     'https://inventario-15d8.onrender.com/api/usuarios/loguin_usuario',
        //     {
        //         correo: email.value,
        //         password: password.value
        //     }
        // )
        const res=  await postData('/auth/login',{email: email.value,password: password.value})
        console.log(res);
        
        useLogin.setToken(res.holder.token)
        console.log('Token recibido:', res.holder.token)

        ruter.push('/products')

        

        onReset()
    } catch (error) {
        const msg = error?.response?.data?.msg ||
            (error?.response?.data?.errors?.[0]?.msg ?? 'Login failed')

        err.value = msg

        $q.notify({
            color: 'negative',
            icon: 'error',
            message: msg
        })
    }
    finally {
    $q.loading.hide()
  }
}

// Limpiar campos
function onReset() {
    email.value = ''
    password.value = ''
    err.value = ''
    showPassword.value = false
}
</script>
