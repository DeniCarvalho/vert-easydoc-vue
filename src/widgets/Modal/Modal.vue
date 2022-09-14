<template>
  <div>
    <Step
      ref="documentRef"
      :file="file"
      :step="PreviewStep"
      :fullscreen="true"
      :maxSizeLabel="maxSizeLabel"
      :maxSizeSettings="maxSizeSettings"
      :supportedTypesLabel="supportedTypesLabel"
      :supportedTypesSettings="supportedTypesSettings"
      @next="openFilename"
      @onClose="close"
    />
    <Step
      ref="filenameRef"
      :file="file"
      :step="FilenameStep"
      :maxSizeLabel="maxSizeLabel"
      :maxSizeSettings="maxSizeSettings"
      :supportedTypesLabel="supportedTypesLabel"
      :supportedTypesSettings="supportedTypesSettings"
    />
    <Step
      ref="infoRef"
      :step="InfoStep"
      :maxSizeLabel="maxSizeLabel"
      :maxSizeSettings="maxSizeSettings"
      :supportedTypesLabel="supportedTypesLabel"
      :supportedTypesSettings="supportedTypesSettings"
      @onClose="close"
    />
  </div>
</template>
<style lang="scss" src="./Modal.scss" />
<script lang="ts">
import { defineComponent, nextTick, onMounted, ref, watch } from 'vue';
import { Steps, Preview, Filename, Info } from './steps';
import { IDocument } from '@/models/document.model';
import Icon from '@/widgets/Icon/Icon.vue';

export default defineComponent({
  components: {
    Step: Steps,
    Icon,
  },
  props: {
    file: {
      required: false,
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
    const file = ref<IDocument>(props.file as IDocument);
    const documentRef = ref<any>(null);

    const filenameRef = ref<any>(null);
    const infoRef = ref<any>(null);
    const modalIsOpen = ref(false);

    watch(
      () => props.file,
      (value) => {
        if (value) {
          file.value = value as IDocument;
        }
      }
    );

    const openFilename = () => {
      filenameRef.value?.open();
      modalIsOpen.value = true;
    };

    const openDocumentRef = () => {
      documentRef.value?.open();
      modalIsOpen.value = true;
    };

    const openInfo = () => {
      infoRef.value?.open();
      modalIsOpen.value = true;
    };

    const close = () => {
      modalIsOpen.value = false;
      emit('onClose');
    };

    onMounted(function () {
      watch(
        () => modalIsOpen.value,
        function (value) {
          if (value) {
            document?.querySelector('html')?.classList.add('modal-open-ved');
            document?.querySelector('body')?.classList.add('modal-open-ved');
          } else {
            document?.querySelector('html')?.classList.remove('modal-open-ved');
            document?.querySelector('body')?.classList.remove('modal-open-ved');
          }
        }
      );
    });

    return {
      documentRef,
      filenameRef,
      infoRef,
      file,
      openFilename,
      openDocumentRef,
      openInfo,
      close,
      PreviewStep: Preview,
      FilenameStep: Filename,
      InfoStep: Info,
    };
  },
});
</script>
