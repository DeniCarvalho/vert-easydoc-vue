<template>
  <div class="ved-w-full">
    <p class="ved-text-left ved-text-sm ved-text-black ved-p-0 ved-m-0">
      O
      <b class="ved-text-primary">Vert <i>Easydoc</i></b> auxilia na criação de
      uma página de assinaturas personalizada para o seu negócio. <br /><br />
      Faça o upload do documento
      <b class="ved-text-primaryPure">sem a página de assinaturas</b> e defina
      todas as partes que devem assinar.
    </p>
    <div class="ved-w-full ved-flex ved-flex-col ved-items-start ved-mt-4">
      <div class="ved-text-primaryPure ved-text-xs ved-text-center">
        {{ supportedTypesLabel }}:
        {{ supportedTypesSettings }}
      </div>
      <div class="ved-text-primaryPure ved-text-xs ved-text-center">
        {{ maxSizeLabel }}:
        {{ maxSizeSettings }}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
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
  setup(_, {}) {
    return {};
  },
});
</script>
