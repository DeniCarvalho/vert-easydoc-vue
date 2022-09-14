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
      />
      <Icon
        :icon="TrashCan"
        :size="18"
        class="ved-text-primaryPure ved-cursor-pointer"
        :title="'Excluir'"
        @click="$emit('remove')"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
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
    link: {
      type: String,
      required: false,
    },
    filename: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    const { parseColor } = useColor();
    const bgDoneRef = ref<any>(null);
    const styleRoot = ref<any>(null);

    const downloadFile = async () => {
      try {
        if (!props.link) return;
        const a = document.createElement('a');
        a.style.display = 'none';
        a.target = '_blank';
        a.href = props.link;
        a.download = `${props.filename}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(props.link);
      } catch (error) {}
    };

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
      CheckCircle,
      downloadFile,
      TrashCan,
      Download,
    };
  },
});
</script>
