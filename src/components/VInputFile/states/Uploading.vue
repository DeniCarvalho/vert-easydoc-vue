<template>
  <div class="ved-w-full ved-relative">
    <div class="ved-flex ved-mb-2 ved-items-center ved-justify-between">
      <div
        ref="bgLabelProgressRef"
        class="ved-flex ved-items-center ved-py-1 ved-px-2 ved-uppercase ved-rounded-lg ved-text-primaryPure"
      >
        <svg
          v-if="uploadProgress == 100"
          aria-hidden="true"
          class="ved-w-4 ved-h-4 ved-mr-1.5 ved-text-gray-200 ved-animate-spin-fast-custom-ved dark:ved-text-gray-600 ved-fill-primaryPure"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <div v-else class="ved-mr-1.5 ved-h-auto">
          <Icon
            :icon="Upload"
            class="ved-text-primaryPure ved-h-3 ved-animate-bounce-custom-ved"
            :size="14"
          />
        </div>
        <span class="ved-text-xs ved-font-semibold ved-inline-block">
          {{ uploadProgress != 100 ? 'Fazendo upload' : 'Preparando arquivo' }}
        </span>
      </div>
      <div class="ved-text-right ved-flex ved-items-center">
        <Icon
          :size="14"
          :icon="CheckCircle"
          class="ved-text-primaryPure ved-mr-1 ved-mt-1"
          v-if="uploadProgress == 100"
        />
        <Icon
          v-else
          :size="16"
          :icon="StopCircleOutline"
          class="ved-text-red-500 ved-cursor-pointer ved-mr-3 ved-h-4"
          :title="'Cancelar'"
          @click="$emit('cancel')"
        />

        <div
          class="ved-text-xs ved-font-semibold ved-inline-block ved-text-primaryPure"
        >
          {{ percentageUpload }}
        </div>
      </div>
    </div>
    <div
      ref="bgProgressRef"
      class="ved-overflow-hidden ved-h-2 ved-text-xs ved-flex ved-rounded-[3px]"
    >
      <div
        :style="{
          width: percentageUpload,
        }"
        class="ved-shadow-none ved-flex ved-flex-col ved-text-center ved-whitespace-nowrap ved-text-white ved-justify-center ved-bg-primaryPure ved-duration-[1700ms]"
      ></div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { Modal, Icon } from '@/widgets';
import CheckCircle from 'vue-material-design-icons/CheckCircle.vue';
import Upload from 'vue-material-design-icons/Upload.vue';
import StopCircleOutline from 'vue-material-design-icons/StopCircleOutline.vue';

import { useColor } from '@/composables/useColor';

export default defineComponent({
  components: { Icon, Modal },
  props: {
    primaryColor: {
      type: String,
      required: false,
    },
    uploadProgress: {
      type: Number,
      required: false,
    },
  },
  setup(props) {
    const { parseColor } = useColor();
    const bgLabelProgressRef = ref<any>(null);
    const bgProgressRef = ref<any>(null);
    const styleRoot = ref<any>(null);

    const percentageUpload = computed(() => {
      return props.uploadProgress != undefined
        ? Math.round(props.uploadProgress) + '%'
        : '';
    });

    onMounted(function () {
      styleRoot.value = getComputedStyle(document.body);

      bgLabelProgressRef.value.style.backgroundColor = parseColor(
        props.primaryColor ||
          styleRoot.value.getPropertyValue('--primary-color-default-ved'),
        { loose: false },
        0.1
      );
      bgProgressRef.value.style.backgroundColor = parseColor(
        props.primaryColor ||
          styleRoot.value.getPropertyValue('--primary-color-default-ved'),
        { loose: false },
        0.1
      );
    });
    return {
      percentageUpload,
      bgLabelProgressRef,
      bgProgressRef,
      CheckCircle,
      Upload,
      StopCircleOutline,
    };
  },
});
</script>
