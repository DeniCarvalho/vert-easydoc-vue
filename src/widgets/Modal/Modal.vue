<template>
  <div>
    <Step
      ref="documentRef"
      :file="document"
      :step="PreviewStep"
      @next="openFilename"
      :fullscreen="true"
      :maxSizeLabel="maxSizeLabel"
      :maxSizeSettings="maxSizeSettings"
      :supportedTypesLabel="supportedTypesLabel"
      :supportedTypesSettings="supportedTypesSettings"
    />
    <Step
      ref="filenameRef"
      :file="document"
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
    />
  </div>
</template>
<style lang="scss" src="./Modal.scss" />
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
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
    const document = ref<IDocument>(props.file as IDocument);
    const documentRef = ref<any>(null);

    const filenameRef = ref<any>(null);
    const infoRef = ref<any>(null);

    watch(
      () => props.file,
      (value) => {
        if (value) {
          document.value = value as IDocument;
        }
      }
    );

    const openFilename = () => {
      filenameRef.value?.open();
    };

    const openDocumentRef = () => {
      documentRef.value?.open();
    };

    const openInfo = () => {
      infoRef.value?.open();
    };

    const close = () => {
      setTimeout(() => {
        filenameRef.value?.close();
        emit('onClose');
      }, 1000);
    };

    return {
      documentRef,
      filenameRef,
      infoRef,
      document,
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
