<template>
  <div class="layout-main">
    <sidebar class="sidebar"></sidebar>
    <main class="main">
      <router-view #default="{ Component }">
        <keep-alive>
          <component :is="Component"></component>
        </keep-alive>
      </router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './Sidebar.vue'
</script>

<style scoped>
.layout-main {
  display: flex;
}
.sidebar {
  width: 200px;
  height: 100vh;
  overflow: auto;
}
.main {
  flex: 1;
  padding: 16px;
}
</style>
