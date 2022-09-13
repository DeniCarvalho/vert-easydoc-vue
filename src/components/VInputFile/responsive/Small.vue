<template>
  <div
    class="ved-w-full ved-h-auto ved-flex ved-items-center ved-justify-start"
    @mouseenter="start"
    @mouseleave="reverse"
    @dragover.prevent="start"
    @dragleave.prevent="reverse"
  >
    <lottie-animation
      id="anim-ref-ved"
      ref="animRef"
      :loop="false"
      :autoPlay="false"
      :speed="1"
      :animationData="animationData"
      @complete="complete"
      class="ved-h-8"
    />

    <div
      class="ved-flex ved-w-full ved-justify-between ved-items-center ved-pl-1"
    >
      <div class="ved-text-primary ved-text-center ved-text-xs">
        <span class="ved-cursor-pointer ved-font-bold ved-text-primaryPure">
          {{ browserLink }}
        </span>
        {{ dragDrop }}
      </div>

      <div id="info-icon-ved" class="ved-cursor-pointer ved-pr-1">
        <div class="icon-ved ved-absolute ved-z-50 ved-text-xs">&#8505;</div>
        <div class="blob-ved color-ved ved-relative ved-z-40"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import animationData from '@/assets/animation/upload-file.json';
export default defineComponent({
  props: {
    browserLink: {
      type: String,
      required: true,
    },
    dragDrop: {
      type: String,
      required: true,
    },
    supportedTypesLabel: {
      type: String,
      required: true,
    },
    supportedTypesSettings: {
      type: String,
      required: true,
    },
    maxSizeLabel: {
      type: String,
      required: true,
    },
    maxSizeSettings: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const animRef = ref<any>(null);

    const start = () => {
      emit('hover', true);
      animRef.value?.setDirection(1);
      animRef.value?.play();
    };
    const complete = () => {
      animRef.value?.pause();
    };

    const reverse = () => {
      emit('leave', false);
      animRef.value?.setDirection(-1);
      animRef.value?.play();
    };

    return {
      animRef,
      animationData,
      start,
      complete,
      reverse,
    };
  },
});
</script>
