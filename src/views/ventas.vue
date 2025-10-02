<template>
    <div class="q-pa-md">
        <div class="text-center">
            <div style="margin-bottom: 30px">
                <h2 style="margin: 0; color: cornflowerblue">Ventas</h2>
            </div>
            <div class="q-mb-md flex justify-end">
                <q-btn color="primary" icon="add" label="Agregar Venta" @click="abrirModalAgregar" />
            </div>
        </div>


        <q-table class="my-sticky-header-table" title="Ventas" :rows="rows" :columns="columns" row-key="_id" flat
            bordered>
            <!-- Acciones -->
            <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                    <div style="display: flex; justify-content: space-evenly; align-items: center;">
                        <q-btn dense round flat icon="visibility" color="primary" @click="verDetalle(props.row)" />

                        
                        <div v-if="props.row.active == 1">
                            <q-btn @click="active(props.row)" icon="cancel" color="red" size="sm" round dense />
                        </div>
                        <div v-else>
                            <q-btn @click="active(props.row)" icon="check_circle" color="green" size="sm" round
                                dense />
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

        <!-- Modal Agregar Venta -->
        <q-dialog v-model="modalVenta">
            <q-card style="min-width: 800px">
                <q-card-section class="row items-center q-pb-none">
                    <div class="text-h6">➕ Agregar Venta</div>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>

                <q-form @submit.prevent="agregarVenta">
                    <q-card-section>

                        <q-select v-model="salesForm.customerId" :options="clientes" option-label="name"
                            option-value="_id" emit-value map-options label="Cliente"
                            :rules="[val => !!val || 'El cliente es requerido']" />

                        <q-separator class="q-my-md" />

                        <div class="text-h6 q-mb-md">📦 Productos</div>

                        <div class="row q-gutter-md q-mb-md">

                            <div class="col-5">
                                <q-select v-model="nuevoProducto.productId" :options="productos" option-label="name"
                                    option-value="_id" emit-value map-options label="Producto" />
                            </div>

                            <div class="col-3">
                                <q-input v-model.number="nuevoProducto.quantity" type="number" label="Cantidad"
                                    min="1" />
                            </div>

                            <div class="col-2">
                                <q-btn color="primary" icon="add" label="Agregar" @click="agregarProductoALista"
                                    :disable="!nuevoProducto.productId || !nuevoProducto.quantity || nuevoProducto.quantity <= 0" />
                            </div>
                        </div>

                        <q-table class="my-sticky-header-table q-mb-md" v-if="salesForm.products.length > 0"
                            :rows="salesForm.products" :columns="productosVentaColumns" row-key="productId" flat
                            bordered>
                            <template v-slot:body-cell-actions="props">
                                <q-td :props="props">
                                    <q-btn dense round flat icon="delete" color="red"
                                        @click="eliminarProductoDeLista(props.rowIndex)" />
                                </q-td>
                            </template>
                        </q-table>


                        <div class="text-right text-h6 q-mt-md">
                            <strong>Total: ${{ calcularTotal() }}</strong>
                        </div>
                    </q-card-section>

                    <q-card-actions align="right">
                        <q-btn flat label="Cancelar" color="negative" v-close-popup />
                        <q-btn flat label="Agregar Venta" color="positive" type="submit"
                            :disable="salesForm.products.length === 0" />
                    </q-card-actions>
                </q-form>
            </q-card>
        </q-dialog>


        <q-dialog v-model="modalDetalle" persistent>
            <q-card style="min-width: 700px">

                <q-card-section class="row items-center q-pb-none">
                    <div class="text-h6">📦 Detalle de la Venta</div>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>

                <q-card-section class="q-pt-xs q-pb-sm">
                    <div class="q-gutter-y-xs">
                        <div class="text-subtitle2">
                            <q-icon name="receipt_long" color="primary" class="q-mr-xs" />
                            <strong>Factura ID:</strong> {{ ventaSeleccionada?._id || 'N/A' }}
                        </div>

                        <div class="text-subtitle2">
                            <q-icon name="person" color="accent" class="q-mr-xs" />
                            <strong>Cliente:</strong> {{ ventaSeleccionada?.customerId?.name || 'Cliente Desconocido' }}
                        </div>

                        <div class="text-subtitle2">
                            <q-icon name="event" color="teal" class="q-mr-xs" />
                            <strong>Fecha:</strong> {{ ventaSeleccionada?.createdAt ? $q.platform.is.desktop ?
                                date.formatDate(ventaSeleccionada.createdAt, 'DD/MM/YYYY hh:mm A') :
                                date.formatDate(ventaSeleccionada.createdAt, 'DD/MM/YYYY') : 'N/A' }}
                        </div>
                    </div>
                </q-card-section>
                <q-separator />

                <q-card-section>
                    <q-table class="my-sticky-header-table" :rows="ventaSeleccionada?.products || []"
                        :columns="detalleColumns" row-key="productId._id" flat bordered />

                    <div class="text-right text-subtitle1 q-mt-md">
                        <strong>Total: ${{ (ventaSeleccionada?.totalPrice || 0).toFixed(2) }}</strong>
                    </div>
                </q-card-section>
            </q-card>
        </q-dialog>
    </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { useQuasar, date } from "quasar";
import { getData, postData, putData } from "../services/apiClient.js";

const $q = useQuasar();

const rows = ref([]);
const modalVenta = ref(false);
const modalDetalle = ref(false)
const ventaSeleccionada = ref(null)
const clientes = ref([])
const productos = ref([])

const salesForm = ref({
    customerId: "",
    products: []
})

const nuevoProducto = ref({
    productId: "",
    quantity: 1
})

const columns = [
    { name: "numero", label: "N° Venta", field: "_id", align: "left" },
    {
        name: "cliente",
        label: "Cliente",
        field: row => row.customerId?.name || "N/A",
        align: "left",
        sortable: true
    },
    {
        name: 'fechaVenta',
        label: 'Fecha de Venta',
        align: 'center',
        field: 'createdAt',
        format: val => val ? date.formatDate(val, 'DD-MMM-YYYY') : 'N/A',
        sortable: true
    },
    {
        name: "cantidadProductos",
        label: "Cantidad Total de Productos",
        field: row => row.products.reduce((total, product) => total + product.quantity, 0),
        align: "center",
        sortable: true
    },
    
    {
        name: "total",
        label: "Total",
        field: row => `$${(row.totalPrice || 0)}`,
        align: "right",
        sortable: true
    },
    { name: 'active', label: 'Estado', align: 'center', field: 'active', sortable: true },
    { name: "actions", label: "Acciones ⚙", field: "acciones", align: "center" }
];

const detalleColumns = [
    {
        name: "producto",
        label: "Producto",
        field: row => row.productId?.name || "N/A",
        align: "left"
    },
    { name: "cantidad", label: "Cantidad", field: "quantity", align: "center" },
    {
        name: "precio",
        label: "Precio Unitario",
        field: row => `$${(row.productId?.price || 0)}`,
        align: "center"
    },
    {
        name: "subtotal",
        label: "Subtotal",
        field: row => `$${((row.productId?.price || 0) * (row.quantity || 0))}`,
        align: "center"
    }
];

const productosVentaColumns = [
    {
        name: "producto",
        label: "Producto",
        field: row => getProductoNombre(row.productId),
        align: "left"
    },
    { name: "cantidad", label: "Cantidad", field: "quantity", align: "center" },
    {
        name: "precio",
        label: "Precio Unitario",
        field: row => `$${getProductoPrecio(row.productId)}`,
        align: "center"
    },
    {
        name: "subtotal",
        label: "Subtotal",
        field: row => `$${(row.quantity * getProductoPrecio(row.productId))}`,
        align: "center"
    },
    { name: "actions", label: "Acciones", field: "actions", align: "center" }
];


// Cargar ventas
async function cargarVentas() {
    $q.loading.show({ message: 'Cargando ventas...' })
    try {
        const data = await getData("/sales/listSale");
        rows.value = data.sales;
        console.log("✅ Ventas recibidas:", data.sales);
    } catch (err) {
        console.error("❌ Error cargando ventas:", err.response?.data || err.message);
        $q.notify({ type: "negative", message: err.response?.data?.message || "Error al cargar ventas" });
    }
    finally {
        $q.loading.hide()
    }
}

async function cargarClientes() {
    $q.loading.show({ message: 'Cargando datos...' })
    try {
        const data = await getData("customers/listCustomer")
        clientes.value = data.customers || []
    } catch (error) {
        $q.notify({
            type: "negative",
            message: error?.response?.data?.message || "Error al cargar clientes"
        })
    }
    finally {
        $q.loading.hide()
    }
}

async function cargarProductos() {
    $q.loading.show({ message: 'Cargando datos...' })
    try {
        const data = await getData("/products/listProduct")
        productos.value = data.products || []
    } catch (error) {
        $q.notify({
            type: "negative",
            message: error?.response?.data?.message || "Error al cargar productos"
        })
    }
    finally {
        $q.loading.hide()
    }
}

function verDetalle(venta) {
    ventaSeleccionada.value = venta   // guardamos la venta seleccionada
    modalDetalle.value = true         // abrimos modal
}

// Abrir modal
function abrirModalAgregar() {
    salesForm.value = { customerId: "", products: [] };
    nuevoProducto.value = { productId: "", quantity: 1 };
    modalVenta.value = true;
}


function getProductoNombre(productId) {
    const producto = productos.value.find(p => p._id === productId);
    return producto?.name || "N/A";
}

function getProductoPrecio(productId) {
    const producto = productos.value.find(p => p._id === productId);
    return producto?.price || 0;
}

// Agregar producto a la lista
function agregarProductoALista() {
    if (!nuevoProducto.value.productId || !nuevoProducto.value.quantity || nuevoProducto.value.quantity <= 0) {
        $q.notify({ type: "negative", message: "Por favor selecciona un producto y una cantidad válida" });
        return;
    }

    // Verificar si el producto ya está en la lista
    const productoExistente = salesForm.value.products.find(p => p.productId === nuevoProducto.value.productId);
    if (productoExistente) {
        // Si existe, sumar la cantidad
        productoExistente.quantity += nuevoProducto.value.quantity;
    } else {
        // Si no existe, agregarlo
        salesForm.value.products.push({
            productId: nuevoProducto.value.productId,
            quantity: nuevoProducto.value.quantity
        });
    }

    nuevoProducto.value = { productId: "", quantity: 1 };
    $q.notify({ type: "positive", message: "Producto agregado a la venta" });
}

function eliminarProductoDeLista(index) {
    salesForm.value.products.splice(index, 1);
    $q.notify({ type: "positive", message: "Producto eliminado de la venta" });
}

function calcularTotal() {
    const total = salesForm.value.products.reduce((total, item) => {
        const precio = getProductoPrecio(item.productId);
        return total + (item.quantity * precio);
    }, 0);
    return total.toFixed(2);
}


async function agregarVenta() {
    try {
        if (salesForm.value.products.length === 0) {
            $q.notify({ type: "negative", message: "Debes agregar al menos un producto a la venta" });
            return;
        }

        const payload = {
            customerId: salesForm.value.customerId,
            products: salesForm.value.products
        };

        await postData("/sales/addSale", payload);

        $q.notify({ type: "positive", message: "✅ Venta agregada correctamente" });
        modalVenta.value = false;
        cargarVentas();
    } catch (error) {
        console.error("❌ Error agregar venta:", error.response?.data || error.message);
        $q.notify({ type: "negative", message: error.response?.data?.message || "Error al agregar venta" });
    }
}

// Activar/Inactivar venta
async function active(venta) {
    try {
        await putData(`/sales/updateActive/${venta._id}`, { active: venta.active ? 0 : 1 });
        $q.notify({ type: "positive", message: `Estado cambiado: ${venta.active ? "Inactiva ❌" : "Activa ✅"}` });
        cargarVentas();
    } catch (error) {
        console.error("❌ Error actualizar estado:", error.response?.data || error.message);
        $q.notify({ type: "negative", message: error.response?.data?.message || "Error al cambiar estado" });
    }
}



onMounted(() => {
    cargarVentas();
    cargarClientes();
    cargarProductos();
});
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