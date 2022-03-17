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

<script lang="ts">
export default {
  name: 'Screenshot'
}
</script>

<script setup lang="ts">
import { ScissorOutlined } from '@ant-design/icons-vue'
import 'ant-design-vue/es/notification/style/css'

const onScreenshot = () => {
  //@ts-ignore
  window.deskCapturer.screenshot()
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
