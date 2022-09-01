<template>
  <div class="w-full md:w-6/12 flex flex-col justify-center items-center p-5">
    <VInputFile
      class="py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-green-500 hover:bg-green-700"
      >My Button</VInputFile
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { VInputFile } from './components/';

export default defineComponent({
  name: 'App',
  components: {
    VInputFile,
  },
});
</script>
