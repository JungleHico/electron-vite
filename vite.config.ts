import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 自动导入Vue3组合式API（使用setup语法糖）
    AutoImport({
      imports: ['vue'],
      dts: 'src/auto-imports.d.ts'
    }),
    // 自动导入组件库
    Components({
      resolvers: [
        AntDesignVueResolver()
      ]
    })
  ]
})
