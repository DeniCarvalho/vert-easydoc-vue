<template>
  <div id="preview-step-ved" class="ved-w-full ved-pb-10">
    <div
      class="tools-ved ved-w-auto ved-h-14 ved-shadow-md ved-grid ved-grid-cols-3 ved-px-8"
    >
      <div class="ved-flex ved-items-center ved-justify-start">
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

      <div class="ved-flex ved-items-center ved-justify-center">
        <input
          ref="pageActiveRef"
          type="text"
          class="ved-text-white ved-bg-black/[.50]"
          id="ved-input-page-active"
          name="ved-input-page-active"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          v-model="pageActive"
          @keyup.enter="onInputPageActive"
          @blur="onInputPageActive"
          @focus="onFocus"
        />
        <div class="ved-text-white ved-px-2">/</div>
        <div class="ved-text-white">{{ doc.pages.length }}</div>
      </div>

      <div class="ved-flex ved-items-center ved-justify-end">
        <Icon
          :icon="Close"
          class="ved-text-white ved-cursor-pointer ved-ml-4"
          @click="close"
        />
      </div>
    </div>
    <div
      ref="pagesRef"
      class="ved-w-auto ved-h-screen ved-flex ved-flex-col ved-justify-start ved-items-center document-ved ved-overflow-auto"
    >
      <div
        class="ved-py-5 ved-w-full ved-h-auto ved-page-item-list ved-flex ved-flex-col ved-justify-start ved-items-center"
        v-for="(item, i) in doc.pages"
        :key="i"
        :class="{ 'ved-pb-20': doc.pages.length - 1 == i }"
        :id="`ved-page-item-${i + 1}`"
      >
        <img
          draggable="false"
          class="ved-object-contain ved-rounded-md ved-shadow-xl ved-img-page-large"
          v-bind:src="item.base64"
        />
      </div>
    </div>
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
    const pageActiveRef = ref<any>(null);
    const pagesRef = ref<any>(null);
    const pageActive = ref<number>(1);
    const pageActiveBKP = ref<number>(1);

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

    const detectedScroll = () => {
      const scroll = document.querySelector('.document-ved')?.scrollTop;
      const pages = document.querySelectorAll('.ved-page-item-list');
      const pageHeight = pages[0]?.clientHeight;
      const _pageActive = Math.floor(scroll! / pageHeight!) + 1;

      if (_pageActive !== pageActive.value) {
        pageActive.value = _pageActive;
      }
    };

    const onInputPageActive = ({ target }: any) => {
      const value = target && target.value ? parseInt(target.value) : -1;
      if (value > 0 && value <= doc.value.pages.length) {
        const _page = document.getElementById(`ved-page-item-${value}`);
        pageActiveBKP.value = value;
        pagesRef.value?.scrollTo({
          top: _page?.offsetTop,
          behavior: 'smooth',
        });
      } else {
        pageActive.value = pageActiveBKP.value;
      }
    };

    const onFocus = (event?: any) => {
      event?.target?.setSelectionRange(0, event?.target?.value.length);
    };

    onMounted(() => {
      pagesRef.value?.addEventListener('scroll', () => {
        detectedScroll();
      });

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
      pagesRef,
      pageActiveRef,
      nameRef,
      extensionFile,
      pageActive,
      next,
      close,
      onInputName,
      onKeyDown,
      editName,
      reset,
      enterPressed,
      onInputPageActive,
      onFocus,
      Close,
      Pencil,
      Reload,
      Check,
      Menu,
    };
  },
});
</script>
