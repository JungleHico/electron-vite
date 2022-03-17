<template>
  <a-form
    layout="horizontal"
    :label-col="{ span: 4 }"
    :wrapper-col="{ span: 16 }"
    ref="formRef"
    :model="formState">
    <a-form-item
      label="关闭主窗口"
      name="closeAction">
      <a-radio-group
        v-model:value="formState.closeAction"
        :options="closeOptions"
        @change="onChangeCloseAction">
      </a-radio-group>
    </a-form-item>
    <a-form-item label="保存路径">
      <a-input v-model:value="formState.savePath" readonly @click="onSelectSavePath"></a-input>
    </a-form-item>
    <a-form-item
      label="截图快捷键"
      name="screenshotKey1"
      :rules="[{ validator: validateScreenshotKey, message: '快捷键无效' }]">
      <a-select
        v-model:value="formState.screenshotKey1"
        class="select">
        <a-select-option
          v-for="key in keyCodeList1"
          :key="key"
          :value="key">
          {{ key }}
        </a-select-option>
      </a-select>
      +
      <a-select
        v-model:value="formState.screenshotKey2"
        class="select"
        @change="onSelectScreenshotKey2">
        <a-select-option
          v-for="key in keyCodeList2"
          :key="key"
          :value="key">
          {{ key }}
        </a-select-option>
      </a-select>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
export default {
  name: 'Setting'
}
</script>

<script setup lang="ts">
import { keyCodeList1, keyCodeList2 } from '../utils/keyCode'
// import { RuleObject } from 'ant-design-vue/es/form/interface'

interface FormState {
  closeAction: string,
  savePath: string,
  screenshotKey1: string,
  screenshotKey2: string
}
interface RadioOption {
  label: string,
  value: string
}

// 表单
const formRef = ref()
const formState = reactive<FormState>({
  closeAction: '',
  savePath: '',
  screenshotKey1: '',
  screenshotKey2: ''
})

// 关闭窗口
const closeOptions = reactive<RadioOption[]>([
  { label: '退出程序', value: 'quit' },
  { label: '最小化到托盘', value: 'tray' }
])
// @ts-ignore
window.deskCapturer.getCloseAction().then(res => {
  // 从主进程中获取本地缓存值
  formState.closeAction = res
})
const onChangeCloseAction = () => {
  // @ts-ignore
  window.deskCapturer.setCloseAction(formState.closeAction)
}

// 保存路径
// @ts-ignore
window.deskCapturer.getSavePath().then(res => {
  formState.savePath = res
})
const onSelectSavePath = () => {
  // @ts-ignore
  window.deskCapturer.setSavePath().then(res => {
    if (res) {
      formState.savePath = res
    }
  })
}

// 截图快捷键
// @ts-ignore
window.deskCapturer.getScreenshotShortcut()
  .then((res: string) => {
    const keys = res.split('+')
    keys.forEach(key => {
      if (keyCodeList1.includes(key)) {
        formState.screenshotKey1 = key
      } else if (keyCodeList2.includes(key)) {
        formState.screenshotKey2 = key
      }
    })
  })
// 组合快捷键
const screenshotKeyCode = computed(() => {
  if (formState.screenshotKey1 === '' && formState.screenshotKey2 === '') {
    return ''
  }
  if (formState.screenshotKey1 !== '' && formState.screenshotKey2 !== '') {
    return `${formState.screenshotKey1}+${formState.screenshotKey2}`
  }
  if (formState.screenshotKey1 === '') {
    return formState.screenshotKey2
  }
  return formState.screenshotKey1
})
const validateScreenshotKey = async () => {
  // @ts-ignore
  const result = await window.deskCapturer.setScreenshotShortcut(screenshotKeyCode.value)
  if (!result) {
    return Promise.reject('快捷键无效')
  }
}
const onSelectScreenshotKey2 = () => {
  formRef.value.validateFields()
}
</script>

<style scoped>
.select {
  width: 128px;
}
</style>
