<script lang="ts" setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import VideoPlayer from '../../components/VideoPlayer.vue'

const videoLink = ref<string>(
  'http://218.6.242.123:18000/group1/M00/00/0F/rBDYiWPktKGAI_NXFMozoIwsayI436.mp4'
)

const videoOptions = reactive({
  autoplay: true,
  controls: true,
  sources: [
    {
      src: 'http://218.6.242.123:18000/group1/M00/00/0F/rBDYiWPktKGAI_NXFMozoIwsayI436.mp4',
      type: 'video/mp4',
    },
  ],
})

onMounted(async () => {})
onUnmounted(() => {})
</script>

<template>
  <div>
    <video-player :options="videoOptions" />
  </div>
</template>
