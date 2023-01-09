<template>
  <div
    ref="bgDoneRef"
    class="ved-w-auto ved-h-auto ved-relative ved-flex ved-justify-between ved-items-center ved-p-2 ved-rounded-lg ved-mt-1 ved-border-0 ved-border-l-4 ved-border-solid ved-border-primaryPure"
  >
    <div class="ved-w-auto ved-flex ved-items-center">
      <Icon :icon="CheckCircle" class="ved-text-primaryPure ved-h-6" />
      <div class="ved-text-primaryPure ved-ml-2">
        {{ filename }}
      </div>
    </div>
    <div class="ved-w-auto ved-flex ved-items-center ved-mt-1">
      <Icon
        :icon="Download"
        :size="18"
        class="ved-text-primaryPure ved-mr-2 ved-cursor-pointer"
        :title="'Download'"
        @click="downloadFile"
        v-if="!downloadLoadingParent"
      />
      <div class="ved-mr-2" v-else>
        <svg
          aria-hidden="true"
          class="ved-w-4 ved-h-4 ved-mr-1.5 ved-text-gray-200 ved-animate-spin-fast-custom-ved dark:ved-text-gray-600 ved-fill-info"
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
      </div>
      <Icon
        :icon="TrashCan"
        :size="18"
        class="ved-text-primaryPure ved-cursor-pointer"
        :title="'Excluir'"
        @click="$emit('remove')"
        v-if="!hideRemoveParent"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { Modal, Icon } from '@/widgets';
import CheckCircle from 'vue-material-design-icons/CheckCircle.vue';
import TrashCan from 'vue-material-design-icons/TrashCan.vue';
import Download from 'vue-material-design-icons/Download.vue';
import { useColor } from '@/composables/useColor';

export default defineComponent({
  components: { Icon, Modal },
  props: {
    primaryColor: {
      type: String,
      required: false,
    },
    hasFile: {
      type: Boolean,
      required: false,
    },
    downloadLoading: {
      type: Boolean,
      required: false,
    },
    hideRemove: {
      type: Boolean,
      required: false,
    },
    filename: {
      type: String,
      required: false,
    },
  },
  setup(props, { emit }) {
    const { parseColor } = useColor();
    const bgDoneRef = ref<any>(null);
    const styleRoot = ref<any>(null);
    const downloadLoadingParent = ref<boolean | undefined>(
      props.downloadLoading
    );
    const hideRemoveParent = ref<boolean | undefined>(props.hideRemove);

    const downloadFile = async () => {
      if (!props.hasFile) return;
      emit('download');
    };

    watch(
      () => props.downloadLoading,
      (value) => {
        if (value) {
          downloadLoadingParent.value = true;
        } else {
          downloadLoadingParent.value = false;
        }
      }
    );

    watch(
      () => props.hideRemove,
      (value) => {
        if (value) {
          hideRemoveParent.value = true;
        } else {
          hideRemoveParent.value = false;
        }
      }
    );

    onMounted(function () {
      styleRoot.value = getComputedStyle(document.body);

      bgDoneRef.value.style.backgroundColor = parseColor(
        props.primaryColor ||
          styleRoot.value.getPropertyValue('--primary-color-default-ved'),
        { loose: false },
        0.06
      );
    });

    return {
      bgDoneRef,
      hideRemoveParent,
      downloadLoadingParent,
      CheckCircle,
      downloadFile,
      TrashCan,
      Download,
    };
  },
});
</script>
