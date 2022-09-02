<template>
  <div
    class="ved-w-full ved-flex ved-flex-col ved-justify-center ved-items-center ved-p-5"
  >
    <div class="ved-w-full md:ved-w-6/12">
      <VInputFile class="" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import VInputFile from './components/VInputFile/VInputFile.vue';

export default defineComponent({
  name: 'App',
  components: {
    VInputFile,
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
