<template>
  <div
    id="step-container-ved"
    v-if="isOpen"
    class="ved-backdrop-blur-md"
    :class="{ 'out-ved': outAnimate, 'animated-ved': isOpen }"
  >
    <div class="modal-background-ved">
      <div class="modal-ved" :class="{ 'ved-h-full ved-w-full': fullscreen }">
        <div
          class="ved-bg-white"
          :class="{
            'ved-max-w-2xl ved-h-auto ved-rounded-md ved-p-6 ved-shadow-xl':
              !fullscreen,
            'ved-w-full ved-h-full': fullscreen,
          }"
        >
          <div
            class="ved-flex ved-items-center ved-justify-between"
            v-if="!fullscreen"
          >
            <h3 class="ved-text-2xl">{{ document?.name }}</h3>
            <svg
              @click="close"
              xmlns="http://www.w3.org/2000/svg"
              class="ved-w-8 ved-h-8 ved-text-red-900 ved-cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div
            class=""
            :class="{
              'ved-w-full ved-h-full': fullscreen,
              'ved-mt-4': !fullscreen,
            }"
          >
            <component
              v-bind:is="step"
              @next="next"
              @close="close"
              :file="document"
            ></component>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" src="./Steps.scss" />
<script lang="ts">
import { IDocument } from '@/models/document.model';
import { defineComponent, nextTick, ref } from 'vue';
import Icon from '@/widgets/Icon/Icon.vue';
export default defineComponent({
  components: { Icon },
  props: {
    file: {
      required: false,
    },
    step: { required: true },
    fullscreen: { default: false },
  },
  setup(props, { emit }) {
    const document = ref<IDocument>();
    document.value = props.file as IDocument;

    const isOpen = ref(false);
    const outAnimate = ref(false);

    const open = () => {
      nextTick(() => {
        emit('onOpen');
        if (props.file) {
          document.value = props.file as IDocument;
        }
        isOpen.value = true;
      });
    };
    const close = () => {
      nextTick(() => {
        outAnimate.value = true;
        setTimeout(() => {
          isOpen.value = false;
          outAnimate.value = false;
          emit('onClose');
        }, 1000);
      });
    };
    const next = () => {
      nextTick(() => {
        outAnimate.value = true;
        setTimeout(() => {
          isOpen.value = false;
          outAnimate.value = false;
          emit('next');
        }, 400);
      });
    };
    return { isOpen, outAnimate, document, open, close, next };
  },
});
</script>
