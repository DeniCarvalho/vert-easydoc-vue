<template>
  <div id="input-file-ved" ref="inputFileVed" class="ved-w-full ved-relative">
    <label
      v-if="!fileLink && uploadProgress === undefined"
      @drop.prevent="onDrop"
      for="select-file"
      ref="labelFileRef"
      :class="{
        'ved-p-5': size === 'large',
        'ved-p-3': size === 'medium',
        'ved-p-1': size === 'small',
      }"
      class="ved-w-auto ved-h-auto ved-relative ved-group ved-p-5 ved-cursor-pointer ved-flex ved-flex-col ved-justify-center ved-items-center ved-border-2 ved-rounded-lg ved-border-dashed ved-border-disabledPure ved-duration-1000"
    >
      <Large
        v-if="size === 'large'"
        :browserLink="configComponent.labels.browserLink"
        :dragDrop="configComponent.labels.dragDrop"
        :maxSizeLabel="configComponent.labels.maxSize"
        :maxSizeSettings="configComponent.settings.maxSize"
        :supportedTypesLabel="configComponent.labels.supportedTypes"
        :supportedTypesSettings="configComponent.settings.supportedTypes"
        @hover="isHover = true"
        @leave="isHover = false"
        @openInfo="openInfo"
      />
      <Medium
        v-else-if="size === 'medium'"
        :browserLink="configComponent.labels.browserLink"
        :dragDrop="configComponent.labels.dragDrop"
        :maxSizeLabel="configComponent.labels.maxSize"
        :maxSizeSettings="configComponent.settings.maxSize"
        :supportedTypesLabel="configComponent.labels.supportedTypes"
        :supportedTypesSettings="configComponent.settings.supportedTypes"
        @hover="isHover = true"
        @leave="isHover = false"
        @openInfo="openInfo"
      />
      <Small
        v-else
        :browserLink="configComponent.labels.browserLink"
        :dragDrop="configComponent.labels.dragDrop"
        :maxSizeLabel="configComponent.labels.maxSize"
        :maxSizeSettings="configComponent.settings.maxSize"
        :supportedTypesLabel="configComponent.labels.supportedTypes"
        :supportedTypesSettings="configComponent.settings.supportedTypes"
        @hover="isHover = true"
        @leave="isHover = false"
        @openInfo="openInfo"
      />
    </label>
    <input
      v-if="!fileLink"
      ref="fileRef"
      hidden
      id="select-file"
      type="file"
      name="select-file"
      accept=".doc,.docx,application/pdf"
    />
    <div
      v-if="fileLink"
      class="ved-w-auto ved-h-auto ved-relative ved-flex ved-justify-between ved-items-center ved-p-2 ved-rounded-lg ved-bg-primaryPureLight ved-mt-1 ved-border-0 ved-border-l-4 ved-border-solid ved-border-primaryPure"
    >
      <div class="ved-w-auto ved-flex ved-items-center">
        <Icon :icon="CheckCircle" class="ved-text-primaryPure ved-h-6" />
        <div class="ved-text-primaryPure ved-cursor-pointer ved-ml-2">
          {{ fileName }}
        </div>
      </div>
      <div class="ved-w-auto ved-flex ved-items-center">
        <Icon
          :icon="Download"
          :size="18"
          class="ved-text-primaryPure ved-mr-2"
        />
        <Icon :icon="TrashCan" :size="18" class="ved-text-primaryPure" />
      </div>
    </div>

    <div
      class="ved-w-full ved-relative"
      :class="{
        'ved-block': !fileLink && uploadProgress !== undefined,
        'ved-hidden': fileLink || uploadProgress === undefined,
      }"
    >
      <div class="ved-flex ved-mb-2 ved-items-center ved-justify-between">
        <div
          ref="bgLabelProgressRef"
          class="ved-flex ved-items-center ved-py-1 ved-px-2 ved-uppercase ved-rounded-lg ved-text-primaryPure"
        >
          <svg
            v-if="uploadProgress == 100"
            aria-hidden="true"
            class="ved-w-4 ved-h-4 ved-mr-1.5 ved-text-gray-200 ved-animate-spin-fast-custom-ved dark:ved-text-gray-600 ved-fill-primaryPure"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <div v-else class="ved-mr-1.5 ved-h-auto">
            <Icon
              :icon="Upload"
              class="ved-text-primaryPure ved-h-3 ved-animate-bounce-custom-ved"
              :size="14"
            />
          </div>
          <span class="ved-text-xs ved-font-semibold ved-inline-block">
            {{
              uploadProgress != 100 ? 'Fazendo upload' : 'Preparando arquivo'
            }}
          </span>
        </div>
        <div class="ved-text-right ved-flex ved-items-center">
          <Icon
            :size="14"
            :icon="CheckCircle"
            class="ved-text-primaryPure ved-mr-1 ved-mt-1"
            v-if="uploadProgress == 100"
          />
          <span
            class="ved-text-xs ved-font-semibold ved-inline-block ved-text-primaryPure"
          >
            {{ percentageUpload }}
          </span>
        </div>
      </div>
      <div
        ref="bgProgressRef"
        class="ved-overflow-hidden ved-h-2 ved-text-xs ved-flex ved-rounded-[3px]"
      >
        <div
          :style="{
            width: percentageUpload,
          }"
          class="ved-shadow-none ved-flex ved-flex-col ved-text-center ved-whitespace-nowrap ved-text-white ved-justify-center ved-bg-primaryPure ved-duration-[1700ms]"
        ></div>
      </div>
    </div>

    <Modal
      ref="modalRef"
      :file="file"
      :maxSizeLabel="configComponent.labels.maxSize"
      :maxSizeSettings="configComponent.settings.maxSize"
      :supportedTypesLabel="configComponent.labels.supportedTypes"
      :supportedTypesSettings="configComponent.settings.supportedTypes"
    />
  </div>
</template>
<style lang="scss" src="./VInputFile.scss" />
<script lang="ts">
import {
  defineComponent,
  onMounted,
  onUnmounted,
  PropType,
  ref,
  watch,
} from 'vue';
import CheckCircle from 'vue-material-design-icons/CheckCircle.vue';
import TrashCan from 'vue-material-design-icons/TrashCan.vue';
import Download from 'vue-material-design-icons/Download.vue';
import Upload from 'vue-material-design-icons/Upload.vue';
import { Modal, Icon } from '../../widgets';
import { Small, Medium, Large } from './responsive';
import { IPage, PageModel } from '@/models/page.model';
import { DocumentModel, IDocument } from '@/models/document.model';
import { SizeEnum } from '@/enums/size.enum';
import { useColor } from '@/composables/useColor';
import { computed } from '@vue/reactivity';

export default defineComponent({
  name: 'VSInput',
  components: { Small, Medium, Large, Icon, Modal },
  props: {
    fileLink: {
      type: String,
      required: false,
    },
    fileName: {
      type: String,
      default: 'Document template',
    },
    settings: {
      type: Object as () => {
        supportedTypes?: string;
        maxSize?: string;
        endpoint?: string;
        apiToken?: string;
      },
      required: false,
    },
    labels: {
      type: Object as () => {
        browserLink?: string;
        dragDrop?: string;
        supportedTypes?: string;
        maxSize?: string;
      },
      required: false,
    },
    colors: {
      type: Object as () => {
        primary?: string;
      },
      required: false,
    },
    size: {
      type: String as PropType<SizeEnum>,
      default: SizeEnum.Medium,
    },
  },
  setup(props) {
    const { parseColor, formatColor } = useColor();
    const root = ref<any>(null);
    const styleRoot = ref<any>(null);

    const configComponent = ref<any>({
      settings: {
        ...{
          supportedTypes: 'PDF, DOCX, DOC',
          maxSize: '10MB',
          endpoint: 'https://api.ved.com.br/v1/upload',
          apiToken: '',
        },
        ...props.settings,
      },
      labels: {
        ...{
          browserLink: 'Click',
          dragDrop: 'or drag the document',
          supportedTypes: 'Supports',
          maxSize: 'Size',
        },
        ...props.labels,
      },
      colors: {
        ...{
          primary: null,
          secondary: null,
        },
        ...props.colors,
      },
      size: props.size,
    });

    const inputFileVed = ref<HTMLDivElement | null>(null);

    const labelFileRef = ref<any>(null);
    const fileRef = ref<any>(null);
    const modalRef = ref<any>(null);
    const isHover = ref(false);

    const documentFile = ref<File>();
    const file = ref<IDocument>();
    const uploadProgress = ref<number>();
    const bgLabelProgressRef = ref<any>(null);
    const bgProgressRef = ref<any>(null);

    const close = () => {
      modalRef.value?.close();
    };

    const fakeProgress = () => {
      uploadProgress.value = 10;
      setTimeout(() => {
        uploadProgress.value = 100;
      }, 1000);
    };

    const onFile = async (_file: File) => {
      try {
        const blob = _file.slice(0, _file.size, _file.type);
        const extension = _file.name.split('.').pop();
        const name = _file.name.split('.').shift();

        documentFile.value = new File([blob], `${name}.${extension}`, {
          type: _file.type,
        });
        console.log(documentFile.value);
        const formData = new FormData();
        formData.append('file', documentFile.value);

        const req = new XMLHttpRequest();

        req.upload.onprogress = (e) => {
          uploadProgress.value = 0;
          if (e.lengthComputable) {
            uploadProgress.value = (e.loaded / e.total) * 100;
          }
        };

        req.addEventListener('load', function () {
          if (req.status == 200) {
            const data = JSON.parse(req.response);
            if (documentFile.value) {
              const pages: IPage[] = data.pages.map((page: any) =>
                PageModel.fromJson(page)
              );
              file.value = new DocumentModel({
                name: name ?? '',
                extension: extension ?? '',
                pages,
                file: documentFile.value,
              });

              fileRef.value.value = '';
              // modalRef.value?.openDocumentRef();
            }
          } else {
            if (req.response) {
              const data = JSON.parse(req.response);
              throw new Error(data?.message || 'Error');
            } else throw new Error('Error');
          }
        });

        req.upload.onerror = () => {
          console.error('Upload failed.');
        };

        req.upload.onabort = () => {
          console.error('Upload cancelled.');
        };

        req.open('POST', configComponent.value.settings.endpoint);
        req.send(formData);
      } catch (error) {
        console.log(error);
      }
    };

    const onFileChange = (e: any) => {
      const file: File = e.target.files[0];
      onFile(file);
    };

    const onDrop = (e: any) => {
      const file: File = e.dataTransfer.files[0];
      onFile(file);
    };

    const openInfo = () => {
      modalRef.value?.openInfo();
    };

    const preventDefaults = (e: any) => {
      e.preventDefault();
    };

    const percentageUpload = computed(() => {
      return uploadProgress.value != undefined
        ? Math.round(uploadProgress.value) + '%'
        : '';
    });

    const events = ['dragenter', 'dragover', 'dragleave', 'drop'];
    onMounted(function () {
      events.forEach((eventName) => {
        document?.body?.addEventListener(eventName, preventDefaults);
      });
      fileRef.value.onchange = onFileChange;

      root.value = document.querySelector(':root');
      styleRoot.value = getComputedStyle(document.body);

      if (
        configComponent.value.colors?.primary ||
        !styleRoot.value.getPropertyValue('--primary-pure-color-custom-ved')
      ) {
        root.value.style.setProperty(
          '--primary-pure-color-custom-ved',
          configComponent.value.colors?.primary ||
            styleRoot.value.getPropertyValue('--primary-color-default-ved')
        );
      }

      watch(
        () => isHover.value,
        function (value) {
          if (value) {
            labelFileRef.value.style.backgroundColor = parseColor(
              configComponent.value.colors?.primary ||
                styleRoot.value.getPropertyValue('--primary-color-default-ved'),
              { loose: false },
              0.06
            );
            labelFileRef.value.style.borderColor = parseColor(
              configComponent.value.colors?.primary ||
                styleRoot.value.getPropertyValue('--primary-color-default-ved'),
              { loose: false },
              1
            );
          } else {
            labelFileRef.value.style.backgroundColor = formatColor({
              mode: 'rgba',
              color: ['0', '0', '0'],
              alpha: 0,
            });
            labelFileRef.value.style.borderColor = parseColor(
              styleRoot.value.getPropertyValue('--default-color-ved'),
              { loose: false },
              1
            );
          }
        }
      );

      bgLabelProgressRef.value.style.backgroundColor = parseColor(
        configComponent.value.colors?.primary ||
          styleRoot.value.getPropertyValue('--primary-color-default-ved'),
        { loose: false },
        0.1
      );
      bgProgressRef.value.style.backgroundColor = parseColor(
        configComponent.value.colors?.primary ||
          styleRoot.value.getPropertyValue('--primary-color-default-ved'),
        { loose: false },
        0.1
      );
    });

    onUnmounted(() => {
      events.forEach((eventName) => {
        const _document = document as any;
        _document?.body?.removeEventListener(eventName, preventDefaults);
      });
    });

    return {
      configComponent,
      inputFileVed,
      labelFileRef,
      fileRef,
      modalRef,
      isHover,
      file,
      uploadProgress,
      percentageUpload,
      bgLabelProgressRef,
      bgProgressRef,
      onFileChange,
      onDrop,
      close,
      openInfo,
      CheckCircle,
      TrashCan,
      Download,
      Upload,
    };
  },
});
</script>
