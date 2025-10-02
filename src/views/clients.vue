<template>
    <div class="q-pa-md">
        <div class="text-center">
            <div style="margin-bottom: 30px">
                <h2 style="margin: 0; color: cornflowerblue">Clientes</h2>
            </div>
            <div class="q-mb-md flex justify-end">
                <q-btn color="primary" icon="add" label="Agregar Cliente" @click="createclient" />
            </div>
        </div>
        <q-table class="my-sticky-header-table" flat bordered title="clients" :rows="rows" :columns="columns"
            row-key="name">
            <template v-slot:body-cell-opciones="props">
                <q-td :props="props">
                    <div style="display: flex; justify-content: space-evenly; align-items: center;">
                        <div>
                            <q-btn icon="edit" color="primary" @click="editclient(props.row)" />
                        </div>
                        <div v-if="props.row.active == 1">
                            <q-btn @click="activaranddesactivar(props.row._id, props.row.active)" icon="cancel"
                                color="red" size="sm" round dense />
                        </div>
                        <div v-else>
                            <q-btn @click="activaranddesactivar(props.row._id, props.row.active)" icon="check_circle"
                                color="green" size="sm" round dense />
                        </div>
                    </div>

                </q-td>
            </template>
            <template v-slot:body-cell-active="props">
                <q-td :props="props">
                    <div style="display: flex; justify-content:center;">
                        <div v-if="props.row.active == 1">
                            <q-badge color="green">Activo</q-badge>
                        </div>
                        <div v-else>
                            <q-badge color="red">Inactivo</q-badge>
                        </div>
                    </div>

                </q-td>
            </template>


        </q-table>



        <!-- Dialog -->
        <q-dialog v-model="prompt" persistent>
            <q-card class="q-pa-lg shadow-2" style="width: 100%; max-width: 400px">
                <q-card-section>
                    <div class="text-h6 text-primary text-center">{{ title }}</div>
                </q-card-section>

                <q-form ref="clientForm" @submit.prevent="onSubmit" class="q-gutter-md">

                    <q-input filled v-model="client.name" label="name *" @blur="client.name = client.name.trim()"
                        :rules="[val => !!val || 'El name es requerido',
                        val => val.length >= 2 || 'El name debe tener al menos 2 caracteres',
                        val => val.trim() === val || 'No debe comenzar ni terminar con espacios']" />

                    <q-input filled v-model="client.address" label="Dirección *"
                        @blur="client.address = client.address.trim()" :rules="[
                            val => !!val || 'La dirección es requerida',
                            val => val.trim() === val || 'No debe comenzar ni terminar con espacios'
                        ]" />

                    <q-input filled v-model.number="client.cellphone" label="Teléfono" type="tel" inputmode="numeric"
                        :rules="[
                            val => !!val || 'El teléfono es requerido',
                            val => /^[0-9]{7,15}$/.test(val) || 'El número debe tener entre 7 y 15 dígitos'
                        ]" />


                    <q-input filled v-model="client.email" label="Email *" lazy-rules :rules="[validateEmail,
                        val => val.trim() === val || 'No debe comenzar ni terminar con espacios'
                    ]" prepend-icon="email" />

                    <div class="row q-col-gutter-sm">
                        <div class="col">
                            <q-btn label="Guardar" type="submit" color="primary" class="full-width" />
                        </div>
                        <div class="col">
                            <q-btn label="Cancelar" flat color="primary" class="full-width" v-close-popup />
                        </div>
                    </div>
                </q-form>
            </q-card>
        </q-dialog>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { getData, putData, postData } from "../services/apiClient.js";
import { useQuasar } from 'quasar'

const $q = useQuasar()
const rows = ref([])
const client = ref({
    name: '',
    address: '',
    cellphone: 0,
    email: 0,
    active: 1
})
const prompt = ref(false)
const clientForm = ref(null)
const title = ref('Crear client')
onBeforeMount(() => {
    getclients();
});

const columns = [
    { name: 'name', label: 'nombre', align: 'left', field: row => row.name, sortable: true },
    { name: 'address', align: 'center', label: 'address', field: 'address', sortable: true },
    { name: 'cellphone', align: 'center', label: 'cellphone', field: 'cellphone', sortable: true },
    { name: 'email', align: 'center', label: 'email', field: 'email', sortable: true },
    { name: 'active', align: 'center', label: 'active', field: 'active', sortable: true },
    { name: 'opciones', align: 'center', label: 'Opciones' },
]

function validateEmail(val) {
    if (!val) return 'Email is required'
    if (/\s/.test(val)) return 'Email cannot contain spaces'

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(val) || 'Please enter a valid email address'
}

async function getclients() {
    $q.loading.show({ message: 'Cargando clientes...' })
    try {
        const res = await getData('/customers/listCustomer')
        if (res) {
            rows.value = res.customers
        }

    } catch (error) {
        console.error('Error fetching data:', error)
        $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'error',
            message: 'Error al cargar los clients'
        })
    } finally {
        $q.loading.hide()
    }
}

async function activaranddesactivar(id, estatus) {
    let msg
    let data
    if (estatus) {
        msg = "Desactivando"
        data = { active: 0 }
    } else {
        msg = "Activando"
        data = { active: 1 }
    }
    $q.loading.show({ message: `${msg} producto...` })
    console.log(id);
    try {
        let res = await putData(`customers/updateActive/${id}`, data);
        console.log(res);
        getclients()

    } catch (error) {
        console.log("err: " + error);
        $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'error',
            message: `Error al ${msg} el producto`
        })
    }
    finally {
        $q.loading.hide()
    }
}


async function edit() {
    try {
        // Crear objeto sin el campo activate para el backend
        const clientData = {
            name: client.value.name,
            address: client.value.address,
            cellphone: client.value.cellphone,
            email: client.value.email,
        }

        const res = await putData(`/customers/updateCustomer/${client.value._id}`, clientData)
        console.log('client actualizado:', res)

        $q.notify({
            color: 'positive',
            icon: 'check',
            message: 'client actualizado correctamente!'
        })
        title.value = 'Crear client'
        return true
    } catch (error) {
        console.error('Error updating client:', error)
        $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'error',
            message: error.response.data.errors?.[0]?.msg || error.response.data.msg || 'Error al actualizar el client'
        })
        return false
    }
}

function editclient(row) {
    title.value = 'Editar client'
    client.value = { ...row }
    prompt.value = true
}

function createclient() {
    title.value = 'Crear client'
    client.value = {
        _id: "",
        name: '',
        address: '',
        cellphone: 0,
        email: 0,
        activate: 0,
    }
    prompt.value = true
}

async function create() {
    try {
        const clientData = {
            name: client.value.name,
            address: client.value.address,
            cellphone: client.value.cellphone,
            email: client.value.email
        }

        const res = await postData(`/customers/addCustomer`, clientData)
        console.log('client creado:', res)

        $q.notify({
            color: 'positive',
            icon: 'check',
            message: 'client creado correctamente!'
        })
        title.value = 'Crear client'
        return true
    } catch (error) {
        console.error('Error create client:', error)
        $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'error',
            //error.response.data.msg || error.response.data.errors[0].msg
            message: error.response.data.errors?.[0]?.msg || error.response.data.msg || 'Error al crear client'
        })
        return false
    }
}



async function onSubmit() {
    const isValid = await clientForm.value.validate()

    if (!isValid) {
        $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'error',
            message: 'Por favor complete todos los campos correctamente'
        })
        return
    }

    if (client.value._id != "") {
        const success = await edit()
        if (success) {
            prompt.value = false
            clientForm.value.resetValidation()
            getclients()
        }
    } else {
        const success = await create()
        if (success) {
            prompt.value = false
            clientForm.value.resetValidation()
            getclients()
        }
    }
}
</script>

<style lang="sass">
.my-sticky-header-table
  height: 410px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    background-color:#d35ae7

  thead tr th
    position: sticky
    z-index: 1

  thead tr:first-child th
    top: 0

  &.q-table--loading thead tr:last-child th
    top: 48px

  tbody
    scroll-margin-top: 48px
</style>