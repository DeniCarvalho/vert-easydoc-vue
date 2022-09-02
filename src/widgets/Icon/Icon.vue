<template>
  <div v-bind="$attrs">
    <component v-bind:is="icon" v-bind:size="size"></component>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  components: {},
  props: {
    icon: { required: true },
    size: {
      type: Number,
      required: false,
    },
  },
});
</script>
