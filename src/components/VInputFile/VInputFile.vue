<template>
  <div id="input-file-ved" class="ved-w-full">
    <label
      @mouseenter="start"
      @mouseleave="reverse"
      @dragover.prevent="start"
      @dragleave.prevent="reverse"
      @drop.prevent="onDrop"
      for="select-file"
      :class="{
        'hover:ved-border-primaryPure hover:ved-bg-primaryPureLight': isHover,
      }"
      class="ved-w-full ved-h-auto ved-relative ved-group ved-px-10 ved-py-5 ved-flex ved-flex-col ved-justify-center ved-cursor-pointer ved-items-center ved-border-2 ved-rounded-lg ved-border-disabledPure ved-border-dashed ved-duration-1000"
    >
      <!-- <lottie-animation
        id="animRef"
        ref="animRef"
        :loop="false"
        :autoPlay="false"
        :speed="1"
        :animationData="require('@/resources/animation/upload-file.json')"
        @complete="complete"
        class="h-28"
      /> -->
      <div class="ved-h-28 ved-w-28"></div>

      <div
        class="ved-text-primary ved-text-center ved-text-sm sm:ved-text-base"
      >
        <span class="ved-cursor-pointer ved-font-bold ved-text-primaryPure"
          >Clique</span
        >
        ou arraste o documento
      </div>
      <div class="ved-text-fontLight ved-text-xs ved-mt-1 ved-text-center">
        Suporta: PDF, DOCX, DOC
      </div>
      <div class="ved-text-fontLight ved-text-xs ved-text-center">
        Tamanho: 10MB
      </div>

      <div
        id="info"
        class="ved-absolute ved-top-2 ved-right-2 ved-cursor-pointer"
      >
        <div class="icon ved-absolute ved-z-50 ved-text-xs">&#8505;</div>
        <div class="blob color ved-relative ved-z-40"></div>
      </div>
    </label>
    <input
      ref="fileRef"
      hidden
      id="select-file"
      type="file"
      name="select-file"
      accept=".doc,.docx,application/pdf"
    />
  </div>
</template>
<style lang="scss" src="./VInputFile.scss" />
<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';

export default defineComponent({
  name: 'VInputFile',
  components: {},
  setup() {
    const animRef = ref<any>(null);
    const fileRef = ref<any>(null);
    const modalRef = ref<any>(null);
    const isHover = ref(false);

    const documentFile = ref<File>();

    const start = () => {
      isHover.value = true;
      animRef.value?.setDirection(1);
      animRef.value?.play();
    };
    const complete = () => {
      animRef.value?.pause();
    };

    const reverse = () => {
      isHover.value = false;
      animRef.value?.setDirection(-1);
      animRef.value?.play();
    };

    const close = () => {
      modalRef.value?.close();
    };

    const onFile = async (file: File) => {
      try {
        const blob = file.slice(0, file.size, file.type);
        const extension = file.name.split('.').pop();
        const name = file.name.split('.').shift();

        documentFile.value = new File([blob], `${name}.${extension}`, {
          type: file.type,
        });
        console.log(documentFile.value);
        const formData = new FormData();
        formData.append('file', documentFile.value);
      } catch (error) {
        console.log(error);
      }
    };

    const onFileChange = (e: any) => {
      const file: File = e.target.files[0];
      onFile(file);
    };

    const onDrop = (e: any) => {
      const file: File = e.dataTransfer.files[0];
      onFile(file);
    };

    const preventDefaults = (e: any) => {
      e.preventDefault();
    };

    const events = ['dragenter', 'dragover', 'dragleave', 'drop'];
    onMounted(() => {
      events.forEach((eventName) => {
        const _document = document as any;
        _document?.body?.addEventListener(eventName, preventDefaults);
      });
      fileRef.value.onchange = onFileChange;
    });

    onUnmounted(() => {
      events.forEach((eventName) => {
        const _document = document as any;
        _document?.body?.removeEventListener(eventName, preventDefaults);
      });
    });

    return {
      animRef,
      fileRef,
      modalRef,
      isHover,
      document,
      start,
      complete,
      reverse,
      onFileChange,
      onDrop,
      close,
    };
  },
});
</script>
