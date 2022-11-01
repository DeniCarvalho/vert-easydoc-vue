<template>
  <div id="input-file-ved" ref="inputFileVed" class="ved-w-full ved-relative">
    <label
      v-if="!fileLink && uploadProgress === undefined"
      @drop.prevent="onDrop"
      :for="uniqueId"
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
      :id="uniqueId"
      type="file"
      :name="uniqueId"
      accept=".doc,.docx,application/pdf"
    />

    <Done
      v-if="fileLink"
      :link="fileLink"
      :filename="file?.name"
      @remove="removeFile"
    />

    <Uploading
      :class="{
        'ved-block': !fileLink && uploadProgress !== undefined,
        'ved-hidden': fileLink || uploadProgress === undefined,
      }"
      :uploadProgress="uploadProgress"
      @cancel="uploadCancel"
    />

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

import { Modal } from '../../widgets';
import { Small, Medium, Large } from './responsive';
import { Uploading, Done } from './states';
import { IPage, PageModel } from '@/models/page.model';
import { DocumentModel, IDocument } from '@/models/document.model';
import { SizeEnum } from '@/enums/size.enum';
import { useColor } from '@/composables/useColor';

export default defineComponent({
  name: 'VSInput',
  components: { Small, Medium, Large, Uploading, Done, Modal },
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
  setup(props, { emit }) {
    const { parseColor, formatColor } = useColor();
    const root = ref<any>(null);
    const styleRoot = ref<any>(null);

    const configComponent = ref<any>({
      settings: {
        ...{
          supportedTypes: 'PDF',
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

    const uniqueId = ref<string>('');
    const inputFileVed = ref<HTMLDivElement | null>(null);

    const labelFileRef = ref<any>(null);
    const fileRef = ref<any>(null);
    const modalRef = ref<any>(null);
    const isHover = ref(false);

    const documentFile = ref<File>();
    const file = ref<IDocument>();
    const uploadProgress = ref<number>();

    const request = ref<XMLHttpRequest>(new XMLHttpRequest());

    const close = () => {
      modalRef.value?.close();
    };

    const onFile = async (_file: File) => {
      try {
        const blob = _file.slice(0, _file.size, _file.type);
        const extension = _file.name.split('.').pop();
        const name = _file.name.split('.').shift();

        documentFile.value = new File([blob], `${name}.${extension}`, {
          type: _file.type,
        });

        const formData = new FormData();
        formData.append('file', documentFile.value);

        request.value = new XMLHttpRequest();

        request.value.upload.onprogress = (e) => {
          uploadProgress.value = 0;
          if (e.lengthComputable) {
            uploadProgress.value = (e.loaded / e.total) * 100;
          }
        };

        request.value.addEventListener('load', function () {
          if (request.value.status == 200) {
            const data = JSON.parse(request.value.response);
            if (documentFile.value) {
              const pages: IPage[] = data.pages.map((page: any) =>
                PageModel.fromJson(page)
              );
              uploadProgress.value = undefined;
              file.value = new DocumentModel({
                name: name ?? documentFile.value.name,
                extension: extension ?? '',
                pages,
                file: data.file || '',
              });

              // emit(
              //   'success',
              //   'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
              // );

              fileRef.value.value = '';
              modalRef.value?.openDocumentRef();
            }
          } else {
            if (request.value.response) {
              uploadProgress.value = undefined;
              const data = JSON.parse(request.value.response);
              throw new Error(data?.message || 'Error');
            } else throw new Error('Error');
          }
        });

        request.value.open('POST', configComponent.value.settings.endpoint);
        request.value.send(formData);
      } catch (error) {
        console.log(error);
      }
    };

    const uploadCancel = () => {
      request.value.abort();
      uploadProgress.value = undefined;
      fileRef.value.value = '';
      documentFile.value = undefined;
    };

    const removeFile = () => {
      file.value = undefined;
      documentFile.value = undefined;
      fileRef.value.value = '';
      emit('remove');
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

    const generatorId = (): any => {
      const _number = new Date().getTime();
      const id = `ved-select-file-input-${_number}`;
      const exist = document?.body?.querySelector(`#${id}`);

      if (exist) generatorId();
      else uniqueId.value = `ved-select-file-input-${Math.random()}`;
    };

    const events = ['dragenter', 'dragover', 'dragleave', 'drop'];
    onMounted(function () {
      generatorId();
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
    });

    onUnmounted(() => {
      events.forEach((eventName) => {
        const _document = document as any;
        _document?.body?.removeEventListener(eventName, preventDefaults);
      });
    });

    return {
      uniqueId,
      configComponent,
      inputFileVed,
      labelFileRef,
      fileRef,
      modalRef,
      isHover,
      file,
      uploadProgress,
      onFileChange,
      onDrop,
      close,
      openInfo,
      uploadCancel,
      removeFile,
    };
  },
});
</script>
