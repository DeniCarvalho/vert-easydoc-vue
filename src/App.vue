<template>
  <div class="ved-container ved-mx-auto ved-w-2/3 ved-flex ved-flex-col">
    <h1 class="ved-text-center">Vert Easydoc</h1>
    <VInputFile :labels="config.labels" :settings="config.settings" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { VInputFile } from '@/components';

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
    return { config };
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
