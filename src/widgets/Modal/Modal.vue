<template>
  <div>
    <Step
      ref="documentRef"
      :file="document"
      :step="PreviewStep"
      @next="openFilename"
      :fullscreen="true"
    />
    <Step ref="filenameRef" :file="document" :step="FilenameStep" />
  </div>
</template>
<style lang="scss" src="./Modal.scss" />
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { Steps, Preview, Filename } from './steps';
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
  },
  setup(props, { emit }) {
    const document = ref<IDocument>(props.file as IDocument);
    const documentRef = ref<any>(null);

    const filenameRef = ref<any>(null);

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

    const close = () => {
      setTimeout(() => {
        filenameRef.value?.close();
        emit('onClose');
      }, 1000);
    };

    return {
      documentRef,
      filenameRef,
      document,
      openFilename,
      openDocumentRef,
      close,
      PreviewStep: Preview,
      FilenameStep: Filename,
    };
  },
});
</script>
