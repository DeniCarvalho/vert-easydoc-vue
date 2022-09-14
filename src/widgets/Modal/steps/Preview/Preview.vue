<template>
  <div id="preview-step-ved" class="ved-w-full">
    <div
      class="tools-ved ved-w-auto ved-h-14 ved-shadow-md ved-flex ved-items-center ved-justify-between ved-px-8"
    >
      <div class="ved-flex ved-items-center">
        <Icon
          :icon="Menu"
          class="ved-text-white ved-cursor-pointer ved-h-6"
          :size="25"
        />
        <div
          ref="nameRef"
          class="ved-text-sm ved-text-white ved-px-2 ved-max-w-sm ved-relative ved-ml-5"
          @input="onInputName"
          @keydown="onKeyDown"
          contenteditable
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
        >
          {{ docName }}
        </div>
        <Icon
          :icon="Pencil"
          class="ved-text-white ved-cursor-pointer ved-ml-2 ved-h-5 ved-btn-edit"
          :size="15"
          @click="editName"
        />
        <Icon
          :icon="Check"
          class="ved-text-white ved-cursor-pointer ved-ml-2 ved-btn-check ved-hidden"
          :size="15"
        />
      </div>

      <div>
        <Icon
          :icon="Close"
          class="ved-text-white ved-cursor-pointer ved-ml-4"
          @click="close"
        />
      </div>

      <!-- <Icon
          :icon="Pencil"
          class="ved-text-white ved-cursor-pointer ved-ml-2 btn-edit"
          :size="15"
          @click="editName"
        />
        <Icon
          :icon="Check"
          class="ved-text-white ved-cursor-pointer ved-ml-2 btn-check ved-hidden"
          :size="15"
        /> -->
    </div>
    <div class="ved-w-auto ved-grid ved-grid-cols-3">
      <div class="">07</div>
      <div class="ved-col-span-2">06</div>
    </div>

    <!-- <div
      class="col-span-2 ved-h-screen ved-flex ved-flex-col ved-justify-start ved-items-center document-ved ved-overflow-auto"
    >
      <div
        class="ved-p-8 ved-w-full ved-h-auto"
        v-for="(item, i) in doc.pages"
        :key="i"
      >
        <img
          draggable="false"
          class="ved-object-contain ved-rounded-md ved-shadow-xl"
          v-bind:src="'data:image/jpeg;base64,' + item.base64"
        />
      </div>
    </div>
    <div class="tools-ved ved-h-screen">
      <div class="ved-w-auto ved-h-full ved-flex ved-flex-col">
        <div
          class="ved-h-auto ved-flex ved-justify-between ved-items-center ved-border-0 ved-border-b ved-border-black ved-p-5"
        >
          <div class="ved-relative ved-w-96 ved-flex ved-items-center">
            <div class="ved-flex ved-items-center ved-relative">
              <div
                ref="nameRef"
                class="editable-name ved-text-sm ved-text-white ved-px-2 ved-max-w-sm ved-relative"
                @input="onInputName"
                @keydown="onKeyDown"
                contenteditable
                autocorrect="off"
                autocapitalize="off"
                spellcheck="false"
              >
                {{ docName }}
              </div>

              <Icon
                :icon="Pencil"
                class="ved-text-white ved-cursor-pointer ved-ml-2 btn-edit"
                :size="15"
                @click="editName"
              />
              <Icon
                :icon="Check"
                class="ved-text-white ved-cursor-pointer ved-ml-2 btn-check ved-hidden"
                :size="15"
              />
            </div>
          </div>

          <div class="ved-flex ved-items-center">
            <Icon
              :icon="Reload"
              class="ved-text-white ved-cursor-pointer"
              @click="reset"
            />
            <Icon
              :icon="Close"
              class="ved-text-white ved-cursor-pointer ved-ml-4"
              @click="close"
            />
          </div>
        </div>

        <div
          class="ved-w-full ved-h-full ved-flex ved-flex-col ved-items-start"
        >
          <h1>Teste</h1>
        </div>
      </div>
    </div> -->
  </div>
</template>
<style lang="scss" src="./Preview.scss" />
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import Close from 'vue-material-design-icons/Close.vue';
import Pencil from 'vue-material-design-icons/Pencil.vue';
import Reload from 'vue-material-design-icons/Reload.vue';
import Check from 'vue-material-design-icons/CheckBold.vue';
import Menu from 'vue-material-design-icons/Menu.vue';
import { IDocument } from '@/models/document.model';
import Icon from '@/widgets/Icon/Icon.vue';

export default defineComponent({
  props: {
    file: {
      required: true,
    },
  },
  components: { Icon },
  setup(props, { emit }) {
    const doc = ref<IDocument>(props.file as IDocument);

    const maxLength = ref(40);
    const docName = ref<string>('');
    docName.value = doc.value?.name || '';

    const extensionFile = ref<string>('');
    extensionFile.value = doc.value.extension;

    const urlBase =
      extensionFile.value === 'pdf'
        ? URL.createObjectURL(doc.value.file) +
          '#toolbar=0&statusbar=0&navpanes=0&scrollbar=0'
        : `https://view.officeapps.live.com/op/embed.aspx?src=${URL.createObjectURL(
            doc.value.file
          )}`;

    const embedSrc = ref<string>('');
    embedSrc.value = urlBase;

    const nameRef = ref<any>(null);

    const next = () => {
      emit('next');
    };
    const close = () => {
      emit('close');
    };

    const onInputName = (e: any) => {
      docName.value = e.target.innerText;
    };

    const onKeyDown = (e: any) => {
      if (e.keyCode === 13) {
        enterPressed();
        e.preventDefault();
        return;
      }

      if (docName.value.length >= maxLength.value) {
        if ((e.keyCode >= 48 && e.keyCode <= 90) || e.keyCode === 46) {
          e.preventDefault();
          return;
        }
      }
    };

    const enterPressed = () => {
      nameRef.value?.blur();
    };

    const editName = () => {
      nameRef.value?.focus();
    };

    const reset = () => {
      docName.value = doc.value?.name || '';
    };

    onMounted(() => {
      nameRef.value?.addEventListener(
        'focus',
        function () {
          const btnEdit = document.querySelector('.ved-btn-edit');
          const btnCheck = document.querySelector('.ved-btn-check');
          if (btnEdit) {
            btnEdit.classList.add('ved-hidden');
          }
          if (btnCheck) {
            btnCheck.classList.remove('ved-hidden');
          }

          docName.value = docName.value?.trim();
        },
        true
      );

      nameRef.value?.addEventListener(
        'blur',
        function () {
          const btnEdit = document.querySelector('.ved-btn-edit');
          const btnCheck = document.querySelector('.ved-btn-check');
          if (btnEdit) {
            btnEdit.classList.remove('ved-hidden');
          }
          if (btnCheck) {
            btnCheck.classList.add('ved-hidden');
          }

          docName.value = docName.value?.trim();
          if (docName.value.length === 0) {
            reset();
          }
        },
        true
      );
    });

    return {
      docName,
      doc,
      embedSrc,
      nameRef,
      extensionFile,
      next,
      close,
      onInputName,
      onKeyDown,
      editName,
      reset,
      enterPressed,
      Close,
      Pencil,
      Reload,
      Check,
      Menu,
    };
  },
});
</script>
