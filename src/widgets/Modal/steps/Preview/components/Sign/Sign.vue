<template>
  <div class="name">{{ data.name }}</div>
  <div class="email">{{ data.email }}</div>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue';
export default defineComponent({
  setup() {
    const data = reactive({
      name: 'Denissson Carvalho da Silva',
      email: 'denisson.carvalho94@gmail.com',
    });
    return { data };
  },
});
</script>
