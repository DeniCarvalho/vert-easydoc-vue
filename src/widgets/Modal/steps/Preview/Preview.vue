<template>
  <div id="preview-step-ved" class="ved-w-full">
    <div
      class="tools-ved ved-w-full ved-h-14 ved-shadow-md ved-grid ved-grid-cols-3 ved-px-8 ved-z-20 ved-fixed"
    >
      <div class="ved-flex ved-items-center ved-justify-start">
        <Icon
          @click="menuPagesOpen = !menuPagesOpen"
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
          class="ved-text-white ved-bg-black/[.50] ved-mt-1"
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
        class="ved-py-5 ved-w-full ved-h-auto ved-page-item-list ved-flex ved-flex-col ved-justify-start ved-items-center ved-relative"
        v-for="(item, i) in doc.pages"
        :key="i"
        :class="{ 'ved-pt-20': i == 0 }"
        :id="`ved-page-item-${i + 1}`"
      >
        <div class="ved-w-auto ved-h-auto ved-relative">
          <img
            @click="drawDot"
            draggable="false"
            class="ved-object-contain ved-rounded-md ved-shadow-xl ved-img-page-large ved-relative"
            v-bind:src="item.base64"
          />
        </div>
      </div>

      <div
        ref="pagesMenuRef"
        class="menu-ved ved-fixed ved-h-screen ved-left-0 ved-shadow-2xl ved-duration-500 ved-overflow-auto ved-pt-2"
        :class="{
          'ved-w-0': !menuPagesOpen,
          'ved-w-64': menuPagesOpen,
        }"
      >
        <div
          class="ved-py-3 ved-w-full ved-h-auto ved-page-item-list mini-item-ved ved-flex ved-flex-col ved-justify-start ved-items-center"
          v-for="(item, i) in doc.pages"
          :key="i"
          :class="{ 'ved-pt-16': i == 0 }"
          :id="`ved-page-item-menu-${i + 1}`"
          @click="onInputPageActive({ target: { value: i + 1 } })"
        >
          <img
            draggable="false"
            class="ved-object-contain ved-rounded-md ved-img-page-small"
            :class="{
              'ved-border-solid ved-border-4 ved-border-sky-300':
                pageActive == i + 1,
              'inactive-img-ved': pageActive != i + 1,
            }"
            v-bind:src="item.base64"
          />
          <div class="ved-text-white ved-font-semibold ved-text-xs ved-mt-2">
            {{ i + 1 }}
          </div>
        </div>
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
    console.log({ doc });
    const menuPagesOpen = ref<boolean>(false);

    const maxLength = ref(40);
    const docName = ref<string>('');
    docName.value = doc.value?.name || '';

    const extensionFile = ref<string>('');
    extensionFile.value = doc.value.extension;

    const nameRef = ref<any>(null);
    const pageActiveRef = ref<any>(null);
    const pagesRef = ref<any>(null);
    const pagesMenuRef = ref<any>(null);
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
        const _pageMenu = document.getElementById(
          `ved-page-item-menu-${pageActive.value}`
        );
        pagesMenuRef.value?.scrollTo({
          top: _pageMenu?.offsetTop,
        });
      }
    };

    const onInputPageActive = ({ target }: any) => {
      const value = target && target.value ? parseInt(target.value) : -1;
      if (value > 0 && value <= doc.value.pages.length) {
        pageActiveBKP.value = value;
        const _page = document.getElementById(`ved-page-item-${value}`);
        pagesRef.value?.scrollTo({
          top: _page?.offsetTop,
          behavior: 'smooth',
        });

        const _pageMenu = document.getElementById(
          `ved-page-item-menu-${value}`
        );
        pagesMenuRef.value?.scrollTo({
          top: _pageMenu?.offsetTop,
        });
      } else {
        pageActive.value = pageActiveBKP.value;
      }
    };

    const onFocus = (event?: any) => {
      event?.target?.setSelectionRange(0, event?.target?.value.length);
    };

    const drawDot = (event: any) => {
      const target = event.target;
      console.log({ event });
      const rect = target.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      console.log(mouseX + ' ' + mouseY);
      const color = '#000000';
      const size = '50px';
      const zIndex = '999999';
      const div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.top = mouseY + 'px';
      div.style.left = mouseX + 'px';
      div.style.width = size;
      div.style.height = size;
      div.style.backgroundColor = color;
      div.style.zIndex = zIndex;
      target.parentElement.appendChild(div);
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
      menuPagesOpen,
      docName,
      doc,

      pagesRef,
      pagesMenuRef,
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
      drawDot,
      Close,
      Pencil,
      Reload,
      Check,
      Menu,
    };
  },
});
</script>
