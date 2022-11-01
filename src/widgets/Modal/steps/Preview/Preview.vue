<template>
  <div id="preview-step-ved" class="ved-w-auto">
    <div class="cursor-zone-ved">
      <div class="cursor-page-ved"></div>
      <div class="mark-ved"></div>
    </div>
    <div
      class="tools-ved ved-w-full ved-h-14 ved-shadow-md ved-grid ved-grid-cols-3 ved-z-20 ved-fixed"
    >
      <div class="ved-flex ved-items-center ved-justify-start ved-pl-8">
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

      <div class="ved-flex ved-items-center ved-justify-end ved-pr-8">
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
            :class="`page-item-${i + 1}`"
            v-bind:src="item.base64"
            :style="`width: ${item.size?.width}px; height: ${
              item.size?.height || 1000
            }px;`"
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
    <span class="overlay-modal-ved"></span>
    <div
      class="modal-box-sign-ved ved-flex ved-flex-col ved-justify-start ved-items-start ved-w-full"
    >
      <div class="ved-font-semibold ved-text-black ved-font-base">
        Parte assinante
      </div>
      <div class="ved-font-thin ved-text-gray-400 ved-text-xs">
        Dados de uma das partes que assinará o documento
      </div>
      <div
        class="ved-w-full ved-mt-5 ved-flex ved-flex-col ved-justify-start ved-items-start"
      >
        <div class="ved-grid ved-w-full ved-h-auto">
          <label for="inp" class="inp">
            <input
              type="text"
              id="inp"
              placeholder="&nbsp;"
              v-model="formSign.name"
            />
            <span class="label">Nome</span>
            <span class="focus-bg"></span>
          </label>
        </div>

        <div class="ved-grid ved-w-full ved-h-auto ved-mt-4">
          <label for="inp" class="inp">
            <input
              type="text"
              id="inp"
              placeholder="&nbsp;"
              v-model="formSign.email"
            />
            <span class="label">E-mail</span>
            <span class="focus-bg"></span>
          </label>
        </div>

        <div
          class="ved-w-full ved-flex ved-justify-between ved-items-center ved-mt-5"
        >
          <div>
            <button
              @click="addSign"
              class="ved-bg-cyan-600 hover:ved-bg-cyan-700 ved-text-white ved-font-bold ved-py-2 ved-px-4 ved-rounded ved-border-0 ved-cursor-pointer"
            >
              {{ formSign.id ? 'Atualizar' : 'Adicionar' }}
            </button>
            <button
              class="ved-text-black ved-bg-transparent focus:ved-outline-none ved-font-bold ved-py-2 ved-px-4 ved-rounded ved-border-0 ved-cursor-pointer"
              type="button"
              @click="cancelSign"
            >
              Cancelar
            </button>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" src="./Preview.scss" />
<script lang="ts">
interface IModalSign {
  target: any;
  div: HTMLElement | null;
  id: number;
  xPosition: number;
  yPosition: number;
}

interface IDataSign {
  id: number;
  name: string;
  email: string;
  xPosition: number;
  yPosition: number;
}

import { defineComponent, onMounted, reactive, ref } from 'vue';
import Close from 'vue-material-design-icons/Close.vue';
import Pencil from 'vue-material-design-icons/Pencil.vue';
import Reload from 'vue-material-design-icons/Reload.vue';
import Check from 'vue-material-design-icons/CheckBold.vue';
import Menu from 'vue-material-design-icons/Menu.vue';
import { IDocument } from '@/models/document.model';
import Icon from '@/widgets/Icon/Icon.vue';
import Sign from './components/Sign/Sign.vue';

export default defineComponent({
  props: {
    file: {
      required: true,
    },
  },
  components: { Icon, Sign },
  setup(props, { emit }) {
    const doc = ref<IDocument>(props.file as IDocument);
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
    const cursor = ref<Element | null>(null);
    const modalSign = ref<IModalSign>();
    const signatures = ref<IDataSign[]>([]);
    const formSign = ref<IDataSign>({
      id: 0,
      name: '',
      email: '',
      xPosition: 0,
      yPosition: 0,
    });

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
      const rect = target.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const zIndex = '999980';
      const yPosition: number = Math.round(mouseY - 45);
      const xPosition: number = Math.round(mouseX);
      const div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.top = yPosition + 'px';
      div.style.left = xPosition + 'px';
      div.style.zIndex = zIndex;
      div.style.cursor = 'pointer';
      const id = signatures.value.length + 1;
      div.id = `sign-person-${id}`;
      div.className = 'chip-ved show-modal-btn';

      div.addEventListener('mouseup', (e: MouseEvent) => {
        mouseUpSign(e);
      });

      div.addEventListener('click', (el: any) => {
        openAddSign(id);
      });

      // target.parentElement.appendChild(div);
      modalSign.value = {
        target,
        div,
        id,
        yPosition,
        xPosition,
      };
      openAddSign();
    };

    const mouseUpSign = (e: any) => {
      cursor.value?.setAttribute('style', 'display: none;');
    };

    const mouseLeaveSign = (_: any) => {
      cursor.value?.setAttribute('style', 'display: block;');
    };

    const keyupHandler = (e: any) => {
      if (e.ctrlKey && e.key === 'z') {
        const id = signatures.value.length;
        const point = document.getElementById(`sign-person-${id}`);
        point?.remove();
        signatures.value.pop();
      } else if (e.ctrlKey && e.key === 'y') {
      }
    };

    const openAddSign = (id?: number) => {
      if (id) {
        const sign = signatures.value.find((s) => s.id === id);
        if (sign) {
          formSign.value = sign;
        }
        const elementDiv = document.getElementById(`sign-person-${id}`);
        const xPosition = elementDiv?.offsetLeft || 0;
        const yPosition = elementDiv?.offsetTop || 0;
        modalSign.value = {
          target: elementDiv?.parentElement,
          div: elementDiv,
          id,
          yPosition,
          xPosition,
        };
      } else {
        formSign.value = {
          id: 0,
          name: '',
          email: '',
          xPosition: 0,
          yPosition: 0,
        };
      }
      cursor.value?.classList.add('cursor-zone-ved__expand');

      const page = document.querySelector('#preview-step-ved');
      page?.classList.add('active-modal-sign');

      setTimeout(() => {
        cursor.value?.classList.remove('cursor-zone-ved__expand');
      }, 500);
    };

    const addSign = () => {
      if (!formSign.value.id) {
        signatures.value.push({
          id: modalSign.value?.id || signatures.value.length + 1,
          name: formSign.value.name || '',
          email: formSign.value.email || '',
          xPosition: modalSign.value?.xPosition || 0,
          yPosition: modalSign.value?.yPosition || 0,
        });

        if (modalSign.value?.div) {
          modalSign.value.div.innerHTML += `
        <div class="name">${formSign.value.name}</div>
        <div class="email">${formSign.value.email}</div>`;

          const pageModal = document.querySelector('#preview-step-ved');
          pageModal?.classList.remove('active-modal-sign');

          modalSign.value?.target.parentElement.appendChild(
            modalSign.value?.div
          );
        }
      } else {
        const signIdx = signatures.value.findIndex(
          (s) => s.id === formSign.value.id
        );
        if (signIdx >= 0) {
          signatures.value[signIdx].name = formSign.value.name;
          signatures.value[signIdx].email = formSign.value.email;
          signatures.value[signIdx].xPosition = modalSign.value?.xPosition || 0;
          signatures.value[signIdx].yPosition = modalSign.value?.yPosition || 0;

          const elementName = document.querySelector(
            `#sign-person-${formSign.value.id} .name`
          );
          if (elementName) elementName.textContent = formSign.value.name;

          const elementEmail = document.querySelector(
            `#sign-person-${formSign.value.id} .email`
          );
          if (elementEmail) elementEmail.textContent = formSign.value.email;

          const pageModal = document.querySelector('#preview-step-ved');
          pageModal?.classList.remove('active-modal-sign');
        }
      }
    };

    const cancelSign = () => {
      const pageModal = document.querySelector('#preview-step-ved');
      pageModal?.classList.remove('active-modal-sign');
      modalSign.value = {
        target: null,
        div: null,
        id: 0,
        yPosition: 0,
        xPosition: 0,
      };
    };

    const removeSign = (id: number) => {
      signatures.value?.splice(
        signatures.value.findIndex((item) => item.id === id),
        1
      );
    };

    onMounted(() => {
      const elementsPage = document.querySelectorAll('.ved-img-page-large');
      cursor.value = document.querySelector('.cursor-zone-ved');
      for (let index = 0; index < elementsPage.length; index++) {
        const element = elementsPage[index];
        element?.addEventListener('mouseenter', function (_) {
          cursor.value?.setAttribute('style', 'display: block;');
        });
        element?.addEventListener('mouseleave', function (e: any) {
          cursor.value?.setAttribute('style', 'display: none;');
        });

        element?.addEventListener('mousemove', function (e: any) {
          cursor.value?.setAttribute(
            'style',
            'top: ' + (e.pageY - 10) + 'px; left: ' + (e.pageX - 5) + 'px;'
          );
        });
      }

      document.addEventListener('keyup', keyupHandler);

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

      const pageModal = document.querySelector('#preview-step-ved'),
        overlay = document.querySelector('.overlay-modal-ved');

      overlay?.addEventListener('click', () =>
        pageModal?.classList.remove('active-modal-sign')
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
      formSign,
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
      mouseUpSign,
      mouseLeaveSign,
      keyupHandler,
      openAddSign,
      addSign,
      cancelSign,
      removeSign,
      Close,
      Pencil,
      Reload,
      Check,
      Menu,
    };
  },
});
</script>
