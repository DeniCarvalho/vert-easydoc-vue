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
      :style="{ height: `${heightWindow}px` }"
      class="ved-mt-14 ved-fixed ved-w-full ved-flex ved-flex-col ved-justify-start ved-items-center document-ved ved-overflow-y-auto ved-overflow-x-hidden"
    >
      <div
        class="ved-py-5 ved-w-full ved-h-auto ved-page-item-list ved-flex ved-flex-col ved-justify-start ved-items-center ved-relative"
        v-for="(item, i) in doc.pages"
        :key="i"
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
        :style="{ height: `${heightWindow}px` }"
        class="menu-ved ved-fixed ved-left-0 ved-shadow-2xl ved-duration-500 ved-overflow-y-auto ved-overflow-x-hidden"
        :class="{
          'ved-w-0': !menuPagesOpen,
          'ved-w-64': menuPagesOpen,
        }"
      >
        <div
          class="ved-py-3 ved-w-full ved-h-auto ved-page-item-list mini-item-ved ved-flex ved-flex-col ved-justify-start ved-items-center"
          v-for="(item, i) in doc.pages"
          :key="i"
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
        Signatários
      </div>
      <div class="ved-font-thin ved-text-gray-400 ved-text-xs">
        {{
          formSign.id
            ? 'Atualize os dados do signatário'
            : 'Adicione um novo signatário'
        }}
      </div>
      <form
        class="ved-w-full ved-mt-5 ved-flex ved-flex-col ved-justify-start ved-items-start"
        @submit.prevent="addSign"
      >
        <div class="ved-grid ved-w-full ved-h-auto">
          <label for="name" class="inp">
            <input
              type="text"
              name="name"
              id="name"
              placeholder="&nbsp;"
              v-model.trim="formSign.name"
              autocomplete="off"
              required
            />
            <span class="label">Nome</span>
            <span class="focus-bg"></span>
          </label>
        </div>

        <div class="ved-grid ved-w-full ved-h-auto ved-mt-4">
          <label for="email" class="inp">
            <input
              type="email"
              id="email"
              placeholder="&nbsp;"
              v-model.trim="formSign.email"
              autocomplete="off"
              required
            />
            <span class="label">E-mail</span>
            <span class="focus-bg"></span>
          </label>
        </div>

        <div
          class="ved-w-full ved-flex ved-justify-between ved-items-center ved-mt-8"
        >
          <div>
            <button
              type="submit"
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
          <div>
            <Icon
              v-if="formSign.id"
              title="Remover parte"
              :icon="Trash"
              class="ved-text-red-600 hover:ved-text-red-700 ved-cursor-pointer ved-h-5"
              :size="22"
              @click="removeSign(formSign.id)"
            />
          </div>
        </div>
      </form>
    </div>

    <div
      class="ved-fixed ved-bottom-10 ved-right-14"
      v-if="signatures.length > 0"
    >
      <button
        type="button"
        @click="finish"
        class="ved-px-2 ved-py-1.5 ved-bg-amber-400 ved-rounded-md ved-text-black ved-outline-none ved-shadow-lg ved-transform active:ved-scale-x-75 ved-transition-transform ved-flex ved-justify-evenly ved-items-center ved-border-0 ved-cursor-pointer ved-w-28"
      >
        <div>
          <svg class="ved-h-6 ved-w-6" viewBox="0 0 20 20">
            <path
              d="M10.219,1.688c-4.471,0-8.094,3.623-8.094,8.094s3.623,8.094,8.094,8.094s8.094-3.623,8.094-8.094S14.689,1.688,10.219,1.688 M10.219,17.022c-3.994,0-7.242-3.247-7.242-7.241c0-3.994,3.248-7.242,7.242-7.242c3.994,0,7.241,3.248,7.241,7.242C17.46,13.775,14.213,17.022,10.219,17.022 M15.099,7.03c-0.167-0.167-0.438-0.167-0.604,0.002L9.062,12.48l-2.269-2.277c-0.166-0.167-0.437-0.167-0.603,0c-0.166,0.166-0.168,0.437-0.002,0.603l2.573,2.578c0.079,0.08,0.188,0.125,0.3,0.125s0.222-0.045,0.303-0.125l5.736-5.751C15.268,7.466,15.265,7.196,15.099,7.03"
            ></path>
          </svg>
        </div>
        <div class="ved-ml-2">Finalizar</div>
      </button>
    </div>
  </div>
</template>
<style lang="scss" src="./Preview.scss" />
<script lang="ts">
import {
  defineComponent,
  onMounted,
  computed,
  ref,
  PropType,
  watch,
} from 'vue';
import Close from 'vue-material-design-icons/Close.vue';
import Pencil from 'vue-material-design-icons/Pencil.vue';
import Reload from 'vue-material-design-icons/Reload.vue';
import Check from 'vue-material-design-icons/CheckBold.vue';
import Menu from 'vue-material-design-icons/Menu.vue';
import Trash from 'vue-material-design-icons/TrashCan.vue';
import {
  IDataSign,
  IDocument,
  IModalSign,
  IDataFinish,
  IPartyDefault,
  ISigners,
  ISignHereTab,
} from '@/models/document.model';
import Icon from '@/widgets/Icon/Icon.vue';
import Sign from './components/Sign/Sign.vue';

export default defineComponent({
  props: {
    file: {
      required: true,
    },
    parties: {
      type: Array as PropType<Array<IPartyDefault>>,
      required: false,
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
      page: 0,
      xPosition: 0,
      yPosition: 0,
    });
    const heightWindow = ref<number>(0);

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
          page: 0,
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
      if (!formSign.value.name || !formSign.value.email) {
        return;
      }
      if (!formSign.value.id) {
        signatures.value.push({
          id: modalSign.value?.id || signatures.value.length + 1,
          name: formSign.value.name || '',
          email: formSign.value.email || '',
          page: 0,
          xPosition: modalSign.value?.xPosition || 0,
          yPosition: modalSign.value?.yPosition || 0,
        });

        if (modalSign.value?.div) {
          modalSign.value.div.innerHTML += `
        <div class="name">${formSign.value.name}</div>
        <div class="email">${formSign.value.email}</div>`;

          modalSign.value.div.style.display = 'none';

          modalSign.value?.target.parentElement.appendChild(
            modalSign.value?.div
          );
          setPageAddSign(modalSign.value?.id || signatures.value.length + 1);
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

    const setPageAddSign = (id: number) => {
      const parentElementDot = document.querySelector(
        `#sign-person-${id}`
      )?.parentElement;
      if (parentElementDot) {
        let elms = parentElementDot.querySelector('[class*=page-item-]');
        if (elms) {
          const classes = elms.className.split(' ');
          const page = classes.find((c) => c.includes('page-item-'));
          if (page) {
            const pageIdx = parseInt(page.replace('page-item-', ''));
            if (pageIdx) {
              const signIdx = signatures.value.findIndex((s) => s.id === id);
              signatures.value[signIdx].page = pageIdx;
              const pageModal = document.querySelector('#preview-step-ved');
              pageModal?.classList.remove('active-modal-sign');
              if (modalSign.value?.div) {
                modalSign.value.div.style.display = 'block';
                return;
              }
            }
          }
        }
      }
      removeSign(id);
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
      document.querySelector(`#sign-person-${id}`)?.remove();
      cancelSign();
    };

    const finish = () => {
      // Check fields signatures
      let isValid = true;
      // Copy signatures to new array
      const signaturesCopy = JSON.parse(JSON.stringify(signatures.value));

      signaturesCopy.forEach((sign: IDataSign) => {
        if (
          !sign.name ||
          !sign.email ||
          !sign.page ||
          !sign.xPosition ||
          !sign.yPosition
        ) {
          isValid = false;
        }
        sign.yPosition -= 8;
      });

      const signers: ISigners[] = [];
      signaturesCopy.forEach((sign: IDataSign) => {
        const obj: ISignHereTab = {
          page: sign.page,
          xPosition: sign.xPosition,
          yPosition: sign.yPosition,
        };
        //Check exist by name and email
        const idx = signers.findIndex(
          (s) => s.name === sign.name && s.email === sign.email
        );
        if (idx >= 0) {
          signers[idx].signHereTabs.push(obj);
        } else {
          signers.push({
            name: sign.name,
            email: sign.email,
            signHereTabs: [obj],
          });
        }
      });

      if (isValid) {
        emit('finish', {
          signers: signers,
          name: docName.value,
          file: doc.value.file,
        } as IDataFinish);
      }
    };

    watch(
      () => formSign.value.name,
      function (value) {
        if (value) {
          formSign.value.name = value.replace(/[^a-zA-Z ]/g, '');
          // To lower case
          formSign.value.name = formSign.value.name.toLowerCase();
          //Came case to upper
          formSign.value.name = formSign.value.name
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        }
      }
    );

    watch(
      () => formSign.value.email,
      function (value) {
        if (value) {
          formSign.value.email = value.replace(/[^a-zA-Z0-9@.]/g, '');
          // To lower case
          formSign.value.email = formSign.value.email.toLowerCase();
        }
      }
    );

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
            'top: ' + (e.pageY - 10) + 'px; left: ' + (e.pageX - 10) + 'px;'
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

      const height = window.innerHeight;
      if (height) {
        heightWindow.value = height - 50;
      }

      window.addEventListener('resize', () => {
        const _height = window.innerHeight;
        if (_height) {
          heightWindow.value = _height - 50;
        }
      });
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
      heightWindow,
      signatures,
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
      finish,
      Close,
      Pencil,
      Reload,
      Check,
      Menu,
      Trash,
    };
  },
});
</script>
