<template>
  <div
    class="ved-container sm:ved-mx-auto ved-w-auto sm:ved-w-2/3 ved-px-5 sm:ved-px-0 ved-flex ved-flex-col ved-overflow-auto ved-pb-16"
  >
    <h1 class="ved-text-center">Vert Easydoc</h1>

    <div class="ved-w-full ved-my-4">
      <h4 class="ved-text-primaryPure ved-p-0 ved-pb-2 ved-m-0">Small</h4>
      <div class="ved-w-full ved-h-px ved-bg-primaryPure"></div>
    </div>
    <VInputFile
      :size="SizeEnum.Small"
      :labels="config.labels"
      :settings="config.settings"
    />
    <div class="ved-w-full ved-my-4 ved-mt-10">
      <h4 class="ved-text-primaryPure ved-p-0 ved-pb-2 ved-m-0">Medium</h4>
      <div class="ved-w-full ved-h-px ved-bg-primaryPure"></div>
    </div>
    <VInputFile :labels="config.labels" :settings="config.settings" />

    <div class="ved-w-full ved-my-4 ved-mt-10">
      <h4 class="ved-text-primaryPure ved-p-0 ved-pb-2 ved-m-0">Large</h4>
      <div class="ved-w-full ved-h-px ved-bg-primaryPure"></div>
    </div>

    <VInputFile
      :size="SizeEnum.Large"
      :labels="config.labels"
      :settings="config.settings"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { VInputFile } from '@/components';
import { SizeEnum } from '@/enums/size.enum';
export default defineComponent({
  name: 'App',
  components: {
    VInputFile,
  },
  setup() {
    const config = {
      colors: {
        primary: '#000',
        secondary: '#fff',
      },
      labels: {
        browserLink: 'Clique',
        dragDrop: 'ou arraste o documento',
        supportedTypes: 'Suporta',
        maxSize: 'Tamanho',
      },
      settings: {
        endpoint: 'http://localhost:5005/go',
        // maxSize: '12MB',
      },
    };
    return { config, SizeEnum };
  },
});
</script>
<style lang="scss">
@import '@/assets/styles/_font';

html,
body {
  font-family: 'Open Sans', sans-serif !important;
  overflow: hidden !important;
}
</style>
