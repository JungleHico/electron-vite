<template>
  <div>
    <a-button type="primary" @click="onScreenshot">
      <template #icon>
        <scissor-outlined></scissor-outlined>
      </template>
      截图
    </a-button>
  </div>
</template>

<script setup lang="ts">
import { ScissorOutlined } from '@ant-design/icons-vue'

const onScreenshot = async () => {
  // @ts-ignore
  const display = await window.desktopCapturer.screenshot()
}
</script>

<style scoped>
.form {
  margin-top: 16px;
}
.select {
  width: 64px;
}
</style>
