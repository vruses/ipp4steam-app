<script lang="ts">
export const description = 'A sidebar that collapses to icons.'
export const iframeHeight = '800px'
export const containerClass = 'w-full h-full'
</script>

<script setup lang="ts">
import AppMain from '@renderer/components/main/AppMain.vue'
import AppHeaderBar from '@renderer/components/headerbar/AppHeaderBar.vue'
</script>

<template>
  <!-- 头部 -->
  <header class="shadow-md fixed top-0 left-0 right-0 z-10">
    <AppHeaderBar></AppHeaderBar>
  </header>
  <div class="flex-1 p-10 pb-0">
    <!-- 内容区域 -->
    <main class="">
      <AppMain></AppMain>
    </main>
  </div>
</template>
