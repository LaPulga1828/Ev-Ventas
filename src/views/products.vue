<template>

    <div class="q-pa-md">
        <div class="text-center">
            <div style="margin-bottom: 30px">
                <h2 style="margin: 0; color: cornflowerblue">Productos</h2>
            </div>
            <div class="q-mb-md flex justify-end">
                <q-btn color="primary" icon="add" label="Agregar Producto" @click="createProduct" />
            </div>
        </div>
        
        <q-table class="my-sticky-header-table" flat bordered title="Productos" :rows="rows" :columns="columns"
            row-key="name">
            <template v-slot:body-cell-opciones="props">
                <q-td :props="props">
                    <div style="display: flex; justify-content: space-evenly; align-items: center;">
                        <div>
                            <q-btn icon="edit" color="primary" @click="editProduct(props.row)" />
                        </div>
                        <div v-if="props.row.active == true">
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

                <q-form ref="productForm" @submit.prevent="onSubmit" class="q-gutter-md">
                    <q-input filled v-model="product.name" label="name *" @blur="product.name = product.name.trim()"
                        :rules="[val => !!val || 'El name es requerido',
                        val => val.length >= 2 || 'El name debe tener al menos 2 caracteres',
                        val => val.trim() === val || 'No debe comenzar ni terminar con espacios']" />
                    <!-- <q-input filled v-model="product.category" @blur="product.category = product.category.trim()"
                        label="category *"
                        :rules="[val => !!val || 'La category es requerida', 
                        val => val.trim() === val || 'No debe comenzar ni terminar con espacios']" /> -->
                    <q-select filled v-model="product.category" :options="[
                        'Electronics',
                        'Clothing',
                        'Home & Kitchen',
                        'Sports & Outdoors',
                        'Health & Personal Care',
                        'Books',
                        'Toys & Games',
                        'Technology',
                        'Cosmetics',
                        'Services'
                    ]" label="category *" :rules="[val => !!val || 'La category es requerida']" />
                    <q-input filled v-model.number="product.price" label="price *" type="number" :rules="[val => val !== null && val !== '' || 'El price es requerido',
                    val => val > 0 || 'El price debe ser mayor a 0',]" />
                    <q-input filled v-model.number="product.quantity" label="quantity *" type="number" :rules="[val => val !== null && val !== '' || 'La cantidad es requerida',
                    val => val >= 0 || 'La cntidad no puede ser negativo']" />
                    <q-input filled v-model="product.description"
                        @blur="product.description = product.description.trim()" label="description *" :rules="[val => !!val || 'La description es requerida',
                        val => val.trim() === val || 'No debe comenzar ni terminar con espacios']" />

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
const product = ref({
    name: '',
    category: '',
    price: null,
    quantity: null,
    active: true
})

const prompt = ref(false)
const productForm = ref(null)

const title = ref('Crear Producto')


onBeforeMount(() => {
    getProducts();
});

const columns = [
    { name: 'name', label: 'name', align: 'left', field: row => row.name, sortable: true },
    { name: 'category', align: 'center', label: 'Categoria', field: 'category', sortable: true },
    { name: 'price', align: 'center', label: 'price', field: 'price', sortable: true },
    { name: 'quantity', align: 'center', label: 'quantity', field: 'quantity', sortable: true },
    { name: 'description', align: 'center', label: 'description', field: 'description' },
    { name: 'active', align: 'center', label: 'active', field: 'active', sortable: true },
    { name: 'opciones', align: 'center', label: 'Opciones' },
]

async function getProducts() {
    $q.loading.show({ message: 'Cargando productos...' })
    try {
        const res = await getData('/products/listProduct')
        if (res) {
            rows.value = res.products

        }
        console.log(res);
        console.log(rows.value);

    } catch (error) {

        console.error('Error fetching data:', error)
        $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'error',
            message: error.reponse.data.msg + 'Error al cargar los productos'
        })
    }
    finally {
        $q.loading.hide()
    }
}


async function activaranddesactivar(id, estatus) {
    let msg
    let data
    if (estatus) {
        msg = "Desactivando"
        data = { active: false }
    } else {
        msg = "Activando"
        data = { active: true }
    }
    $q.loading.show({ message: `${msg} producto...` })
    console.log(id);
    try {
        let res = await putData(`products/updateActive/${id}`, data);
        console.log(res);
        getProducts()

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

// async function desactivar(id) {
//     $q.loading.show({ message: 'Desactivando producto...' })
//     console.log(id);

//     try {
//         let res = await putData(`productos/desactivarProducto/${id}`);
//         console.log(res);
//         getProducts()
//         $q.notify({
//             color: 'positive',
//             icon: 'check',
//             message: 'Producto desactivado correctamente!'
//         })
//     } catch (error) {
//         console.log("err: " + error);
//         $q.notify({
//             color: 'red-5',
//             textColor: 'white',
//             icon: 'error',
//             message: 'Error al desactivar el producto'
//         })
//     }
//     finally {
//         $q.loading.hide()
//     }
// }

async function edit() {
    $q.loading.show({ message: 'Actualizando producto...' })
    try {
        // Crear objeto sin el campo activate para el backend
        const productData = {
            name: product.value.name,
            category: product.value.category,
            price: product.value.price,
            quantity: product.value.quantity,
            description: product.value.description
        }

        const res = await putData(`/products/updateProduct/${product.value._id}`, productData)
        console.log('Producto actualizado:', res)

        $q.notify({
            color: 'positive',
            icon: 'check',
            message: res.msg + ' correctamente!'
        })
        title.value = 'Crear Producto'
        return true
    } catch (error) {
        console.error('Error updating product:', error)
        $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'error',
            message: error.response.data.errors?.[0]?.msg || error.response.data.msg || 'Error al actualizar el producto'
        })
        return false
    }
    finally {
        $q.loading.hide()
    }
}

function editProduct(row) {
    title.value = 'Editar Producto'
    product.value = { ...row }
    prompt.value = true
}

function createProduct() {
    title.value = 'Crear Producto'
    product.value = {
        _id: "",
        name: '',
        category: '',
        price: null,
        quantity: null,
        activate: true,
    }
    prompt.value = true
}

async function create() {
    $q.loading.show({ message: 'Creando producto...' })
    try {
        const productData = {
            name: product.value.name,
            category: product.value.category,
            price: product.value.price,
            description: product.value.description,
            quantity: product.value.quantity
        }

        const res = await postData(`/products/addProduct`, [productData])
        console.log('Producto creado:', res)

        $q.notify({
            color: 'positive',
            icon: 'check',
            message: 'Producto creado correctamente!'
        })
        title.value = 'Crear Producto'
        return true
    } catch (error) {
        console.error('Error create product:', error)
        $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'error',
            //error.response.data.msg || error.response.data.errors[0].msg
            message: error.response.data.errors?.[0]?.msg || error.response.data.msg || 'Error al crear producto'
        })
        return false
    }
    finally {
        $q.loading.hide()
    }
}



async function onSubmit() {
    const isValid = await productForm.value.validate()

    if (!isValid) {
        $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'error',
            message: 'Por favor complete todos los campos correctamente'
        })
        return
    }

    if (product.value._id != "") {
        const success = await edit()
        if (success) {
            prompt.value = false
            productForm.value.resetValidation()
            getProducts()
        }
    } else {
        const success = await create()
        if (success) {
            prompt.value = false
            productForm.value.resetValidation()
            getProducts()
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

</style>