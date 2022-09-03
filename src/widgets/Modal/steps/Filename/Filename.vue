<template>
  <div class="ved-w-full">
    <p class="ved-mb-4 ved-text-sm">
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatibus qui
      nihil laborum quaerat blanditiis nemo explicabo voluptatum ea architecto
      corporis quo vitae, velit temporibus eaque quisquam in quis provident
      necessitatibus.
    </p>
    <button
      class="ved-px-6 ved-py-2 ved-ml-2 ved-text-blue-100 ved-bg-blue-600 ved-rounded ved-border-0 ved-cursor-pointer"
      @click="next"
    >
      Continuar
    </button>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  setup(_, { emit }) {
    const next = () => {
      emit('next');
    };
    return { next };
  },
});
</script>
