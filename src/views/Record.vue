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

<script lang="ts">
export default {
  name: 'Record'
}
</script>

<script setup lang="ts">
import {
  VideoCameraFilled,
  PoweroffOutlined
} from '@ant-design/icons-vue'
import getFormattedTime from '../utils/getFormatteTime'

const recording = ref<boolean>(false)
const recordButtonText = computed(() => recording.value ? '暂停' : '开始/继续')
const seconds = ref<number>(0)
const formattedTime = computed<string>(() => getFormattedTime(seconds.value))
let timer: NodeJS.Timeout | null = null
let recorder: MediaRecorder | null = null

const setTimer = () => {
  timer = setInterval(() => {
    seconds.value++
  }, 1000)
}
const clearTimer = () => {
  clearInterval(<NodeJS.Timeout>timer)
  seconds.value = 0
}
const pauseTimer = () => {
  clearInterval(<NodeJS.Timeout>timer)
}

// 创建视频流
const createStream = async (sourceId: string): Promise<MediaStream> => {
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

// 创建媒体录制对象
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
      const dataView = new DataView(<ArrayBuffer>reader.result)
      // @ts-ignore
      window.deskCapturer.stopRecord(dataView)
    }
  } 
  return recorder
}

const onRecord = async () => {
  if (recording.value) {
    recording.value = false
    pauseTimer()
  } else {
    if (!recorder) {
      // 开始
      // @ts-ignore
      const sourceId: string = await window.deskCapturer.startRecord()
      const stream: MediaStream = await createStream(sourceId)
      recorder = createRecorder(stream)
    } else {
      // 继续
      recorder.resume()
    }
    recording.value = true
    setTimer()
  }
}
const onStop = () => {
  if (recorder) {
    recorder.stop()
    recorder = null
  }
  recording.value = false
  clearTimer()
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
