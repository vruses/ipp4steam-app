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
  <div class="h-screen flex flex-col">
    <!-- Header 固定，不受滚动影响 -->
    <header class="fixed top-0 left-0 right-0 z-10 h-auto shadow-md">
      <AppHeaderBar />
    </header>

    <!-- 内容区域，设置 padding-top 留出 header 空间 -->
    <div class="flex-1 overflow-hidden">
      <main class="h-full overflow-y-auto pb-0">
        <AppMain />
      </main>
    </div>
  </div>
</template>
