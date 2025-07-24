<script setup lang="ts">
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@renderer/components/ui/resizable'
</script>

<template>
  <ResizablePanelGroup
    id="handle-demo-group-1"
    direction="horizontal"
    class="min-h-[200px] max-w-md rounded-lg border"
  >
    <ResizablePanel id="handle-demo-panel-1" :default-size="30" :min-size="30" :max-size="70">
      <slot name="left" />
    </ResizablePanel>
    <ResizableHandle id="handle-demo-handle-1" with-handle />
    <ResizablePanel id="handle-demo-panel-2" :default-size="70" :min-size="30" :max-size="70">
      <slot name="right" />
    </ResizablePanel>
  </ResizablePanelGroup>
</template>
