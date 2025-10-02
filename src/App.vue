<template>
  <div>
    <q-layout view="hHh lpR fff">

      <q-header elevated class="bg-primary text-white">
        <q-toolbar>
          <q-toolbar-title>
            <q-avatar to="/" >
              <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
            </q-avatar>
            Title
          </q-toolbar-title>

          <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
        </q-toolbar>
      </q-header>

      <q-drawer style="display: flex; flex-direction: column; gap: 5px;" v-model="rightDrawerOpen" side="right" overlay
        behavior="mobile">
        <!-- drawer content -->
        <q-btn color="purple" label="Products" to="/products" />
        <!-- <q-btn color="purple" label="Profe" to="/profe" /> -->
        <q-btn color="purple" label="clients" to="/clientes" />
        <q-btn color="purple" label="ventas" to="/ventas" />
      </q-drawer>

      <q-page-container>
        <router-view />
      </q-page-container>

      <q-footer elevated class="bg-grey-8 text-white">
        <q-toolbar>
          <q-toolbar-title>
            <q-avatar>
              <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
            </q-avatar>
            <div>Title</div>
          </q-toolbar-title>
        </q-toolbar>
      </q-footer>

    </q-layout>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const rightDrawerOpen = ref(false)
function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value
}
</script>