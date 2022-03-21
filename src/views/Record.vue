<template>
  <a-space size="middle">
    <a-button
      class="btn-record"
      type="primary"
      @click="onRecord">
      <template #icon>
        <video-camera-filled></video-camera-filled>
      </template>
      {{ recordButtonText }}
    </a-button>
    <a-button
      danger
      :disabled="seconds === 0"
      @click="onStop">
      <template #icon>
        <poweroff-outlined></poweroff-outlined>
      </template>
      停止
    </a-button>
    <span class="time">{{ formattedTime }}</span>
  </a-space>
</template>

<script setup lang="ts">
import {
  VideoCameraFilled,
  PoweroffOutlined
} from '@ant-design/icons-vue'
import { getFormattedTime } from '../utils/time'

const recording = ref<boolean>(false)     // 是否正在录制
const recordButtonText = computed<string>(() => recording.value ? '暂停' : '开始/继续')
const seconds = ref<number>(0)            // 录制时长
const formattedTime = computed<string>(() => getFormattedTime(seconds.value))
let timer: NodeJS.Timeout | null = null   // 定时器
let recorder: MediaRecorder | null = null // 媒体录制容器

// 开始/暂停/继续
const onRecord = async () => {
  if (recording.value) {
    // 正在录制，点击暂停
    recording.value = false
    pauseTimer()
  } else {
    if (!recorder) {
      // 未录制，点击开始
      // @ts-ignore
      const sourceId: string = await window.desktopCapturer.startRecord()
      const stream: MediaStream = await getStream(sourceId)
      recorder = createRecorder(stream)
    } else {
      // 已暂停，点击继续
      recorder.resume()
    }
    recording.value = true
    setTimer()
  }
}
// 停止
const onStop = () => {
  if (recorder) {
    recorder.stop()
    recorder = null
  }
  recording.value = false
  clearTimer()
}

// 计时器相关
function setTimer() {
  timer = setInterval(() => {
    seconds.value++
  }, 1000)
}
function clearTimer() {
  clearInterval(<NodeJS.Timeout>timer)
  seconds.value = 0
}
function pauseTimer() {
  clearInterval(<NodeJS.Timeout>timer)
}

// 获取音视频流
async function getStream(sourceId: string): Promise<MediaStream> {
  const stream = await navigator.mediaDevices.getUserMedia(<MediaStreamConstraints>{
    audio: {
      mandatory: {
        chromeMediaSource: 'desktop'
      }
    },
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: sourceId
      }
    }
  })
  return stream
}

// 创建媒体录制器
const createRecorder = (stream: MediaStream): MediaRecorder => {
  const recorder = new MediaRecorder(stream)
  recorder.start()
  recorder.ondataavailable = e => {
    const blob = new Blob([e.data], {
      type: 'video/mp4'
    })
    const reader = new FileReader()
    reader.readAsArrayBuffer(blob)
    reader.onload = () => {
      const arrayBuffer = reader.result
      const data = new DataView(<ArrayBuffer>arrayBuffer)
      // @ts-ignore
      window.desktopCapturer.stopRecord(data)
    }
  } 
  return recorder
}
</script>

<style scoped>
.btn-record {
  width: 128px;
}
.time {
  font-size: 20px;
}
</style>
