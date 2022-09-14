<template>
  <div
    class="ved-w-full ved-h-auto ved-flex ved-flex-col sm:ved-flex-row ved-items-center ved-justify-start"
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
      class="ved-h-14"
    />

    <div
      class="ved-flex ved-flex-col ved-justify-start ved-pl-1 ved-items-center sm:ved-items-start"
    >
      <div class="ved-text-black ved-text-center ved-text-xs">
        <span class="ved-cursor-pointer ved-font-bold ved-text-primaryPure">
          {{ browserLink }}
        </span>
        {{ dragDrop }}
      </div>
      <div class="ved-text-fontLight ved-text-xxs ved-text-center">
        {{ supportedTypesLabel }}:
        {{ supportedTypesSettings }}
      </div>
      <div class="ved-text-fontLight ved-text-xxs ved-text-center">
        {{ maxSizeLabel }}:
        {{ maxSizeSettings }}
      </div>
    </div>

    <div
      id="info-icon-ved"
      class="ved-absolute ved-top-2 ved-right-2 ved-cursor-pointer"
      v-on:click.prevent="$emit('openInfo')"
    >
      <Icon
        :icon="Information"
        class="ved-text-primaryPure icon-ved ved-p-0 ved-m-0 ved-z-50 ved-absolute"
        :size="18"
      />
      <div class="blob-ved ved-relative ved-z-40"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Icon } from '@/widgets';
import Information from 'vue-material-design-icons/Information.vue';
import animationData from '@/assets/animation/upload-file.json';
export default defineComponent({
  components: {
    Icon,
  },
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
      Information,
    };
  },
});
</script>
