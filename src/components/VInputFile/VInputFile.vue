<template>
  <div id="input-file-ved" ref="inputFileVed" class="ved-w-full ved-relative">
    <label
      @drop.prevent="onDrop"
      for="select-file"
      :class="{
        'hover:ved-border-primaryPure hover:ved-bg-primaryPureLight': isHover,
        'ved-p-5': size === 'large',
        'ved-p-3': size === 'medium',
        'ved-p-1': size === 'small',
      }"
      class="ved-w-auto ved-h-auto ved-relative ved-group ved-p-5 ved-cursor-pointer ved-flex ved-flex-col ved-justify-center ved-items-center ved-border-2 ved-rounded-lg ved-border-disabledPure ved-border-dashed ved-duration-1000"
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
      />
    </label>
    <input
      ref="fileRef"
      hidden
      id="select-file"
      type="file"
      name="select-file"
      accept=".doc,.docx,application/pdf"
    />
    <div
      class="ved-w-auto ved-h-auto ved-relative ved-flex ved-justify-between ved-items-center ved-p-2 ved-rounded-lg ved-bg-primaryPureLight ved-mt-1 ved-border-0 ved-border-l-4 ved-border-primaryPure"
    >
      <div class="ved-w-auto ved-flex ved-items-center">
        <Icon :icon="CheckCircle" class="ved-text-success ved-h-6" />
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
    <Modal ref="modalRef" :file="document" />
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
import { Modal, Icon } from '../../widgets';
import { Small, Medium, Large } from './responsive';
import { IPage, PageModel } from '@/models/page.model';
import { DocumentModel, IDocument } from '@/models/document.model';
import { SizeEnum } from '@/enums/size.enum';

export default defineComponent({
  name: 'VSInput',
  components: { Small, Medium, Large, Icon, Modal },
  props: {
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
    colors: {
      type: Object as () => {
        primary?: string;
        secondary?: string;
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
    size: {
      type: String as PropType<SizeEnum>,
      default: SizeEnum.Medium,
    },
  },
  setup(props) {
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

    watch(
      () => props,
      (value) => {
        if (value) {
          configComponent.value = {
            ...configComponent.value,
            ...value,
          };
        }
      }
    );

    const inputFileVed = ref<HTMLDivElement | null>(null);

    const fileRef = ref<any>(null);
    const modalRef = ref<any>(null);
    const isHover = ref(false);

    const documentFile = ref<File>();
    const document = ref<IDocument>();

    const close = () => {
      modalRef.value?.close();
    };

    const onFile = async (file: File) => {
      try {
        const blob = file.slice(0, file.size, file.type);
        const extension = file.name.split('.').pop();
        const name = file.name.split('.').shift();

        documentFile.value = new File([blob], `${name}.${extension}`, {
          type: file.type,
        });
        console.log(documentFile.value);
        const formData = new FormData();
        formData.append('file', documentFile.value);

        const response = await fetch('http://localhost:5005/go', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();

        const pages: IPage[] = data.pages.map((page: any) =>
          PageModel.fromJson(page)
        );
        document.value = new DocumentModel({
          name: name ?? '',
          extension: extension ?? '',
          pages,
          file: documentFile.value,
        });

        fileRef.value.value = '';
        modalRef.value?.openDocumentRef();
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

    const preventDefaults = (e: any) => {
      e.preventDefault();
    };

    const events = ['dragenter', 'dragover', 'dragleave', 'drop'];
    onMounted(() => {
      events.forEach((eventName) => {
        const _document = document as any;
        _document?.body?.addEventListener(eventName, preventDefaults);
      });
      fileRef.value.onchange = onFileChange;
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

      fileRef,
      modalRef,
      isHover,
      document,
      onFileChange,
      onDrop,
      close,
      CheckCircle,
      TrashCan,
      Download,
    };
  },
});
</script>
