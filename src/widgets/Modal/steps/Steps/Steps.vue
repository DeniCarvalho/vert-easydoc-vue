<template>
  <div
    id="step-container-ved"
    v-if="isOpen"
    :class="{
      'out-ved': outAnimate,
      'animated-ved': isOpen,
      'ved-backdrop-blur-md': !fullscreen,
    }"
  >
    <div class="modal-background-ved">
      <div class="modal-ved" :class="{ 'ved-h-full ved-w-full': fullscreen }">
        <div v-if="!fullscreen" class="ved-h-auto ved-mb-5">
          <div
            class="ved-group ved-scale-90 hover:ved-scale-100 ved-w-10 ved-h-10 ved-bg-white ved-cursor-pointer ved-shadow-xl ved-rounded-full ved-border-primaryPure ved-mx-auto ved-flex ved-items-center ved-justify-center ved-duration-300"
            @click="close"
          >
            <Icon
              :icon="Close"
              class="ved-text-red-500 ved-m-0 ved-p-0 ved-h-5 ved-scale-75 group-hover:ved-scale-100 ved-duration-300"
              :size="20"
            />
          </div>
        </div>
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
            <h3 class="ved-text-2xl" v-if="document?.name">
              {{ document?.name }}
            </h3>
          </div>
          <div
            class=""
            :class="{
              'ved-w-full ved-h-full': fullscreen,
            }"
          >
            <component
              v-bind:is="step"
              @next="next"
              @finish="finish"
              @close="close"
              :file="document"
              :maxSizeLabel="maxSizeLabel"
              :maxSizeSettings="maxSizeSettings"
              :supportedTypesLabel="supportedTypesLabel"
              :supportedTypesSettings="supportedTypesSettings"
            ></component>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" src="./Steps.scss" />
<script lang="ts">
import { IDataFinish, IDocument } from '@/models/document.model';
import { defineComponent, nextTick, ref } from 'vue';
import Close from 'vue-material-design-icons/Close.vue';
import Icon from '@/widgets/Icon/Icon.vue';
export default defineComponent({
  components: { Icon },
  props: {
    file: {
      required: false,
    },
    step: { required: true },
    fullscreen: { default: false },
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
    const finish = (data: IDataFinish) => {
      nextTick(() => {
        outAnimate.value = true;
        setTimeout(() => {
          isOpen.value = false;
          outAnimate.value = false;
          emit('finish', data);
        }, 400);
      });
    };
    return { isOpen, outAnimate, document, open, close, next, finish, Close };
  },
});
</script>
