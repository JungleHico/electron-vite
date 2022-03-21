<template>
  <a-menu
    v-model:selectedKeys="selectedKeys"
    class="menu"
    mode="inline"
    theme="dark"
    @select="onSelectItem">
    <a-menu-item key="/screenshot">
      <template #icon><file-image-filled /></template>
      <span>截图</span>
    </a-menu-item>
    <a-menu-item key="/record">
      <template #icon><video-camera-filled /></template>
      <span>录屏</span>
    </a-menu-item>
    <a-menu-item key="/setting">
      <template #icon><setting-filled /></template>
      <span>设置</span>
    </a-menu-item>
  </a-menu>
</template>

<script setup lang="ts">
import {
  FileImageFilled,
  VideoCameraFilled,
  SettingFilled
} from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'

const selectedKeys = reactive<string[]>(['/screenshot'])
const router = useRouter()

const onSelectItem = ({ key }: { key: string }) => {
  selectedKeys.splice(0, 1, key)
  router.push(key)
}
</script>